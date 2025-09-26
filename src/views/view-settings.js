import 'https://esm.run/@material/web/switch/switch.js';
import { db } from '../workbench/db.js';

customElements.define('view-settings', class extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <style>
        .item { display:flex; align-items:center; justify-content:space-between; padding: 12px 0; }
      </style>
      <div class="item">
        <div>Dark theme</div>
        <md-switch id="theme"></md-switch>
      </div>
    `;
    const current = document.documentElement.getAttribute('data-theme') === 'dark';
    const sw = this.querySelector('#theme');
    sw.selected = current;
    sw.addEventListener('change', () => {
      const next = sw.selected ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ok.theme', next); } catch (e) {}
      db.settings.put('theme', next);
    });
  }
});

