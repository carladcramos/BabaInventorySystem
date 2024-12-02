document.addEventListener('DOMContentLoaded', () => {
  const userId = '674487549b3be38559c58fc3'; // Use the specific ID from your database

  // Fetch user details
  fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      return response.json();
    })
    .then((user) => {
      document.getElementById('username').value = user.username || '';
      document.getElementById('email').value = user.email || '';
    })
    .catch((error) => {
      console.error('Error fetching user details:', error);
      alert('Failed to load account details.');
    });

  // Update user details
  document.getElementById('update-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const updateData = { username, email };
    if (password) updateData.password = password;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account updated successfully!');
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('An error occurred. Please try again.');
    }
  });
});
