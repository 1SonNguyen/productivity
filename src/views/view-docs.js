import 'https://esm.run/@material/web/button/filled-button.js';

customElements.define('view-docs', class extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <style>
        .row { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
        iframe { width: 100%; height: 70vh; border: none; border-radius: 12px; background: color-mix(in oklab, var(--md-sys-color-surface) 85%, transparent); }
      </style>
      <div class="row">
        <md-filled-button id="design">Design</md-filled-button>
        <md-filled-button id="m3">Material 3</md-filled-button>
        <md-filled-button id="mwc">Material Web</md-filled-button>
        <md-filled-button id="site">material-web.dev</md-filled-button>
        <md-filled-button id="feed">RSS Feed</md-filled-button>
      </div>
      <iframe id="frame" title="Docs"></iframe>
    `;
    const map = {
      design: 'https://design.google/',
      m3: 'https://m3.material.io/',
      mwc: 'https://github.com/material-components/material-web',
      site: 'https://material-web.dev/',
      feed: 'https://material.io/feed.xml'
    };
    for (const [id, url] of Object.entries(map)) {
      this.querySelector('#'+id).addEventListener('click', () => this._open(url));
    }
    this._open(map.design);
  }
  _open(url) {
    this.querySelector('#frame').src = url;
  }
});

