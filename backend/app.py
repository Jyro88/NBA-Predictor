from flask import Flask, request, jsonify
from nba_api.live.nba.endpoints import scoreboard
from flask_cors import CORS
from player_data import predict_boxscores_for_today



app = Flask(__name__)
CORS(app) 

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

print("🔄 Precomputing boxscore predictions...")
boxscore_cache = predict_boxscores_for_today()
print("✅ Cached boxscore predictions")

@app.route('/api/predict/boxscore')
def predict_boxscore():
    return jsonify(boxscore_cache)

if __name__ == '__main__':
    app.run(debug=True)
