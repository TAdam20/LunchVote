import { Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

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
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/results" style={{ color: 'white', textDecoration: 'none' }}>
              Eredmenyek
            </Link>

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
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
