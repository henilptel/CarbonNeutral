import db from '../config/database.js';

export const registerUser = (req, res) => {
  console.log('📝 Registration request received');
  const { username, password } = req.body;
  
  console.log('📝 Registration request received:', { username });

  if (!username || !password) {
    console.log('❌ Registration failed: Missing required fields');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  
  db.run(query, [username, password], function(err) {
    if (err) {
      console.error('❌ Registration error:', err.message);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Error creating user' });
    }
    
    console.log('✅ User registered successfully:', { id: this.lastID, username });
    res.status(201).json({
      message: 'User registered successfully',
      userId: this.lastID
    });
  });
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;
  console.log('🔑 Login attempt for user:', username);

  if (!username || !password) {
    console.log('❌ Login failed: Missing credentials');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const query = 'SELECT id, username FROM users WHERE username = ? AND password = ?';
  
  db.get(query, [username, password], (err, user) => {
    if (err) {
      console.error('❌ Login error:', err.message);
      return res.status(500).json({ error: 'Error during login' });
    }
    
    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    console.log('✅ Login successful:', { username: user.username, id: user.id });
    res.json({
      message: 'Login successful',
      userId: user.id,
      username: user.username
    });
  });
};
