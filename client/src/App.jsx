import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div>
      <nav
        style={{
          padding: '1rem',
          background: '#333',
          color: 'white',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <h2>LunchVote</h2>

        {!token && (
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}

        {token && (
          <button
            onClick={logout}
            style={{
              marginLeft: 'auto',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            Kijelentkezes
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
