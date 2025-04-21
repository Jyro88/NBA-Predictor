from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import commonteamroster, playergamelog
import pandas as pd
import time
import re

def extract_minutes(min_column):
    try:
        mins = min_column.astype(str).str.extract(r'(\d+)').dropna().astype(int)
        mean_min = mins.mean()
        return int(mean_min.iloc[0]) if not mean_min.empty else 0
    except Exception as e:
        print(f"[Minutes Error]: {e}")
        return 0

def get_today_matchups():
    board = scoreboard.ScoreBoard()
    games = board.games.get_dict()
    matchups = []
    for game in games:
        home = game["homeTeam"]["teamName"]
        away = game["awayTeam"]["teamName"]
        home_id = game["homeTeam"]["teamId"]
        away_id = game["awayTeam"]["teamId"]
        matchups.append((home, away, home_id, away_id))
    return matchups

def get_roster_player_ids(team_id):
    try:
        roster = commonteamroster.CommonTeamRoster(team_id=team_id, timeout=10)
        players = roster.get_data_frames()[0]
        return players[['PLAYER_ID', 'PLAYER']]
    except Exception as e:
        print(f"[Roster Error] Failed to get roster for team {team_id}: {e}")
        return pd.DataFrame(columns=['PLAYER_ID', 'PLAYER'])

def get_player_last_15_games(player_id):
    try:
        gamelog = playergamelog.PlayerGameLog(
            player_id=player_id,
            season='2024-25',
            season_type_all_star='Regular Season',
            timeout=10
        )
        df = gamelog.get_data_frames()[0]
        return df.head(15)
    except Exception as e:
        print(f"[Log Error] Player {player_id}: {e}")
        return pd.DataFrame()

def predict_boxscores_for_today(min_minutes_played=10):
    matchups = get_today_matchups()
    predictions = {}

    for home_team, away_team, home_id, away_id in matchups:
        print(f"\nPredicting boxscore for {away_team} @ {home_team}")

        matchup = {
            "homeTeam": home_team,
            "awayTeam": away_team,
            "homePlayers": predict_team_boxscore(home_id, home_team, min_minutes_played),
            "awayPlayers": predict_team_boxscore(away_id, away_team, min_minutes_played)
        }

        predictions[f"{home_team} vs {away_team}"] = matchup

    return predictions

def predict_team_boxscore(team_id, team_name, min_minutes_played):
    players = get_roster_player_ids(team_id)
    player_stats = []

    for _, row in players.iterrows():
        player_id = row['PLAYER_ID']
        player_name = row['PLAYER']
        logs = get_player_last_15_games(player_id)

        if not logs.empty:
            try:
                avg = logs[['PTS', 'REB', 'AST']].mean()
                avg_min = extract_minutes(logs['MIN'])

                if avg_min < min_minutes_played:
                    continue

                player_stats.append({
                    'name': player_name,
                    'min': int(avg_min),
                    'pts': float(round(avg['PTS'], 1)),
                    'reb': float(round(avg['REB'], 1)),
                    'ast': float(round(avg['AST'], 1))
                })
            except Exception as stat_err:
                print(f"Stat error for {player_name}: {stat_err}")
        time.sleep(0.5)

    top_players = sorted(player_stats, key=lambda x: -x['min'])[:10]
    print(f"{team_name}: {len(top_players)} players")
    return top_players
