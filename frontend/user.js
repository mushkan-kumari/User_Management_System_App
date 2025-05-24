async function showUserDashboard() {
  document.getElementById('app').innerHTML = `
    <h2 class="text-xl font-bold mb-4">Welcome, ${state.user.name}</h2>
    <p class="mb-2">Email: ${state.user.email}</p>
    <input id="newName" class="w-full border p-2 mb-2" type="text" placeholder="New Name" value="${state.user.name}" />
    <input id="newAge" class="w-full border p-2 mb-2" type="number" placeholder="New Age" value="${state.user.age}" min="0" />
    <button onclick="updateProfile()" class="bg-green-500 text-white px-4 py-2 rounded">Update Profile</button>
    <button onclick="deleteAccount()" class="bg-red-500 text-white px-4 py-2 rounded mt-2">Delete Account</button>
    <button onclick="logout()" class="bg-gray-700 text-white px-4 py-2 rounded mt-4">Logout</button>
  `;
}

async function updateProfile() {
  const newName = document.getElementById('newName').value;
  const newAge = parseInt(document.getElementById('newAge').value);

  const res = await fetch(`${apiBase}/users/${state.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.token}`
    },
    body: JSON.stringify({ name: newName, age: newAge })
  });

  if (res.ok) {
    const updated = await res.json();
    state.user = updated;
    showUserDashboard();
  } else {
    alert('Failed to update profile');
  }
}


async function deleteAccount() {
  const res = await fetch(`${apiBase}/users/${state.user.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${state.token}` }
  });
  if (res.ok) {
    alert('Account deleted');
    logout();
  } else {
    alert('Failed to delete account');
  }
}

function logout() {
  state.user = null;
  state.token = null;
  state.isAdmin = false;
  showLoginForm();
}
