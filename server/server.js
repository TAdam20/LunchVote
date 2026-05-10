require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const authMiddleware = require('./middleware/authMiddleware');
const pollsFilePath = path.join(__dirname, 'data', 'polls.json');
let polls = JSON.parse(fs.readFileSync(pollsFilePath, 'utf-8'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

app.get('/', (req, res) => {
  res.send('A LunchVote backend fut!');
});

// --- LOGIN VÉGPONT ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Hibás felhasználónév vagy jelszó!' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Sikeres bejelentkezés!',
    token: token,
    user: { id: user.id, username: user.username }
  });
});

app.get('/api/polls', authMiddleware, (req, res) => {
  res.json(polls);
});

// --- CREATE ---
app.post('/api/polls', authMiddleware, (req, res) => {
  const { title, options } = req.body; 

  const newPoll = {
    id: Date.now(), 
    title: title,
    options: options.split(',').map((opt, index) => ({
      id: `opt${Date.now()}${index}`,
      name: opt.trim(),
      votes: 0
    })),
    votedUsers: []
  };

  polls.push(newPoll);
  fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));
  res.status(201).json({ message: 'Szavazás sikeresen létrehozva!', poll: newPoll });
});

// --- UPDATE ---
app.put('/api/polls/:pollId', authMiddleware, (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const { title } = req.body;

  const poll = polls.find(p => p.id === pollId);
  if (!poll) return res.status(404).json({ message: 'Szavazás nem található!' });

  poll.title = title;
  
  fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));
  res.json({ message: 'Szavazás sikeresen frissítve!', poll });
});

// --- DELETE ---
app.delete('/api/polls/:pollId', authMiddleware, (req, res) => {
  const pollId = parseInt(req.params.pollId);
  
  const initialLength = polls.length;
  polls = polls.filter(p => p.id !== pollId); 

  if (polls.length === initialLength) {
    return res.status(404).json({ message: 'Szavazás nem található!' });
  }

  fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));
  res.json({ message: 'Szavazás sikeresen törölve!' });
});

// --- SZAVAZAT LEADÁSA ---
app.post('/api/polls/:pollId/vote', authMiddleware, (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const { optionId } = req.body;
  const userId = req.user.id; 

  const poll = polls.find(p => p.id === pollId);
  if (!poll) return res.status(404).json({ message: 'Szavazás nem található!' });

  if (poll.votedUsers.includes(userId)) {
    return res.status(400).json({ message: 'Már leadtad a szavazatod erre!' });
  }

  const option = poll.options.find(o => o.id === optionId);
  if (!option) return res.status(404).json({ message: 'Opció nem található!' });

  option.votes += 1;
  poll.votedUsers.push(userId);

  fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));

  res.json({ message: 'Sikeres szavazás!', poll });
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen...`);
});
