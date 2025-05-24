function showLoginForm() {
  document.getElementById('app').innerHTML = `
    <h2 class="text-xl font-bold mb-4">Login</h2>
    <input id="email" class="w-full border p-2 mb-2" type="email" placeholder="Email" />
    <input id="password" class="w-full border p-2 mb-4" type="password" placeholder="Password" />
    <button onclick="login()" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    <p class="mt-4 text-sm">Don't have an account? <a href="#" onclick="showRegisterForm()" class="text-blue-500">Register</a></p>
  `;
}

function showRegisterForm() {
  document.getElementById('app').innerHTML = `
    <h2 class="text-xl font-bold mb-4">Register</h2>
    <input id="name" class="w-full border p-2 mb-2" type="text" placeholder="Name" />
    <input id="email" class="w-full border p-2 mb-2" type="email" placeholder="Email" />
    <input id="password" class="w-full border p-2 mb-4" type="password" placeholder="Password" />
    <input id="age" class="w-full border p-2 mb-4" type="number" placeholder="Age" min="0" />
    <button onclick="register()" class="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    <p class="mt-4 text-sm">Already have an account? <a href="#" onclick="showLoginForm()" class="text-blue-500">Login</a></p>
  `;
}

/*
async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${apiBase}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (res.ok) {
    alert('Registration successful. Please login.');
    showLoginForm();
  } else {
    alert('Registration failed');
  }
}*/

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const age = parseInt(document.getElementById('age').value);

  const res = await fetch(`${apiBase}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, age })
  });

  if (res.ok) {
    alert('Registration successful. Please login.');
    showLoginForm();
  } else {
    const err = await res.json();
    alert(`Registration failed: ${err.message}`);
  }
}

/*
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    state.user = data.user;
    state.token = data.token;
    state.isAdmin = data.user.role === 'admin';
    state.isAdmin ? showAdminDashboard() : showUserDashboard();
  } else {
    alert('Login failed');
  }
}
  */

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    state.user = data.user;  
    state.token = data.token;
    state.isAdmin = data.user.role === 'admin';
    alert(`Welcome ${data.user.name}, Age: ${data.user.age}`);

    state.isAdmin ? showAdminDashboard() : showUserDashboard();
  } else {
    alert(`Login failed: ${data.message || 'Invalid credentials'}`);
  }
}

