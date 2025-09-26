import 'https://esm.run/@material/web/all.js';

import { Router } from '../../lib/router.js';

customElements.define('app-root', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.router = null;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; min-height: 100dvh; }
        header {
          position: sticky; top: 0; z-index: 5;
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; backdrop-filter: saturate(1.2) blur(8px);
          background: color-mix(in oklab, var(--md-sys-color-surface) 70%, transparent);
          border-bottom: 1px solid color-mix(in oklab, var(--md-sys-color-outline) 20%, transparent);
        }
        .title { font-weight: 600; letter-spacing: .2px; }
        main { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100dvh - 56px); }
        nav { border-right: 1px solid color-mix(in oklab, var(--md-sys-color-outline) 20%, transparent); padding: 12px; }
        .nav-group { margin: 12px 0; font-size: 12px; opacity: .7; text-transform: uppercase; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 12px; cursor: pointer; }
        .nav-item:hover { background: color-mix(in oklab, var(--md-sys-color-primary) 10%, transparent); }
        .content { padding: 16px; }
        @media (max-width: 960px) {
          main { grid-template-columns: 1fr; }
          nav { position: sticky; top: 56px; display: flex; overflow: auto; gap: 6px; border-right: none; border-bottom: 1px solid color-mix(in oklab, var(--md-sys-color-outline) 20%, transparent); }
          .nav-item { white-space: nowrap; }
        }
      </style>
      <header>
        <md-icon-button id="menuBtn" aria-label="Open navigation"><span class="material-symbols-outlined">menu</span></md-icon-button>
        <div class="title">Orbit Kit</div>
        <span style="flex:1"></span>
        <md-icon-button id="themeBtn" aria-label="Toggle theme"><span class="material-symbols-outlined">dark_mode</span></md-icon-button>
        <md-icon-button id="installBtn" aria-label="Install app" style="display:none"><span class="material-symbols-outlined">download</span></md-icon-button>
        <md-icon-button id="githubBtn" aria-label="GitHub"><span class="material-symbols-outlined">open_in_new</span></md-icon-button>
      </header>
      <main>
        <nav>
          <div class="nav-group">Main</div>
          <div class="nav-item" data-path="/"> <span class="material-symbols-outlined">dashboard</span> Dashboard</div>
          <div class="nav-item" data-path="/tasks"> <span class="material-symbols-outlined">checklist</span> Tasks</div>
          <div class="nav-item" data-path="/notes"> <span class="material-symbols-outlined">sticky_note_2</span> Notes</div>
          <div class="nav-item" data-path="/pomodoro"> <span class="material-symbols-outlined">timer</span> Pomodoro</div>
          <div class="nav-item" data-path="/habits"> <span class="material-symbols-outlined">track_changes</span> Habits</div>
          <div class="nav-item" data-path="/kanban"> <span class="material-symbols-outlined">view_kanban</span> Kanban</div>
          <div class="nav-item" data-path="/calendar"> <span class="material-symbols-outlined">calendar_today</span> Calendar</div>
          <div class="nav-item" data-path="/docs"> <span class="material-symbols-outlined">description</span> Docs</div>
          <div class="nav-item" data-path="/search"> <span class="material-symbols-outlined">search</span> Search</div>
          <div class="nav-group">System</div>
          <div class="nav-item" data-path="/settings"> <span class="material-symbols-outlined">settings</span> Settings</div>
        </nav>
        <section class="content" id="outlet" aria-live="polite"></section>
      </main>
    `;

    const outlet = this.shadowRoot.getElementById('outlet');
    this.router = new Router(outlet)
      .define('/', async () => this._lazy('dashboard'))
      .define('/tasks', async () => this._lazy('tasks'))
      .define('/notes', async () => this._lazy('notes'))
      .define('/pomodoro', async () => this._lazy('pomodoro'))
      .define('/habits', async () => this._lazy('habits'))
      .define('/kanban', async () => this._lazy('kanban'))
      .define('/calendar', async () => this._lazy('calendar'))
      .define('/docs', async () => this._lazy('docs'))
      .define('/search', async () => this._lazy('search'))
      .define('/settings', async () => this._lazy('settings'));
    this.router.start();

    this._wire();
  }

  _wire() {
    const nav = this.shadowRoot.querySelector('nav');
    nav.addEventListener('click', e => {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      e.preventDefault();
      this.router.navigate(item.dataset.path);
    });

    const themeBtn = this.shadowRoot.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('ok.theme', next); } catch (e) {}
    });

    const githubBtn = this.shadowRoot.getElementById('githubBtn');
    githubBtn.addEventListener('click', () => {
      window.open('https://github.com/', '_blank', 'noreferrer');
    });

    // PWA install prompt
    const installBtn = this.shadowRoot.getElementById('installBtn');
    let defEvent = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      defEvent = e;
      installBtn.style.display = '';
    });
    installBtn.addEventListener('click', async () => {
      if (defEvent) {
        await defEvent.prompt();
        defEvent = null;
        installBtn.style.display = 'none';
      }
    });
  }

  async _lazy(view) {
    switch (view) {
      case 'dashboard': {
        const el = document.createElement('view-dashboard');
        await import('../views/view-dashboard.js');
        return el;
      }
      case 'tasks': {
        const el = document.createElement('view-tasks');
        await import('../views/view-tasks.js');
        return el;
      }
      case 'notes': {
        const el = document.createElement('view-notes');
        await import('../views/view-notes.js');
        return el;
      }
      case 'pomodoro': {
        const el = document.createElement('view-pomodoro');
        await import('../views/view-pomodoro.js');
        return el;
      }
      case 'habits': {
        const el = document.createElement('view-habits');
        await import('../views/view-habits.js');
        return el;
      }
      case 'kanban': {
        const el = document.createElement('view-kanban');
        await import('../views/view-kanban.js');
        return el;
      }
      case 'calendar': {
        const el = document.createElement('view-calendar');
        await import('../views/view-calendar.js');
        return el;
      }
      case 'docs': {
        const el = document.createElement('view-docs');
        await import('../views/view-docs.js');
        return el;
      }
      case 'search': {
        const el = document.createElement('view-search');
        await import('../views/view-search.js');
        return el;
      }
      case 'settings': {
        const el = document.createElement('view-settings');
        await import('../views/view-settings.js');
        return el;
      }
      default: return document.createTextNode('Not found');
    }
  }
});

