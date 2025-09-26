import 'https://esm.run/@material/web/button/filled-button.js';
import 'https://esm.run/@material/web/textfield/outlined-text-field.js';
import { db } from '../workbench/db.js';

customElements.define('view-habits', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
        .grid { display:grid; grid-template-columns: repeat(12, 1fr); gap: 8px; }
        .habit { grid-column: span 3; padding: 10px; border-radius: 12px; border: 1px dashed color-mix(in oklab, var(--md-sys-color-outline) 40%, transparent); }
        @media (max-width: 1000px) { .habit { grid-column: span 6; } }
        @media (max-width: 640px) { .habit { grid-column: span 12; } }
      </style>
      <div class="row">
        <md-outlined-text-field id="name" label="New habit" style="flex:1"></md-outlined-text-field>
        <md-filled-button id="add">Add</md-filled-button>
      </div>
      <div class="grid" id="grid"></div>
    `;
    this._wire();
    this._load();
  }

  _wire() {
    this.querySelector('#add').addEventListener('click', () => this._add());
  }

  async _add() {
    const name = this.querySelector('#name').value.trim();
    if (!name) return;
    await db.habits.put({ id: crypto.randomUUID(), name, log: [], createdAt: Date.now() });
    this.querySelector('#name').value = '';
    this._load();
  }

  async _log(id) {
    const h = await db.habits.get(id);
    h.log.push(new Date().toISOString().slice(0,10));
    await db.habits.put(h);
    this._load();
  }

  async _load() {
    const habits = await db.habits.getAll();
    const grid = this.querySelector('#grid');
    grid.replaceChildren();
    for (const h of habits.sort((a,b)=>a.createdAt-b.createdAt)) {
      const div = document.createElement('div');
      div.className = 'habit';
      const today = new Date().toISOString().slice(0,10);
      const done = h.log.includes(today);
      div.innerHTML = `
        <div style="font-weight:600; margin-bottom:8px;">${h.name}</div>
        <div style="display:flex; align-items:center; gap:8px;">
          <md-filled-button ${done ? 'disabled' : ''}>Mark today</md-filled-button>
          <div style="opacity:.75;">Streak: ${this._streak(h.log)}</div>
        </div>
      `;
      div.querySelector('md-filled-button')?.addEventListener('click', () => this._log(h.id));
      grid.append(div);
    }
  }

  _streak(days) {
    const set = new Set(days);
    let streak = 0;
    for (let d = new Date(); ; d.setDate(d.getDate()-1)) {
      const key = d.toISOString().slice(0,10);
      if (set.has(key)) streak++; else break;
    }
    return streak;
  }
});

