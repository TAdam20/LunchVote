import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token, user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentPollId, setCurrentPollId] = useState(null);
  const [formData, setFormData] = useState({ title: '', options: '' });

  const [pollToDelete, setPollToDelete] = useState(null);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setPolls(await response.json());
      }
    } catch (err) {
      setError('Hiba a szavazások betöltésekor.');
    }
  };

  useEffect(() => { fetchPolls(); }, []);

  const handleVote = async (pollId, optionId) => {
    setError(''); setMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ optionId })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Sikeres szavazás!');
        fetchPolls();
      } else setError(data.message);
    } catch (err) { setError('Hiba a szavazásnál.'); }
  };

  const executeDelete = async () => {
    if (!pollToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/polls/${pollToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage('Szavazás törölve!');
        fetchPolls();
      }
    } catch (err) {
      setError('Hiba a törlés során.');
    } finally {
      setPollToDelete(null);
    }
  };

  const openModal = (mode, poll = null) => {
    setModalMode(mode);
    if (mode === 'edit' && poll) {
      setCurrentPollId(poll.id);
      setFormData({ title: poll.title, options: '' });
    } else {
      setFormData({ title: '', options: '' });
    }
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const url = modalMode === 'create'
      ? 'http://localhost:5000/api/polls'
      : `http://localhost:5000/api/polls/${currentPollId}`;
    const method = modalMode === 'create' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(modalMode === 'create' ? 'Új szavazás kiírva!' : 'Szavazás frissítve!');
        setIsModalOpen(false);
        fetchPolls();
      }
    } catch (err) { setError('Hiba a mentés során.'); }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Heti Szavazások</h1>
        <button onClick={() => openModal('create')} style={{ padding: '0.6rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Új Szavazás
        </button>
      </div>

      <p>Szia, <strong>{user?.username}</strong>! Mit együnk pénteken?</p>

      {message && <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>{message}</div>}
      {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>{error}</div>}

      {polls.map((poll) => {
        const hasVoted = poll.votedUsers.includes(user?.id);

        return (
          <div key={poll.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{poll.title}</h2>

              <div>
                <button onClick={() => openModal('edit', poll)} style={{ padding: '0.4rem', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => setPollToDelete(poll.id)} style={{ padding: '0.4rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {poll.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleVote(poll.id, option.id)}
                  disabled={hasVoted}
                  style={{
                    padding: '1rem', fontSize: '1rem', border: 'none', borderRadius: '5px', transition: '0.2s',
                    cursor: hasVoted ? 'not-allowed' : 'pointer',
                    background: hasVoted ? '#e9ecef' : '#007BFF',
                    color: hasVoted ? '#6c757d' : 'white',
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
            {hasVoted && <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>Erre a szavazásra már leadtad a voksod!</p>}
          </div>
        );
      })}

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
            <h2>{modalMode === 'create' ? 'Új Szavazás Létrehozása' : 'Szavazás Szerkesztése'}</h2>

            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontWeight: 'bold' }}>Kérdés / Cím:</label>
                <input
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Pl. Keddi reggeli péksüti"
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', boxSizing: 'border-box' }}
                />
              </div>

              {modalMode === 'create' && (
                <div>
                  <label style={{ fontWeight: 'bold' }}>Opciók (vesszővel elválasztva):</label>
                  <input
                    type="text" required
                    value={formData.options}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                    placeholder="Pl. Kakaós csiga, Túrós táska, Pogácsa"
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.8rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Mégse
                </button>
                <button type="submit" style={{ flex: 1, padding: '0.8rem', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Mentés
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={pollToDelete !== null}
        message="Biztosan törölni szeretnéd ezt a szavazást?"
        onConfirm={executeDelete}
        onCancel={() => setPollToDelete(null)}
      />

    </div>
  );
}
