import React, { useState } from 'react';
import Login from './components/login.jsx';
import Dashboard from './components/dashboard.jsx';

function App() {
  // This is a placeholder for authentication state.
  // It uses a simple boolean `isAuthenticated` to track if the user is logged in.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This function gets passed down to the Login component.s
  // When login is successful, the Login component calls this function
  // to tell the App component to change the state.
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app-container">
      {/* This is a ternary operator. It's a simple if/else statement.
        IF `isAuthenticated` is true, render the <Dashboard />.
        ELSE, render the <Login />.
      */}
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

