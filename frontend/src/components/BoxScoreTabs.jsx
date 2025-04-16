import { useState } from 'react';

export default function BoxScoreTabs({ homeTeam, awayTeam, homePlayers, awayPlayers }) {
  const [activeTab, setActiveTab] = useState('home');

  const testHomePlayers = [
    { name: 'Stephen Curry', min: 36, reb: 5, ast: 7, pts: 30 },
    { name: 'Klay Thompson', min: 34, reb: 4, ast: 2, pts: 22 },
    { name: 'Draymond Green', min: 32, reb: 9, ast: 8, pts: 12 },
  ];

  const testAwayPlayers = [
    { name: 'LeBron James', min: 38, reb: 8, ast: 9, pts: 28 },
    { name: 'Anthony Davis', min: 36, reb: 10, ast: 3, pts: 24 },
    { name: 'D\'Angelo Russell', min: 30, reb: 2, ast: 6, pts: 18 },
  ];

  const selectedPlayers = activeTab === 'home' ? testHomePlayers : testAwayPlayers;
  const selectedTeam = activeTab === 'home' ? homeTeam : awayTeam;

  return (
    <div className="bg-[#1e1e1e] rounded-b-2xl overflow-hidden mt-2 shadow-inner border-t border-gray-800">
      {/* Tab Headers */}
      <div className="flex justify-between text-sm md:text-base bg-[#2b2b2b] text-white font-semibold">
        <button
          className={`w-1/2 py-2 ${activeTab === 'home' ? 'bg-[#3a3a3a]' : 'hover:bg-[#333]'}`}
          onClick={() => setActiveTab('home')}
        >
          {homeTeam}
        </button>
        <button
          className={`w-1/2 py-2 ${activeTab === 'away' ? 'bg-[#3a3a3a]' : 'hover:bg-[#333]'}`}
          onClick={() => setActiveTab('away')}
        >
          {awayTeam}
        </button>
      </div>

      {/* Stat Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white text-left">
          <thead className="bg-[#2b2b2b] text-gray-300">
            <tr>
              <th className="px-4 py-2">Player</th>
              <th className="px-2 py-2 text-center">MIN</th>
              <th className="px-2 py-2 text-center">REB</th>
              <th className="px-2 py-2 text-center">AST</th>
              <th className="px-2 py-2 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {selectedPlayers.map((player, idx) => (
              <tr key={idx} className="border-t border-[#333] hover:bg-[#2e2e2e]">
                <td className="px-4 py-2 font-medium">{player.name}</td>
                <td className="px-2 py-2 text-center">{player.min}</td>
                <td className="px-2 py-2 text-center">{player.reb}</td>
                <td className="px-2 py-2 text-center">{player.ast}</td>
                <td className="px-2 py-2 text-center font-semibold">{player.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
