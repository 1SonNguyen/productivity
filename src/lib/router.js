export class Router {
  constructor(outlet) {
    this.outlet = outlet;
    this.routes = new Map();
    window.addEventListener('hashchange', () => this._render(this._current()));
  }

  define(path, loader) {
    this.routes.set(path, loader);
    return this;
  }

  start() {
    if (!location.hash) {
      location.hash = '#/';
    }
    this._render(this._current());
  }

  navigate(path) {
    if (!path.startsWith('/')) path = '/' + path;
    location.hash = '#' + path;
  }

  _current() {
    const h = location.hash || '#/';
    const path = h.startsWith('#') ? h.slice(1) : h;
    return path || '/';
  }

  async _render(path) {
    const loader = this.routes.get(path) || this.routes.get('/');
    if (!loader) return;
    const view = await loader();
    this.outlet.replaceChildren(view);
  }
}

