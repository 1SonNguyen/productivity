import 'https://esm.run/@material/web/textfield/outlined-text-field.js';

customElements.define('view-search', class extends HTMLElement {
  connectedCallback() {
    this.index = [];
    this.innerHTML = `
      <style>
        .row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
        .res { display:grid; grid-template-columns: repeat(12, 1fr); gap: 12px; }
        .item { grid-column: span 6; padding: 12px; border-radius: 12px; background: color-mix(in oklab, var(--md-sys-color-primary) 6%, transparent); }
        @media (max-width: 640px) { .item { grid-column: span 12; } }
      </style>
      <div class="row">
        <md-outlined-text-field id="q" label="Search" style="flex:1"></md-outlined-text-field>
      </div>
      <div class="res" id="res"></div>
    `;
    this._buildIndex();
    this.querySelector('#q').addEventListener('input', e => this._search(e.target.value));
  }
  _buildIndex() {
    this.index = [
      { title: 'Dashboard', path: '#/' },
      { title: 'Tasks', path: '#/tasks' },
      { title: 'Notes', path: '#/notes' },
      { title: 'Pomodoro', path: '#/pomodoro' },
      { title: 'Habits', path: '#/habits' },
      { title: 'Kanban', path: '#/kanban' },
      { title: 'Calendar', path: '#/calendar' },
      { title: 'Docs', path: '#/docs' },
      { title: 'Search', path: '#/search' },
      { title: 'Settings', path: '#/settings' },
    ];
  }
  _search(q) {
    q = q.toLowerCase();
    const res = this.index.filter(x => x.title.toLowerCase().includes(q));
    const grid = this.querySelector('#res');
    grid.replaceChildren();
    for (const r of res) {
      const div = document.createElement('a');
      div.className = 'item';
      div.href = r.path;
      div.textContent = r.title;
      grid.append(div);
    }
  }
});

