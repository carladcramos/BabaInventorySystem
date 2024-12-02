document.getElementById('login-btn').addEventListener('click', async function () {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userId', data.user._id); // Store user ID
      localStorage.setItem('auth-token', data.token); // Store JWT token
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred. Please try again.');
  }
});
