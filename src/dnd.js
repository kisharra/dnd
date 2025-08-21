import { saveState } from './state';

export function enableDnD(board, state, renderBoard) {
  let draggedCard = null;
  let ghost = null;
  let placeholder = null;
  let offsetX = 0;
  let offsetY = 0;

  board.addEventListener('mousedown', e => {
    const card = e.target.closest('.card');
    if (!card || e.target.closest('.card__remove')) return;

    draggedCard = card;
    const rect = card.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    ghost = card.cloneNode(true);
    ghost.classList.add('dragging');
    ghost.style.width = rect.width + 'px';
    ghost.style.left = e.clientX - offsetX + 'px';
    ghost.style.top = e.clientY - offsetY + 'px';
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);

    placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.height = rect.height + 'px';
    card.parentNode.insertBefore(placeholder, card.nextSibling);

    card.style.display = 'none';
    document.body.classList.add('grabbing');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!ghost) return;
    ghost.style.left = e.clientX - offsetX + 'px';
    ghost.style.top = e.clientY - offsetY + 'px';

    const body = e.target.closest('.column__body');
    if (body) {
      const cards = [...body.querySelectorAll('.card')].filter(c => c !== draggedCard);
      let placed = false;
      for (const c of cards) {
        const rect = c.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          body.insertBefore(placeholder, c);
          placed = true;
          break;
        }
      }
      if (!placed) body.appendChild(placeholder);
    }
  }

  function onMouseUp() {
    if (!ghost || !placeholder || !draggedCard) return;

    const col = placeholder.closest('.column__body');
    const newColumnIndex = parseInt(col.dataset.columnIndex, 10);
    const newCardIndex = [...col.children].indexOf(placeholder);

    const oldColumnIndex = parseInt(draggedCard.dataset.columnIndex, 10);

    // ✅ Берём актуальный индекс карточки в DOM, а не устаревший dataset
    const oldColEl = board.querySelector(`.column__body[data-column-index="${oldColumnIndex}"]`);
    const oldCardIndex = [...oldColEl.querySelectorAll('.card')].indexOf(draggedCard);

    if (oldCardIndex !== -1) {
      const [moved] = state.columns[oldColumnIndex].splice(oldCardIndex, 1);
      state.columns[newColumnIndex].splice(newCardIndex, 0, moved);
      saveState(state);
    }

    cleanup();
    renderBoard();
  }

  function cleanup() {
    if (ghost) ghost.remove();
    if (placeholder) placeholder.remove();
    if (draggedCard) draggedCard.style.display = '';
    ghost = null;
    draggedCard = null;
    placeholder = null;
    document.body.classList.remove('grabbing');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}
