export default function GameCard({
    time,
    score,
    homeTeam,
    awayTeam,
    homeLogo,
    awayLogo,
    status,
  }) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <img src={awayLogo} alt={awayTeam} className="h-10 w-10" />
          <div className="text-center text-sm">
            <div className="text-gray-300">
              {status === "live" ? (
                <span className="text-red-500 font-bold">LIVE</span>
              ) : (
                time
              )}
            </div>
            {score && <div className="font-semibold">{score}</div>}
          </div>
          <img src={homeLogo} alt={homeTeam} className="h-10 w-10" />
        </div>
  
        <div className="text-right">
          <div className="font-bold text-white">{homeTeam}</div>
          <div className="bg-gray-700 h-2 w-24 rounded-full mt-1">
            <div className="bg-blue-400 h-2 w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }