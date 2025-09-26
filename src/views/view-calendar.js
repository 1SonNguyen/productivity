customElements.define('view-calendar', class extends HTMLElement {
  connectedCallback() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push('');
    for (let d = 1; d <= days; d++) cells.push(String(d));
    this.innerHTML = `
      <style>
        .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
        .day { padding: 10px; border-radius: 10px; text-align: right; min-height: 64px; background: color-mix(in oklab, var(--md-sys-color-primary) 5%, transparent); }
        .hdr { font-weight: 600; opacity: .8; }
      </style>
      <h3>${today.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h3>
      <div class="grid hdr">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div class="grid">${cells.map(c => `<div class="day">${c}</div>`).join('')}</div>
    `;
  }
});

