import { BrowserRouter, Routes, Route } from "react-router-dom";

// Temporary simple components for testing
const HomePage = () => (
  <div style={{ 
    padding: '40px', 
    backgroundColor: '#4CAF50', 
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '20px'
  }}>
    <h1>SafeGo Home Page</h1>
    <p>If you can see this, the router is working correctly!</p>
    <p>Current time: {new Date().toLocaleTimeString()}</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="app" style={{ 
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>SafeGo Bus System</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
