# 🏀 NBA Game Predictor

A full-stack web application that predicts NBA game outcomes using recent team performance. Built with React, TailwindCSS, and Flask, this project showcases real-time scores, team logos, and prediction confidence based on the last 15 games.

## Features

- **Game Predictions**: Uses `nba_api` to fetch recent performance and computes a winning prediction with confidence.
- 🕹**Interactive UI**: Click on a game to view predicted winner and expandable box scores.
- **Live Data**: Pulls today’s games with live scores and statuses.
- **Responsive Design**: Styled with TailwindCSS for modern, mobile-friendly UI.

## How It Works

### Backend (Flask)

- `GET /api/games/today`: Returns today’s NBA games and scores.
- `POST /predict`: Predicts the winner between two teams based on their past 15 games.

> Prediction logic is powered by custom functions in `utils.predictor`.

### Frontend (React)

- Displays today's games with team logos and live scores.
- Auto-fetches prediction and confidence.
- Box score tabs allow toggling between team stats.

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Flask, nba_api
- **Misc**: CORS enabled, modular component architecture

## Running the Project

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
