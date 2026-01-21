
import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5175/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loginOrEmail: 'testuser',
        senha: 'password123'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Body:', data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testLogin();
