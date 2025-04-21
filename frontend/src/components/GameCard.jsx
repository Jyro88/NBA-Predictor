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
}) {
  const [winner, setWinner] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [predictedScore, setPredictedScore] = useState({ home: 0, away: 0 });
  const [boxScoreData, setBoxScoreData] = useState(null);

  //Gets the boxscores from the Flask backend
  useEffect(() => {
    const fetchBoxScores = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/predict/boxscore');
        const data = res.data;
        const matchupKey = `${homeTeam} vs ${awayTeam}`;
        const matchupData = data[matchupKey];
        if (matchupData) {
          setBoxScoreData(matchupData);
        }
      } catch (err) {
        console.error('Box score prediction error:', err);
      }
    };

    if (isExpanded) {
      fetchBoxScores();
    }
  }, [isExpanded, homeTeam, awayTeam]);

  // Sums and rounds up each of the player's points for a predicted total for each team
  useEffect(() => {
    if (boxScoreData) {
      const homeTotal = boxScoreData.homePlayers.reduce((sum, p) => sum + p.pts, 0);
      const awayTotal = boxScoreData.awayPlayers.reduce((sum, p) => sum + p.pts, 0);
      setPredictedScore({
        home: Math.round(homeTotal),
        away: Math.round(awayTotal),
      });
      setWinner(homeTotal > awayTotal ? homeTeam : awayTeam);
      setConfidence(Math.abs(homeTotal - awayTotal).toFixed(1));
    }
  }, [boxScoreData, homeTeam, awayTeam]);

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden text-white border border-gray-800">
      <div
        onClick={onClick}
        className="bg-gray-900 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition"
      >
        <div className="flex items-center space-x-6">
          <img src={awayLogo} alt={awayTeam} className="h-16 w-16" />
          <div className="text-center text-lg md:text-xl">
            <div className="text-gray-300">
              {status === 'live' ? <span className="text-red-500 font-bold">LIVE</span> : time}
            </div>
            {score && <div className="font-bold text-white">{score}</div>}
            {(winner && predictedScore) && (
              <div className="text-sm text-gray-400 mt-1">
                Predicted:{" "}
                <span className={winner === awayTeam ? 'text-blue-400 font-bold' : ''}>
                  {awayTeam} {predictedScore.away}
                </span>{" "}
                -{" "}
                <span className={winner === homeTeam ? 'text-blue-400 font-bold' : ''}>
                  {predictedScore.home} {homeTeam}
                </span>
              </div>
            )}
          </div>
          <img src={homeLogo} alt={homeTeam} className="h-14 w-14" />
        </div>

        <div className="text-right space-y-2">
          <div className="text-white text-sm font-semibold uppercase tracking-wide">
            Predicted Winner:
          </div>
          <div
            className={`text-xl md:text-2xl font-bold ${
              winner === homeTeam ? 'text-blue-400' : winner === awayTeam ? 'text-blue-400' : ''
            }`}
          >
            {winner || 'Loading...'}
          </div>
        </div>
      </div>

      {isExpanded && boxScoreData && (
        <BoxScoreTabs
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homePlayers={boxScoreData.homePlayers}
          awayPlayers={boxScoreData.awayPlayers}
        />
      )}
    </div>
  );
}
