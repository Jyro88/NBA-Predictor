import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'

export default function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/games/today')
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching games:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <span>{new Date().toLocaleDateString()}</span>
        <nav className="space-x-6">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#" className="hover:text-white">Teams</a>
          <a href="#" className="hover:text-white">About</a>
        </nav>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-center">Today’s Games</h1>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 text-center p-4 rounded-xl">
          <div className="text-sm text-gray-400">Prediction Accuracy</div>
          <div className="text-3xl font-bold">72%</div>
          <div className="text-xs text-gray-400">Last 10 games</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading games...</div>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {games.map((game, index) => (
            <GameCard
              key={index}
              homeTeam={game.homeTeam}
              awayTeam={game.awayTeam}
              score={`${game.awayScore} - ${game.homeScore}`}
              homeLogo={`/Team_Logos/${game.homeTeam}.png`}
              awayLogo={`/Team_Logos/${game.awayTeam}.png`}
              status={game.status}
              time={game.status} // fallback for upcoming games
            />
          ))}
        </div>
      )}
    </div>
  )
}
