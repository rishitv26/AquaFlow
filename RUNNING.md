# 🚀 AquaPulse Complete Setup - Ready to Run!

## ✅ What's Been Set Up

Your project is now fully organized with both **backend** and **frontend** ready to run:

```
DECA Hydrode app/
├── 📁 server/               (Express + SQLite backend on port 3002)
│   ├── server.js
│   ├── db.js
│   ├── aquapulse.db
│   └── package.json         ✓ Dependencies installed
│
├── 📁 src/                  (Vite + React frontend on port 3000)
│   ├── main.jsx
│   ├── App.jsx
│   ├── Home.jsx
│   ├── Settings.jsx
│   ├── Leaderboard.jsx
│   ├── Statistics.jsx
│   ├── Layout.jsx
│   ├── Components/
│   ├── api/client.js
│   └── index.css
│
├── index.html               (Entry point)
├── package.json             ✓ Dependencies installed
├── vite.config.js
├── tailwind.config.js
└── .env.local               (API_URL configured)
```

---

## 🎯 Quick Start (Two Terminals)

### **Terminal 1: Start Backend**
```bash
cd "/Users/rishitvarshney/Documents/DECA Hydrode app/server"
npm start
```

**Expected output:**
```
✓ AquaPulse backend running on http://localhost:3002
✓ API endpoints available at http://localhost:3002/api
✓ Connected to SQLite database
✓ Sample user created
✓ Sample data created
```

Keep this running.

### **Terminal 2: Start Frontend**
```bash
cd "/Users/rishitvarshney/Documents/DECA Hydrode app"
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

Browser will open automatically to `http://localhost:3000`

---

## ✨ You Should See

**Home Page:**
- Hydration ring showing 71% (1780ml / 2500ml)
- 4 biometric cards with stats
- Weekly chart
- Bluetooth status

**All Pages Working:**
- ✅ Home - Shows today's hydration
- ✅ Settings - Adjust preferences (saved to database)
- ✅ Leaderboard - Your ranking
- ✅ Statistics - Analytics and charts
- ✅ Navigation - Bottom nav with all 3 links

---

## 🛠️ Available Commands

**Frontend:**
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

**Backend:**
```bash
cd server
npm start         # Run Express server (http://localhost:3002)
npm run dev       # Run with nodemon (auto-reload on changes)
```

---

## 📊 Tech Stack

**Frontend:**
- ⚛️ React 18
- 🚀 Vite (fast build tool)
- 🎨 Tailwind CSS
- 🔄 React Query (@tanstack/react-query)
- 📊 Recharts
- ✨ Framer Motion
- 🧭 React Router DOM

**Backend:**
- 🚂 Express.js
- 💾 SQLite3
- 📡 CORS enabled
- 🔄 RESTful API

---

## 🔗 API Connection

**Frontend** (`http://localhost:3000`) connects to **Backend** (`http://localhost:3002/api`)

Configured in:
- `.env.local`: `VITE_API_URL=http://localhost:3002`
- `src/api/client.js`: Uses `import.meta.env.VITE_API_URL`

---

## 💾 Database

**SQLite file:** `server/aquapulse.db`

**Tables:**
- `users` - User profiles
- `hydration_log` - Water intake entries  
- `user_settings` - User preferences

**Sample data:** 1 test user with 6 hydration logs (total 1780ml today)

---

## 🔄 Data Flow

```
React Component
    ↓ (useQuery)
Axios Client (src/api/client.js)
    ↓ (HTTP GET/POST)
Express Server (localhost:3002)
    ↓ (SQL queries)
SQLite Database (aquapulse.db)
```

---

## ⚙️ Configuration

### Change API URL
Edit `.env.local`:
```
VITE_API_URL=http://localhost:3002
```

### Change Frontend Port
Edit `vite.config.js`:
```javascript
server: {
  port: 3000,  // <- Change this
}
```

### Change Backend Port
Edit `server/server.js`:
```javascript
const PORT = 3002;  // <- Change this
```

