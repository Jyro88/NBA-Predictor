from nba_api.stats.endpoints import teamgamelog
from nba_api.stats.static import teams
import pandas as pd
import time

def get_team_id(team_name):
    nba_teams = teams.get_teams()
    for team in nba_teams:
        if team_name.lower() in team['full_name'].lower():
            return team['id']
    return None

def get_last_15_games_stats(team_name):
    team_id = get_team_id(team_name)
    if team_id is None:
        raise ValueError(f"Invalid team name: {team_name}")
    
    gamelog = teamgamelog.TeamGameLog(team_id=team_id, season='2024-25', season_type_all_star='Regular Season')
    time.sleep(1)  # Avoid rate limiting
    df = gamelog.get_data_frames()[0]
    
    df = df.sort_values('GAME_DATE', ascending=False).head(15)
    
    win_pct = (df['WL'] == 'W').mean()
    avg_pts = df['PTS'].mean()
    avg_fg_pct = df['FG_PCT'].mean()
    avg_3p_pct = df['FG3_PCT'].mean()
    avg_ast = df['AST'].mean()
    avg_reb = df['REB'].mean()
    avg_tov = df['TOV'].mean()

    # Create a proxy "net score" using available values
    offensive_score = avg_pts + avg_ast * 1.5 + avg_reb * 1.2
    defensive_penalty = avg_tov * 2.0
    net_score = offensive_score - defensive_penalty

    return {
        'win_pct': round(win_pct, 3),
        'net_score': round(net_score, 2),
        'fg_pct': round(avg_fg_pct, 3),
        '3p_pct': round(avg_3p_pct, 3),
        'ast': round(avg_ast, 1),
        'reb': round(avg_reb, 1),
        'tov': round(avg_tov, 1)
    }


def compute_score(stats):
    return (
        stats['win_pct'] * 0.35 +
        stats['net_score'] * 0.25 +
        stats['fg_pct'] * 0.1 +
        stats['3p_pct'] * 0.1 +
        stats['ast'] * 0.05 +
        stats['reb'] * 0.1 -
        stats['tov'] * 0.05
    )

