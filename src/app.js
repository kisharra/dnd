// app.js
import { createColumn } from './dom';
import { enableDnD } from './dnd';

export function initApp(board, state, saveState, loadState) {
  function renderBoard() {
    board.innerHTML = '';
    const titles = ['Todo', 'In Progress', 'Done'];
    titles.forEach((title, idx) => {
      const column = createColumn(title, idx, state, renderBoard);
      board.appendChild(column);
    });
  }

  // ✅ DnD включаем только один раз
  enableDnD(board, state, renderBoard);

  renderBoard();
}
