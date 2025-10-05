// Simple test to verify the app is working
console.log('SafeGo Frontend - Testing Server Response');

async function testServer() {
  try {
    const response = await fetch('http://localhost:5175/');
    const html = await response.text();
    console.log('Server Response Status:', response.status);
    console.log('Server Response OK:', response.ok);
    console.log('HTML Contains React Root:', html.includes('id="root"'));
    console.log('HTML Contains Script:', html.includes('main.jsx'));
    
    if (response.ok) {
      console.log('✅ Server is responding correctly');
    } else {
      console.log('❌ Server error:', response.status);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testServer();