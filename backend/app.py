from flask import Flask, request, jsonify
from nba_api.live.nba.endpoints import scoreboard
from flask_cors import CORS
from utils.predictor import get_last_15_games_stats, compute_score


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


@app.route('/predict', methods=['POST'])
def predict_winner():
    data = request.get_json()
    home_team = data['home_team']
    away_team = data['away_team']

    try:
        home_stats = get_last_15_games_stats(home_team)
        away_stats = get_last_15_games_stats(away_team)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    home_score = compute_score(home_stats)
    away_score = compute_score(away_stats)

    result = {
        'home_team': home_team,
        'away_team': away_team,
        'home_score': round(home_score, 2),
        'away_score': round(away_score, 2),
        'winner': home_team if home_score > away_score else away_team,
        'confidence': round(abs(home_score - away_score), 2)
    }

    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True)
