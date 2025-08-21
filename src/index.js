import './styles.css';
import { loadState } from './state';
import { initApp } from './app';

document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();
  const board = document.getElementById('board');
  initApp(board, state);
});
