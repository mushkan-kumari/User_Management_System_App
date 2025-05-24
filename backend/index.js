const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

const SECRET = process.env.JWT_SECRET || "secret";

// Registration
app.post("/register", async (req, res) => {
  const { name, email, password, age } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, 'user')",
    [name, email, hashed, age],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error registering user" });
      res.status(201).json({ message: "User registered" });
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, age: user.age }, token });

  });
});

// Middleware to verify token
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Get all users (admin only)
app.get("/users", authenticate, (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  db.query("SELECT id, name, email, age, role FROM users", (err, results) => {
  if (err) return res.status(500).json({ message: "Error fetching users" });
  res.json(results);
});
});

// Update user
app.put("/users/:id", authenticate, (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) return res.sendStatus(403);
  const { name, age } = req.body;

  db.query("UPDATE users SET name = ?, age = ? WHERE id = ?", [name, age, req.user.id], err => {
    if (err) return res.status(500).json({ message: "Update failed" });
    db.query("SELECT id, name, email, age, role FROM users WHERE id = ?", [req.user.id], (err, results) => {
      res.json(results[0]);
    });
  });
});

// Delete user
app.delete("/users/:id", authenticate, (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) return res.sendStatus(403);
  db.query("DELETE FROM users WHERE id = ?", [req.user.id], err => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "User deleted" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));