import React from 'react';
import ReactDOM from 'react-dom/client';
import './TicTacToe.css';
import Game from "./TicTacToe";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);