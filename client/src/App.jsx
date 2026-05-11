import { Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ConfirmModal from './components/ConfirmModal';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

function App() {
  const { token, logout } = useContext(AuthContext);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      backgroundColor: '#f4f4f9',
      minHeight: '100vh',
    }}
    >
      <style>{
        `body {
        margin: 0; 
        padding: 0;
        }`}
      </style>
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
              onClick={() => setIsLogoutModalOpen(true)}
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
              Kijelentkezés
            </button>
          </>
        )}
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        message="Biztosan ki akar lépni?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
