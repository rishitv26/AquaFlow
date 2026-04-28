const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper to promisify database calls
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Default user (for local development)
const DEFAULT_USER_EMAIL = 'user@aquaflow.local';

// ==================== AUTHENTICATION ====================
// GET /api/me - Get current user
app.get('/api/me', async (req, res) => {
  try {
    const user = await getAsync(
      'SELECT * FROM users WHERE email = ?',
      [DEFAULT_USER_EMAIL]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== HYDRATION LOGS ====================
// GET /api/hydration-logs - List all or filter by date
app.get('/api/hydration-logs', async (req, res) => {
  try {
    const { startDate, endDate, limit = 1000, sort = '-timestamp' } = req.query;
    
    let sql = 'SELECT * FROM hydration_log';
    let params = [];
    let conditions = [];

    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
    }

    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Handle sorting
    if (sort === '-timestamp') {
      sql += ' ORDER BY timestamp DESC';
    } else if (sort === 'timestamp') {
      sql += ' ORDER BY timestamp ASC';
    }

    sql += ` LIMIT ${parseInt(limit)}`;

    const logs = await allAsync(sql, params);
    res.json(logs);
  } catch (err) {
    console.error('Error fetching hydration logs:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/hydration-logs - Create new log
app.post('/api/hydration-logs', async (req, res) => {
  try {
    const { amount_ml, timestamp, source = 'manual' } = req.body;

    if (!amount_ml || !timestamp) {
      return res.status(400).json({ error: 'amount_ml and timestamp are required' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await runAsync(
      `INSERT INTO hydration_log (id, amount_ml, timestamp, source, created_by, created_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, amount_ml, timestamp, source, DEFAULT_USER_EMAIL, now]
    );

    const newLog = await getAsync(
      'SELECT * FROM hydration_log WHERE id = ?',
      [id]
    );

    res.status(201).json(newLog);
  } catch (err) {
    console.error('Error creating hydration log:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/hydration-logs/:id - Update log
app.put('/api/hydration-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount_ml, timestamp, source } = req.body;

    const updates = [];
    const params = [];

    if (amount_ml !== undefined) {
      updates.push('amount_ml = ?');
      params.push(amount_ml);
    }

    if (timestamp !== undefined) {
      updates.push('timestamp = ?');
      params.push(timestamp);
    }

    if (source !== undefined) {
      updates.push('source = ?');
      params.push(source);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    await runAsync(
      `UPDATE hydration_log SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedLog = await getAsync(
      'SELECT * FROM hydration_log WHERE id = ?',
      [id]
    );

    res.json(updatedLog);
  } catch (err) {
    console.error('Error updating hydration log:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/hydration-logs/:id - Delete log
app.delete('/api/hydration-logs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await runAsync('DELETE FROM hydration_log WHERE id = ?', [id]);
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) {
    console.error('Error deleting hydration log:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== USER SETTINGS ====================
// GET /api/user-settings - List all settings
app.get('/api/user-settings', async (req, res) => {
  try {
    const settings = await allAsync(
      'SELECT * FROM user_settings WHERE user_id = (SELECT id FROM users WHERE email = ?)',
      [DEFAULT_USER_EMAIL]
    );

    res.json(settings);
  } catch (err) {
    console.error('Error fetching user settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/user-settings - Create new settings
app.post('/api/user-settings', async (req, res) => {
  try {
    const {
      daily_goal_ml = 2500,
      bottle_capacity_ml = 750,
      reminder_interval_minutes = 60,
      reminders_enabled = true,
      weight_kg = 70,
      user_mode = 'default'
    } = req.body;

    const user = await getAsync(
      'SELECT id FROM users WHERE email = ?',
      [DEFAULT_USER_EMAIL]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await runAsync(
      `INSERT INTO user_settings (id, user_id, daily_goal_ml, bottle_capacity_ml, reminder_interval_minutes, reminders_enabled, weight_kg, user_mode, created_date, updated_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, user.id, daily_goal_ml, bottle_capacity_ml, reminder_interval_minutes, reminders_enabled, weight_kg, user_mode, now, now]
    );

    const newSettings = await getAsync(
      'SELECT * FROM user_settings WHERE id = ?',
      [id]
    );

    res.status(201).json(newSettings);
  } catch (err) {
    console.error('Error creating user settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/user-settings/:id - Update settings
app.put('/api/user-settings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      daily_goal_ml,
      bottle_capacity_ml,
      reminder_interval_minutes,
      reminders_enabled,
      weight_kg,
      user_mode
    } = req.body;

    const updates = [];
    const params = [];

    if (daily_goal_ml !== undefined) {
      updates.push('daily_goal_ml = ?');
      params.push(daily_goal_ml);
    }

    if (bottle_capacity_ml !== undefined) {
      updates.push('bottle_capacity_ml = ?');
      params.push(bottle_capacity_ml);
    }

    if (reminder_interval_minutes !== undefined) {
      updates.push('reminder_interval_minutes = ?');
      params.push(reminder_interval_minutes);
    }

    if (reminders_enabled !== undefined) {
      updates.push('reminders_enabled = ?');
      params.push(reminders_enabled ? 1 : 0);
    }

    if (weight_kg !== undefined) {
      updates.push('weight_kg = ?');
      params.push(weight_kg);
    }

    if (user_mode !== undefined) {
      updates.push('user_mode = ?');
      params.push(user_mode);
    }

    updates.push('updated_date = ?');
    params.push(new Date().toISOString());

    if (updates.length === 1) { // Only updated_date
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    await runAsync(
      `UPDATE user_settings SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedSettings = await getAsync(
      'SELECT * FROM user_settings WHERE id = ?',
      [id]
    );

    res.json(updatedSettings);
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== USERS ====================
// GET /api/users - List all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await allAsync('SELECT id, email, full_name, created_at FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AquaFlow backend is running' });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`\n✓ AquaFlow backend running on http://localhost:${PORT}`);
  console.log(`✓ API endpoints available at http://localhost:${PORT}/api\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`Try using a different port or kill the existing process:\n`);
    console.error(`  lsof -i :${PORT}`);
    console.error(`  kill -9 <PID>\n`);
  }
  process.exit(1);
});
