import 'https://esm.run/@material/web/textfield/outlined-text-field.js';
import 'https://esm.run/@material/web/button/filled-button.js';
import 'https://esm.run/@material/web/list/list.js';
import 'https://esm.run/@material/web/list/list-item.js';

import { db } from '../workbench/db.js';

customElements.define('view-tasks', class extends HTMLElement {
  constructor() {
    super();
    this.tasks = [];
  }

  connectedCallback() {
    this.innerHTML = `
      <style>
        .row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
        md-list { width: 100%; }
        md-list-item { display:flex; align-items:center; justify-content:space-between; }
        .empty { opacity: .7; font-style: italic; }
      </style>
      <div class="row">
        <md-outlined-text-field id="input" label="Add a task" style="flex:1"></md-outlined-text-field>
        <md-filled-button id="add">Add</md-filled-button>
      </div>
      <md-list id="list"></md-list>
    `;
    this._wire();
    this._load();
  }

  _wire() {
    this.querySelector('#add').addEventListener('click', () => this._create());
    this.querySelector('#input').addEventListener('keydown', (e) => { if (e.key === 'Enter') this._create(); });
  }

  async _load() {
    this.tasks = await db.tasks.getAll();
    this._renderList();
  }

  async _create() {
    const input = this.querySelector('#input');
    const title = input.value.trim();
    if (!title) return;
    const task = { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() };
    await db.tasks.put(task);
    input.value = '';
    await this._load();
  }

  async _toggle(id) {
    const task = await db.tasks.get(id);
    if (!task) return;
    task.done = !task.done;
    await db.tasks.put(task);
    await this._load();
  }

  async _remove(id) {
    await db.tasks.delete(id);
    await this._load();
  }

  _renderList() {
    const list = this.querySelector('#list');
    list.replaceChildren();
    if (!this.tasks.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No tasks yet';
      list.append(empty);
      return;
    }
    for (const t of this.tasks.sort((a,b)=> a.createdAt-b.createdAt)) {
      const item = document.createElement('md-list-item');
      item.innerHTML = `
        <div slot="start" style="display:flex; align-items:center; gap:10px;">
          <md-checkbox ${t.done ? 'checked' : ''}></md-checkbox>
        </div>
        <div style="flex:1; ${t.done ? 'text-decoration: line-through; opacity:.7;' : ''}">${t.title}</div>
        <md-icon-button id="del"><span class="material-symbols-outlined">delete</span></md-icon-button>
      `;
      item.querySelector('md-checkbox').addEventListener('change', () => this._toggle(t.id));
      item.querySelector('#del').addEventListener('click', () => this._remove(t.id));
      list.append(item);
    }
  }
});

