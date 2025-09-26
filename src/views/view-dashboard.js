import 'https://esm.run/@material/web/card/filled-card.js';
import 'https://esm.run/@material/web/button/filled-button.js';
import 'https://esm.run/@material/web/progress/circular-progress.js';

customElements.define('view-dashboard', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; }
        .card { grid-column: span 4; }
        @media (max-width: 1000px) { .card { grid-column: span 6; } }
        @media (max-width: 640px) { .card { grid-column: span 12; } }
      </style>
      <div class="grid">
        <md-filled-card class="card">
          <div style="padding:16px;">
            <h3 style="margin:0 0 8px;">Today</h3>
            <p style="margin:0 0 12px; opacity:.8">Quick stats for your productivity</p>
            <div style="display:flex; align-items:center; gap:16px;">
              <md-circular-progress indeterminate></md-circular-progress>
              <div>
                <div style="font-weight:600;">Focus streak</div>
                <div style="opacity:.8;">4 days</div>
              </div>
            </div>
          </div>
        </md-filled-card>
        <md-filled-card class="card">
          <div style="padding:16px;">
            <h3 style="margin:0 0 8px;">Tasks</h3>
            <p style="margin:0 0 12px; opacity:.8">Jump into your task list</p>
            <md-filled-button id="toTasks">Open Tasks</md-filled-button>
          </div>
        </md-filled-card>
        <md-filled-card class="card">
          <div style="padding:16px;">
            <h3 style="margin:0 0 8px;">Pomodoro</h3>
            <p style="margin:0 0 12px; opacity:.8">Start a deep work session</p>
            <md-filled-button id="toPomodoro">Start Timer</md-filled-button>
          </div>
        </md-filled-card>
      </div>
    `;
    this.querySelector('#toTasks')?.addEventListener('click', () => location.hash = '#/tasks');
    this.querySelector('#toPomodoro')?.addEventListener('click', () => location.hash = '#/pomodoro');
  }
});

