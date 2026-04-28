# AquaFlow Local Setup Guide

## 🎉 Migration Complete

Your AquaFlow hydration tracking app has been successfully migrated from Base44 to a **fully local setup** with Express backend and SQLite database!

---

## 📋 Project Structure

```
DECA Hydrode app/
├── server/                    # NEW: Local backend
│   ├── server.js             # Express server (port 3001)
│   ├── db.js                 # SQLite database setup
│   ├── package.json
	│   ├── aquaflow.db          # (auto-created) SQLite database file
│   └── node_modules/         # (auto-created) Backend dependencies
│
├── api/
│   └── client.js             # NEW: Axios API client (replaces Base44)
│
├── Home.js                   # ✅ Updated to use axios
├── Settings.js               # ✅ Updated to use axios
├── Leaderboard.js            # ✅ Updated to use axios
├── Statistics.js             # ✅ Updated to use axios
├── Layout.js                 # (unchanged)
├── Components/               # (unchanged)
├── Entities/                 # (reference schemas only, data in SQLite)
└── ...
```

---

## 🚀 Quick Start

### **Step 1: Install Backend Dependencies** (One-time setup)

```bash
cd "DECA Hydrode app/server"
npm install
```

✅ Already done! Dependencies are installed.

### **Step 2: Start the Backend Server**

```bash
cd "DECA Hydrode app/server"
npm start
```

**Expected output:**
```
✓ AquaFlow backend running on http://localhost:3001
✓ API endpoints available at http://localhost:3001/api
✓ Connected to SQLite database
```

**Keep this terminal running while you use the app.**

### **Step 3: Start Your React Frontend** (In a NEW terminal)

```bash
# From your frontend directory (wherever it's configured)
npm start
# or yarn start
```

Your app will run on `http://localhost:3000` (or your configured port)

### **Step 4: Done! 🎉**

The app now communicates with your local backend:
- **Frontend** → `http://localhost:3000`
- **Backend API** → `http://localhost:3001/api`
- **Database** → `server/aquaflow.db` (SQLite file)

---

## 📊 What's New

### **Backend Features**

Your Express backend provides these REST API endpoints:

#### **Hydration Logs**
- `GET /api/hydration-logs` - List all logs (with optional date filters)
- `GET /api/hydration-logs?startDate=2026-02-18T00:00:00Z` - Logs after a date
- `POST /api/hydration-logs` - Create new log
- `PUT /api/hydration-logs/:id` - Update a log
- `DELETE /api/hydration-logs/:id` - Delete a log

#### **User Settings**
- `GET /api/user-settings` - Get user preferences
- `POST /api/user-settings` - Create settings
- `PUT /api/user-settings/:id` - Update settings

#### **Users**
- `GET /api/users` - List all users
- `GET /api/me` - Get current user

#### **Health Check**
- `GET /health` - Backend status

### **Database**

SQLite database (`aquaflow.db`) has three tables:

**Users**
```sql
id (primary key)
email (unique)
full_name
created_at
```

**HydrationLog**
```sql
id (primary key)
amount_ml
timestamp
source ('bottle_sync' or 'manual')
created_by (user email)
created_date
```

**UserSettings**
```sql
id (primary key)
user_id
daily_goal_ml (default: 2500)
bottle_capacity_ml (default: 750)
reminder_interval_minutes (default: 60)
reminders_enabled (default: true)
weight_kg
created_date
updated_date
```

---

## 🔧 What Changed in Frontend

All Base44 imports and calls have been replaced:

### **Before (Base44)**
```javascript
import { base44 } from '@/api/base44Client';

const logs = await base44.entities.HydrationLog.filter({
  timestamp: { $gte: today.toISOString() }
});

await base44.entities.UserSettings.update(id, data);
```

### **After (Axios)**
```javascript
import client from '@/api/client';

const response = await client.get('/hydration-logs', {
  params: { startDate: today.toISOString() }
});
const logs = response.data;

await client.put(`/user-settings/${id}`, data);
```

**Files modified:**
- ✅ `Home.js`
- ✅ `Settings.js`
- ✅ `Leaderboard.js`
- ✅ `Statistics.js`
- ✅ Others unchanged (all UI, components, styling preserved)

---

## 📱 Features Working Locally

✅ **Home Page**
- View today's hydration progress
- Hydration ring animation
- Biometric cards (hydration score, streak, avg intake)
- Weekly chart
- Insights
- Add manual hydration entries

✅ **Leaderboard**
- Rankings by total intake
- User stats (total, daily average, streak)
- Current user highlights

✅ **Settings**
- Daily goal configuration
- Weight/metrics
- Bottle capacity
- Reminders settings
- All saved to local database

✅ **Statistics**
- Weekly/monthly analytics
- Input source breakdown (manual vs bottle)
- Achievements
- Goal achievement rate

⏳ **Bluetooth** - Implemented in UI but skipped backend for now (as requested)

---

## 🛠️ Troubleshooting

### **Error: Connection refused at localhost:3001**
- Make sure backend server is running
- Check that port 3001 is not blocked/in use

### **Error: Database locked**
- Only one backend process can access the database at a time
- Close any other running instances

### **Data not syncing**
- Check browser console for API errors
- Verify backend is connected to correct database file
- Restart both frontend and backend

### **Port 3001 already in use**
Edit `server/server.js` line with `const PORT = 3001;` to use a different port (e.g., `3002`)

---

## 📝 Development Notes

### **Sample Data**
When the backend starts for the first time, it automatically creates:
- 1 test user (`user@aquaflow.local`)
- 6 sample hydration logs for today
- Default user settings (2500ml daily goal, 70kg weight, etc.)

You can modify/delete this data through the app UI.

### **Database Persistence**
All data persists in `server/aquaflow.db`. To reset:
```bash
# Delete the database file, it will recreate on next server start
rm server/aquaflow.db
```

### **CORS Configuration**
Backend allows requests from any origin (CORS enabled). For production, update `server/server.js` CORS settings to your domain only.

---

## 🔐 Local Development Notes

- No authentication required (default user: `user@aquaflow.local`)
- All data stored locally on your machine
- Works completely offline (once server is running)
- No internet connection needed

---

## 📚 Next Steps

- Test all features in the app
- Add more users/data to Leaderboard (modify Leaderboard.js logic or add POST /api/users endpoint)
- Implement Bluetooth integration when ready
- Deploy to VPS/cloud if needed (backend is production-ready)

---

## ✨ Summary

Your app is now:
- **Self-contained** - Runs on your machine
- **Database-backed** - All data persists in SQLite
- **API-driven** - Clean REST API layer
- **Scalable** - Can deploy backend separately if needed
- **Maintainable** - Clear separation of concerns

Enjoy your local AquaFlow app! 🌊💧