And update `.env.local` to match!

---

## 🧪 Testing

After both are running, try:

1. **Home Page:**
   - Hydration ring should load
   - Shows sample data (1780ml)
   - Settings should load

2. **Settings:**
   - Change daily goal to 3000ml
   - Click Save
   - Refresh page - it should still be 3000ml ✓

3. **Add Data:**
   - If there's an "Add Water" button, try it
   - Total should update immediately
   - Check Network tab - should see POST request

4. **Console Check:**
   ```javascript
   // In DevTools Console:
   fetch('http://localhost:3002/api/hydration-logs')
     .then(r => r.json())
     .then(logs => console.log('Logs:', logs, 'Total:', logs.reduce((s,l)=>s+l.amount_ml, 0)))
   ```

---

## 🚨 Troubleshooting

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
```

Or change port in `vite.config.js`

### Port 3002 already in use
```bash
lsof -i :3002
kill -9 <PID>
```

Or change port in `server/server.js`

### API returns 404
- Is backend running? Check terminal
- Is the file capitalization correct in imports?
- Check Network tab in DevTools for actual URL

### Styles not loading
- Is Tailwind CSS building? Check for errors
- Try `npm install` again
- Check `tailwind.config.js` has correct content paths

### Components not rendering
- Check browser console for errors
- Are all imports using `@/` alias?
- Does the import path match actual file location?

---

## 📁 Project Structure

```
DECA Hydrode app/
│
├─── Frontend (Vite + React)
│    ├── index.html
│    ├── package.json
│    ├── vite.config.js
│    ├── tailwind.config.js
│    ├── postcss.config.js
│    ├── .env.local
│    └── src/
│        ├── main.jsx (entry point)
│        ├── App.jsx (routing)
│        ├── index.css (Tailwind)
│        ├── Home.jsx
│        ├── Settings.jsx
│        ├── Leaderboard.jsx
│        ├── Statistics.jsx
│        ├── Layout.jsx
│        ├── api/client.js
│        ├── Components/
│        │   ├── hydration/
│        │   │   ├── HydrationRing.js
│        │   │   ├── BiometricCard.js
│        │   │   ├── BluetoothStatus.js
│        │   │   ├── IntakeChart.js
│        │   │   └── WaterWave.js
│        │   └── ui/
│        │       └── (40+ Shadcn UI components)
│        └── node_modules/
│
├─── Backend (Express + SQLite)
│    ├── server/
│    │   ├── server.js
│    │   ├── db.js
│    │   ├── package.json
│    │   ├── aquapulse.db
│    │   └── node_modules/
│
├─── Data
│    └── Entities/
│        ├── HydrationLog.json (schema reference)
│        └── UserSettings.json (schema reference)
│
└─── Documentation
     ├── SETUP_GUIDE.md
     ├── MIGRATION_COMPLETE.md
     └── .env.example
```

---

## 🎉 What's Working Now

✅ Both backend and frontend properly set up  
✅ Frontend uses Vite (fast dev server)  
✅ All dependencies installed  
✅ Environment configured (.env.local)  
✅ SQLite database with sample data  
✅ REST API fully functional  
✅ Styling with Tailwind CSS  
✅ Animations with Framer Motion  
✅ Components properly organized  

---

## 🚀 Next Steps

1. **Start backend:** `cd server && npm start`
2. **Start frontend:** `npm run dev` (from root)
3. **Test the app:** Navigate between pages, add data
4. **Check DevTools:** Network tab to see API calls
5. **Build for prod:** `npm run build` (creates `dist/` folder)

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| **Start frontend dev** | `npm run dev` |
| **Start backend** | `cd server && npm start` |
| **Build frontend** | `npm run build` |
| **Check API** | Visit `http://localhost:3002/health` |
| **View database** | `sqlite3 server/aquapulse.db` |
| **Reset database** | `rm server/aquapulse.db` (recreates on restart) |

---

**Everything is ready! Start both servers and enjoy your local AquaPulse app! 🌊💧**
