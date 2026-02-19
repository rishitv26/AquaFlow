import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import Leaderboard from './Leaderboard'
import Settings from './Settings'
import Statistics from './Statistics'
import ElectrolyteGuide from './ElectrolyteGuide'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/electrolyte-guide" element={<ElectrolyteGuide />} />
      </Routes>
    </Layout>
  )
}

export default App
