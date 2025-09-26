import 'https://esm.run/@material/web/textfield/outlined-text-field.js';
import 'https://esm.run/@material/web/button/filled-button.js';
import { db } from '../workbench/db.js';

customElements.define('view-notes', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
        textarea { width:100%; min-height: 140px; border-radius: 12px; padding: 12px; border: 1px solid color-mix(in oklab, var(--md-sys-color-outline) 30%, transparent); background: color-mix(in oklab, var(--md-sys-color-surface) 80%, transparent); color: var(--md-sys-color-on-surface); }
        .grid { display:grid; grid-template-columns: repeat(12, 1fr); gap: 12px; }
        .note { grid-column: span 4; padding: 12px; border-radius: 12px; background: color-mix(in oklab, var(--md-sys-color-primary) 5%, transparent); }
        @media (max-width: 1000px) { .note { grid-column: span 6; } }
        @media (max-width: 640px) { .note { grid-column: span 12; } }
      </style>
      <div class="row">
        <md-outlined-text-field id="title" label="Title" style="flex:1"></md-outlined-text-field>
        <md-filled-button id="save">Save</md-filled-button>
      </div>
      <textarea id="content" placeholder="Write your note..."></textarea>
      <h3>Notes</h3>
      <div class="grid" id="grid"></div>
    `;
    this._wire();
    this._load();
  }

  _wire() {
    this.querySelector('#save').addEventListener('click', () => this._save());
  }

  async _save() {
    const title = this.querySelector('#title').value.trim();
    const content = this.querySelector('#content').value.trim();
    if (!title && !content) return;
    const note = { id: crypto.randomUUID(), title, content, createdAt: Date.now() };
    await db.notes.put(note);
    this.querySelector('#title').value = '';
    this.querySelector('#content').value = '';
    this._load();
  }

  async _load() {
    const notes = await db.notes.getAll();
    const grid = this.querySelector('#grid');
    grid.replaceChildren();
    for (const n of notes.sort((a,b)=>b.createdAt-a.createdAt)) {
      const div = document.createElement('div');
      div.className = 'note';
      div.innerHTML = `<div style="font-weight:600; margin-bottom:6px;">${n.title || 'Untitled'}</div><div style="opacity:.8; white-space: pre-wrap;">${n.content}</div>`;
      grid.append(div);
    }
  }
});

