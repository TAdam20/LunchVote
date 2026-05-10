import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Results() {
  const [polls, setPolls] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/polls', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPolls(data);
        }
      } catch (err) {
        console.error('Hiba az eredmenyek betoltesekor');
      }
    };

    fetchPolls();
  }, [token]);

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '1rem' }}>
      <h1>Eredmenyek</h1>
      <p style={{ marginBottom: '2rem' }}>Igy allnak jelenleg a szavazasok:</p>

      {polls.map((poll) => {
        const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

        return (
          <div key={poll.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
            <h2>{poll.title}</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Osszes szavazat: <strong>{totalVotes}</strong></p>

            {poll.options.map((option) => {
              const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);

              return (
                <div key={option.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong>{option.name}</strong>
                    <span>{option.votes} szavazat ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', background: '#e9ecef', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: '#28a745',
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
