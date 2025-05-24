async function showAdminDashboard() {
  const res = await fetch(`${apiBase}/users`, {
    headers: { Authorization: `Bearer ${state.token}` }
  });
  const users = await res.json();
  let html = `<h2 class="text-xl font-bold mb-4">Admin Dashboard</h2><div class="space-y-2">`;
  users.forEach(user => {
    html += `<div class="p-4 border rounded"><strong>${user.name}</strong><br>${user.email}</div>`;
  });
  html += `</div><button onclick="logout()" class="bg-gray-700 text-white px-4 py-2 rounded mt-4">Logout</button>`;
  document.getElementById('app').innerHTML = html;
}
