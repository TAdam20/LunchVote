require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const pollsFilePath = path.join(__dirname, 'data', 'polls.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
const polls = JSON.parse(fs.readFileSync(pollsFilePath, 'utf-8'));

app.get('/', (req, res) => {
  res.send('A LunchVote backend fut!');
});

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

app.get('/api/polls', (req, res) => {
  res.json(polls);
});

app.listen(PORT, () => {
  console.log(`Szerver fut a http://localhost:${PORT} címen...`);
});
