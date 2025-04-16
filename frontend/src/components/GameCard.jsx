import { useEffect, useState } from 'react';
import axios from 'axios';
import BoxScoreTabs from './BoxScoreTabs';

export default function GameCard({
  time,
  score,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  status,
  onClick,
  isExpanded,
  boxScoreData,
}) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.post('http://localhost:5000/predict', {
          home_team: homeTeam,
          away_team: awayTeam,
        });
        setPrediction(res.data);
      } catch (err) {
        console.error('Prediction error:', err);
      }
    };

    fetchPrediction();
  }, [homeTeam, awayTeam]);

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden text-white border border-gray-800">
      {/* Clickable Game Card */}
      <div
        onClick={onClick}
        className="bg-gray-900 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition"
      >
        {/* Left Side: Logos + Score */}
        <div className="flex items-center space-x-6">
          <img src={awayLogo} alt={awayTeam} className="h-16 w-16" />
          <div className="text-center text-lg md:text-xl">
            <div className="text-gray-300">
              {status === 'live' ? (
                <span className="text-red-500 font-bold">LIVE</span>
              ) : (
                time
              )}
            </div>
            {score && <div className="font-bold text-white">{score}</div>}
          </div>
          <img src={homeLogo} alt={homeTeam} className="h-14 w-14" />
        </div>

        {/* Right Side: Prediction */}
        <div className="text-right space-y-2">
          <div className="text-white font-bold text-lg md:text-2xl">
            {prediction ? prediction.winner : 'Loading...'}
          </div>
          <div className="bg-gray-700 h-3 md:h-4 w-28 md:w-32 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{
                width: prediction
                  ? `${Math.min(prediction.confidence * 100, 100)}%`
                  : '0%',
              }}
            ></div>
          </div>
          <div className="text-sm text-gray-300">
            {prediction
              ? `${(prediction.confidence * 100).toFixed(1)}% Confidence`
              : ''}
          </div>
        </div>
      </div>

      {/* Dropdown Box Score */}
      {isExpanded && boxScoreData && (
        <BoxScoreTabs
          homeTeam={boxScoreData.homeTeam}
          awayTeam={boxScoreData.awayTeam}
          homePlayers={boxScoreData.homePlayers}
          awayPlayers={boxScoreData.awayPlayers}
        />
      )}
    </div>
  );
}
