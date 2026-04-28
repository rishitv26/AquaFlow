const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file location
const dbPath = path.join(__dirname, 'aquaflow.db');

// Create or open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Initialize tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // HydrationLog table
    db.run(`
      CREATE TABLE IF NOT EXISTS hydration_log (
        id TEXT PRIMARY KEY,
        amount_ml REAL NOT NULL,
        timestamp TEXT NOT NULL,
        source TEXT CHECK(source IN ('bottle_sync', 'manual')) DEFAULT 'manual',
        created_by TEXT,
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(email)
      )
    `);

    // UserSettings table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        daily_goal_ml INTEGER DEFAULT 2500,
        bottle_capacity_ml INTEGER DEFAULT 750,
        reminder_interval_minutes INTEGER DEFAULT 60,
        reminders_enabled BOOLEAN DEFAULT 1,
        weight_kg REAL,
        user_mode TEXT DEFAULT 'default',
        created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (!err) {
        console.log('Database tables initialized');
        // Add user_mode column if it doesn't exist (for existing databases)
        db.run(`ALTER TABLE user_settings ADD COLUMN user_mode TEXT DEFAULT 'default'`, (alterErr) => {
          if (alterErr && !alterErr.message.includes('Duplicate column')) {
            console.log('Existing user_mode column already present or added');
          }
        });
        seedDatabase();
      }
    });
  });
}

// Seed sample data
function seedDatabase() {
  db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
    if (err) {
      console.error('Error checking database:', err);
      return;
    }

    // Only seed if empty
    if (row.count === 0) {
      const { v4: uuidv4 } = require('uuid');
      
      const userId = uuidv4();
      const userEmail = 'user@aquaflow.local';
      const settingsId = uuidv4();

      // Insert user
      db.run(
        'INSERT INTO users (id, email, full_name) VALUES (?, ?, ?)',
        [userId, userEmail, 'Local User'],
        (err) => {
          if (!err) {
            console.log('✓ Sample user created');
          }
        }
      );

      // Insert user settings
      db.run(
        `INSERT INTO user_settings (id, user_id, daily_goal_ml, bottle_capacity_ml, reminder_interval_minutes, reminders_enabled, weight_kg)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [settingsId, userId, 2500, 750, 60, 1, 70],
        (err) => {
          if (!err) {
            console.log('✓ Default user settings created');
          }
        }
      );

      // Insert sample hydration logs for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sampleLogs = [
        { amount: 250, hour: 8 },
        { amount: 300, hour: 10 },
        { amount: 280, hour: 12 },
        { amount: 320, hour: 14 },
        { amount: 280, hour: 16 },
        { amount: 350, hour: 18 }
      ];

      sampleLogs.forEach((log) => {
        const logTime = new Date(today);
        logTime.setHours(log.hour, Math.random() * 60, 0, 0);
        const logId = uuidv4();

        db.run(
          `INSERT INTO hydration_log (id, amount_ml, timestamp, source, created_by)
           VALUES (?, ?, ?, ?, ?)`,
          [logId, log.amount, logTime.toISOString(), 'manual', userEmail],
          (err) => {
            if (!err) {
              console.log(`✓ Sample log created: ${log.amount}ml at ${log.hour}:00`);
            }
          }
        );
      });
    }
  });
}

module.exports = db;
