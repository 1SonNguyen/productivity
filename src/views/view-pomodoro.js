import 'https://esm.run/@material/web/button/filled-button.js';
import 'https://esm.run/@material/web/progress/circular-progress.js';

customElements.define('view-pomodoro', class extends HTMLElement {
  constructor() {
    super();
    this.duration = 25 * 60; // 25 minutes
    this.remaining = this.duration;
    this.timer = null;
  }
  connectedCallback() {
    this.innerHTML = `
      <style>
        .wrap { display:flex; flex-direction:column; align-items:center; gap:16px; padding: 24px; }
        .time { font-size: 56px; font-weight: 700; letter-spacing: .5px; }
        .row { display:flex; gap:12px; }
      </style>
      <div class="wrap">
        <md-circular-progress indeterminate="${false}"></md-circular-progress>
        <div class="time" id="time"></div>
        <div class="row">
          <md-filled-button id="start">Start</md-filled-button>
          <md-filled-button id="pause">Pause</md-filled-button>
          <md-filled-button id="reset">Reset</md-filled-button>
        </div>
      </div>
    `;
    this._update();
    this.querySelector('#start').addEventListener('click', () => this._start());
    this.querySelector('#pause').addEventListener('click', () => this._pause());
    this.querySelector('#reset').addEventListener('click', () => this._reset());
  }
  _format(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }
  _update() {
    this.querySelector('#time').textContent = this._format(this.remaining);
  }
  _tick() {
    if (this.remaining > 0) {
      this.remaining -= 1;
      this._update();
    } else {
      this._pause();
      try { new AudioContext(); } catch (e) {}
      alert('Time! Take a short break.');
    }
  }
  _start() {
    if (this.timer) return;
    this.timer = setInterval(() => this._tick(), 1000);
  }
  _pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
  _reset() {
    this._pause();
    this.remaining = this.duration;
    this._update();
  }
});

