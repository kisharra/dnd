import { saveState } from './state';

export function createColumn(title, columnIndex, state, renderBoard) {
  const column = document.createElement('div');
  column.className = 'column';

  const header = document.createElement('div');
  header.className = 'column__header';

  const h3 = document.createElement('h3');
  h3.className = 'column__title';
  h3.textContent = title;

  header.appendChild(h3);
  column.appendChild(header);

  const body = document.createElement('div');
  body.className = 'column__body';
  body.dataset.columnIndex = columnIndex;
  column.appendChild(body);

  state.columns[columnIndex].forEach((text, cardIndex) => {
    const card = createCard(text, columnIndex, cardIndex, state, renderBoard);
    body.appendChild(card);
  });

  const add = document.createElement('div');
  add.className = 'add';
  const addBtn = document.createElement('button');
  addBtn.className = 'add__btn';
  addBtn.textContent = '+ Add another card';

  addBtn.addEventListener('click', () => {
    addBtn.style.display = 'none';
    const form = createAddForm(columnIndex, state, renderBoard, addBtn);
    add.appendChild(form);
  });

  add.appendChild(addBtn);
  column.appendChild(add);

  return column;
}

function createCard(text, columnIndex, cardIndex, state, renderBoard) {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = false;
  card.dataset.columnIndex = columnIndex;
  card.dataset.cardIndex = cardIndex;

  const span = document.createElement('div');
  span.className = 'card__text';
  span.textContent = text;

  const remove = document.createElement('button');
  remove.className = 'card__remove';
  remove.innerHTML = '&times;';

  remove.addEventListener('click', () => {
    state.columns[columnIndex].splice(cardIndex, 1);
    saveState(state);
    renderBoard();
  });

  card.appendChild(span);
  card.appendChild(remove);

  return card;
}

function createAddForm(columnIndex, state, renderBoard, addBtn) {
  const form = document.createElement('form');
  form.className = 'add__form';

  const textarea = document.createElement('textarea');
  textarea.className = 'add__textarea';
  textarea.required = true;

  const actions = document.createElement('div');
  actions.className = 'add__actions';

  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'btn';
  saveBtn.textContent = 'Add Card';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn secondary';
  cancelBtn.textContent = 'Cancel';

  cancelBtn.addEventListener('click', () => {
    form.remove();
    addBtn.style.display = '';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = textarea.value.trim();
    if (!value) return;
    state.columns[columnIndex].push(value);
    saveState(state);
    renderBoard();
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  form.appendChild(textarea);
  form.appendChild(actions);

  return form;
}
