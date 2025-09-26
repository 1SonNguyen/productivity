import 'https://esm.run/@material/web/button/filled-button.js';
import 'https://esm.run/@material/web/textfield/outlined-text-field.js';
import { db } from '../workbench/db.js';

customElements.define('view-kanban', class extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <style>
        .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .col { border-radius: 12px; padding: 12px; background: color-mix(in oklab, var(--md-sys-color-primary) 7%, transparent); min-height: 240px; }
        .card { padding: 8px 10px; border-radius: 10px; background: color-mix(in oklab, var(--md-sys-color-surface) 85%, transparent); margin-bottom: 8px; }
        .row { display:flex; gap:8px; margin-bottom:12px; }
      </style>
      <div class="row">
        <md-outlined-text-field id="title" label="New card" style="flex:1"></md-outlined-text-field>
        <md-filled-button id="add">Add</md-filled-button>
      </div>
      <div class="board">
        <div class="col" id="todo"><h3>To Do</h3></div>
        <div class="col" id="doing"><h3>Doing</h3></div>
        <div class="col" id="done"><h3>Done</h3></div>
      </div>
    `;
    this._wire();
    this._load();
  }

  _wire() {
    this.querySelector('#add').addEventListener('click', () => this._add());
  }

  async _add() {
    const title = this.querySelector('#title').value.trim();
    if (!title) return;
    await db.boards.put({ id: crypto.randomUUID(), title, column: 'todo', createdAt: Date.now() });
    this.querySelector('#title').value = '';
    this._load();
  }

  async _move(id, column) {
    const card = await db.boards.get(id);
    card.column = column;
    await db.boards.put(card);
    this._load();
  }

  async _load() {
    const cards = await db.boards.getAll();
    for (const c of ['todo','doing','done']) {
      const el = this.querySelector('#'+c);
      el.querySelectorAll('.card').forEach(x=>x.remove());
      for (const k of cards.filter(x=>x.column===c).sort((a,b)=>a.createdAt-b.createdAt)) {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
            <div>${k.title}</div>
            <div style="display:flex; gap:6px;">
              <md-icon-button title="Move left"><span class="material-symbols-outlined">chevron_left</span></md-icon-button>
              <md-icon-button title="Move right"><span class="material-symbols-outlined">chevron_right</span></md-icon-button>
            </div>
          </div>
        `;
        const [left,right] = div.querySelectorAll('md-icon-button');
        left.addEventListener('click', () => this._move(k.id, c === 'doing' ? 'todo' : c === 'done' ? 'doing' : 'todo'));
        right.addEventListener('click', () => this._move(k.id, c === 'todo' ? 'doing' : 'done'));
        el.append(div);
      }
    }
  }
});

