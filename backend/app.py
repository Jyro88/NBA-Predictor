from flask import Flask, jsonify
from nba_api.live.nba.endpoints import scoreboard
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so your React frontend can talk to this

@app.route('/api/games/today')
def get_today_games():
    games = []
    board = scoreboard.ScoreBoard()
    for game in board.games.get_dict():
        games.append({
            "homeTeam": game["homeTeam"]["teamName"],
            "awayTeam": game["awayTeam"]["teamName"],
            "homeScore": game["homeTeam"]["score"],
            "awayScore": game["awayTeam"]["score"],
            "status": game["gameStatusText"]
        })
    return jsonify(games)

if __name__ == '__main__':
    app.run(debug=True)
