import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token, user } = useContext(AuthContext);

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

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Heti Szavazások</h1>
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
    </div>
  );
}
