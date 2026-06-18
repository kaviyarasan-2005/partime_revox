/* ============================================================
   DASHBOARD.JS — Customer & Admin Dashboard Interactions
   Mobile Car Audio & Subwoofer Installation Service
   ============================================================ */

'use strict';

/* ── Sidebar Toggle (mobile) ──────────────────────────────── */
const SidebarManager = {
  init() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
};

/* ── SVG Inline Charts ────────────────────────────────────── */
const DashboardCharts = {
  /* Line chart using SVG polyline */
  drawLineChart(canvasEl, data, options = {}) {
    if (!canvasEl) return;
    const canvas = document.getElementById(canvasEl) || canvasEl;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    const h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };

    const max = Math.max(...data.values) * 1.15;
    const min = 0;
    const plotW = cw - pad.left - pad.right;
    const plotH = ch - pad.top - pad.bottom;

    ctx.clearRect(0, 0, cw, ch);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#5A6070' : '#8890A0';
    const lineColor = options.color || '#1A6FDB';

    // Grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = pad.top + (i / gridCount) * plotH;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();

      const val = (max - (i / gridCount) * max).toFixed(0);
      ctx.fillStyle = textColor;
      ctx.font = `${10 * devicePixelRatio / devicePixelRatio}px Inter`;
      ctx.textAlign = 'right';
      ctx.fillText(options.prefix ? options.prefix + val : val, pad.left - 8, y + 4);
    }

    // X-axis labels
    if (data.labels) {
      data.labels.forEach((label, i) => {
        const x = pad.left + (i / (data.labels.length - 1)) * plotW;
        ctx.fillStyle = textColor;
        ctx.font = `10px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, ch - 8);
      });
    }

    // Points
    const pts = data.values.map((v, i) => ({
      x: pad.left + (i / (data.values.length - 1)) * plotW,
      y: pad.top + plotH - ((v - min) / (max - min)) * plotH,
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(pts[0].x, ch - pad.bottom);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, ch - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(59,142,255,0.08)' : 'rgba(26,111,219,0.07)';
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  },

  /* Bar chart */
  drawBarChart(canvasEl, data, options = {}) {
    const canvas = document.getElementById(canvasEl) || canvasEl;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    const h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };

    const max = Math.max(...data.values) * 1.2;
    const plotW = cw - pad.left - pad.right;
    const plotH = ch - pad.top - pad.bottom;

    ctx.clearRect(0, 0, cw, ch);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const textColor = isDark ? '#5A6070' : '#8890A0';
    const barColor = options.color || '#1A6FDB';

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * plotH;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
    }

    // Bars
    const barCount = data.values.length;
    const barTotalW = plotW / barCount;
    const barW = barTotalW * 0.6;
    const barGap = barTotalW * 0.4;

    data.values.forEach((v, i) => {
      const bh = ((v / max)) * plotH;
      const x = pad.left + i * barTotalW + barGap / 2;
      const y = pad.top + plotH - bh;

      ctx.fillStyle = i === options.highlighted ? barColor : (isDark ? 'rgba(59,142,255,0.35)' : 'rgba(26,111,219,0.25)');
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barW - radius, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
      ctx.lineTo(x + barW, y + bh);
      ctx.lineTo(x, y + bh);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fill();

      if (data.labels) {
        ctx.fillStyle = textColor;
        ctx.font = `10px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], x + barW / 2, ch - 8);
      }
    });
  },

  /* Donut chart */
  drawDonutChart(canvasEl, data, options = {}) {
    const canvas = document.getElementById(canvasEl) || canvasEl;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const size = canvas.offsetWidth;
    const cx = size / 2, cy = size / 2;
    const r = size * 0.38;
    const innerR = r * 0.65;

    ctx.clearRect(0, 0, size, size);

    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = options.colors || ['#1A6FDB', '#2C2C2E', '#9EA7B3', '#5A6070', '#66A0FF'];
    let start = -Math.PI / 2;

    data.values.forEach((v, i) => {
      const angle = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      start += angle;
    });

    // Inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#1C1C1E' : '#FFFFFF';
    ctx.fill();

    // Center text
    if (options.center) {
      ctx.fillStyle = isDark ? '#EAEAF0' : '#111114';
      ctx.font = `bold ${size * 0.1}px Space Grotesk`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.center, cx, cy);
    }
  },

  /* Initialize all charts on page */
  initAll() {
    document.querySelectorAll('[data-chart]').forEach(canvas => {
      const type = canvas.dataset.chart;
      let data;
      try { data = JSON.parse(canvas.dataset.chartData || '{}'); } catch { return; }

      if (window.Chart) {
        this.renderChartJs(canvas, type, data);
      } else {
        if (type === 'line') this.drawLineChart(canvas, data, { prefix: data.prefix });
        if (type === 'bar')  this.drawBarChart(canvas, data);
        if (type === 'donut') this.drawDonutChart(canvas, data);
      }
    });
  },

  renderChartJs(canvas, type, data) {
    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A0A8B8' : '#5A6070';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    
    let chartType = type === 'donut' ? 'doughnut' : type;
    
    if (canvas.$chartjs) {
      canvas.$chartjs.destroy();
    }
    
    const config = {
      type: chartType,
      data: {
        labels: data.labels,
        datasets: [{
          label: data.label || 'Value',
          data: data.values,
          backgroundColor: type === 'donut' 
            ? ['#00F0FF', '#FF007F', '#C026D3', '#3B8EFF', '#F59E0B']
            : (type === 'bar' ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 0, 127, 0.2)'),
          borderColor: type === 'donut' 
            ? (isDark ? '#0D0E15' : '#FFFFFF')
            : (type === 'bar' ? '#00F0FF' : '#FF007F'),
          borderWidth: 2,
          fill: type === 'line',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === 'donut',
            labels: { color: textColor }
          }
        }
      }
    };
    
    if (type !== 'donut') {
      config.options.scales = {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      };
    }
    
    canvas.$chartjs = new Chart(ctx, config);
  }
};

/* ── Live Tracking Map Animation ──────────────────────────── */
const LiveTracking = {
  init() {
    const map = document.getElementById('live-map');
    if (!map) return;

    // Animated ping on technician location
    const pin = map.querySelector('.tech-pin');
    if (pin) {
      setInterval(() => {
        pin.style.transform = 'scale(1.2)';
        setTimeout(() => { pin.style.transform = 'scale(1)'; }, 300);
      }, 2000);
    }

    // ETA countdown
    const eta = document.getElementById('eta-countdown');
    if (eta) {
      let mins = parseInt(eta.dataset.eta) || 18;
      const interval = setInterval(() => {
        if (mins <= 0) { clearInterval(interval); eta.textContent = 'Arrived!'; return; }
        mins--;
        eta.textContent = `${mins} min`;
      }, 60000);
    }
  }
};

/* ── Appointment Calendar ─────────────────────────────────── */
const AppointmentCalendar = {
  currentDate: new Date(),
  selected: null,

  init() {
    const cal = document.getElementById('mini-calendar');
    if (!cal) return;
    this.render(cal);

    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    prevBtn?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render(cal);
    });
    nextBtn?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render(cal);
    });
  },

  render(cal) {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

    const header = cal.querySelector('[data-cal-month]');
    if (header) header.textContent = `${months[month]} ${year}`;

    const grid = cal.querySelector('[data-cal-grid]');
    if (!grid) return;

    const today = new Date();
    grid.innerHTML = '';

    // Day headers
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-day-header';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(document.createElement('div'));
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('button');
      cell.className = 'cal-day';
      cell.textContent = d;
      cell.setAttribute('type', 'button');

      const cellDate = new Date(year, month, d);
      if (cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        cell.disabled = true;
        cell.classList.add('past');
      }
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        cell.classList.add('today');
      }
      if (this.selected === `${year}-${month}-${d}`) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', () => {
        grid.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        this.selected = `${year}-${month}-${d}`;

        const display = document.getElementById('selected-date');
        if (display) display.textContent = `${months[month]} ${d}, ${year}`;

        window.CarAudio?.ToastManager?.show(`Appointment date: ${months[month]} ${d}, ${year}`, 'info');
      });

      grid.appendChild(cell);
    }
  }
};

/* ── Data Tables (sortable) ───────────────────────────────── */
const DataTable = {
  init() {
    document.querySelectorAll('[data-sortable]').forEach(table => {
      table.querySelectorAll('thead th[data-col]').forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => this.sortTable(table, th));
      });
    });
  },

  sortTable(table, th) {
    const col = Array.from(th.parentNode.children).indexOf(th);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const asc = th.dataset.sort !== 'asc';

    table.querySelectorAll('thead th').forEach(t => delete t.dataset.sort);
    th.dataset.sort = asc ? 'asc' : 'desc';

    rows.sort((a, b) => {
      const av = a.children[col]?.textContent.trim() || '';
      const bv = b.children[col]?.textContent.trim() || '';
      const an = parseFloat(av.replace(/[^0-9.-]/g, ''));
      const bn = parseFloat(bv.replace(/[^0-9.-]/g, ''));
      if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    rows.forEach(r => tbody.appendChild(r));
  }
};

/* ── Notification System (dashboard) ─────────────────────── */
const NotificationManager = {
  notifications: [
    { id: 1, type: 'info', title: 'Technician Assigned', msg: 'Alex has been assigned to your installation.', time: '2m ago', read: false },
    { id: 2, type: 'success', title: 'Installation Complete', msg: 'Your subwoofer installation is complete!', time: '1h ago', read: false },
    { id: 3, type: 'warning', title: 'Appointment Reminder', msg: 'Your appointment is tomorrow at 10:00 AM.', time: '3h ago', read: true },
  ],

  init() {
    this.render();
    this.updateBadge();
  },

  render() {
    const list = document.getElementById('notification-list');
    if (!list) return;

    list.innerHTML = this.notifications.map(n => `
      <div class="notification-item ${n.read ? 'read' : 'unread'}" data-notif-id="${n.id}">
        <div class="notif-dot" style="${n.read ? 'visibility:hidden' : ''}"></div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="NotificationManager.markRead(${n.id})" aria-label="Mark as read">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>
    `).join('');
  },

  markRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) { notif.read = true; this.render(); this.updateBadge(); }
  },

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.render();
    this.updateBadge();
  },

  updateBadge() {
    const unread = this.notifications.filter(n => !n.read).length;
    document.querySelectorAll('[data-notif-badge]').forEach(badge => {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? '' : 'none';
    });
  }
};

/* ── Settings Tabs ────────────────────────────────────────── */
const SettingsManager = {
  init() {
    const form = document.getElementById('settings-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.classList.add('loading'); btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
        window.CarAudio?.ToastManager?.show('Settings saved successfully!', 'success');
      }, 1000);
    });
  }
};

/* ── Admin Revenue Chart ──────────────────────────────────── */
const RevenueChart = {
  data: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [18500, 22000, 19800, 25600, 28900, 31200, 27400, 33100, 29800, 35600, 38200, 42000],
    prefix: '$'
  },

  init() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    if (window.Chart) {
      DashboardCharts.renderChartJs(canvas, 'line', this.data);
    } else {
      DashboardCharts.drawLineChart(canvas, this.data, { prefix: '$', color: '#1A6FDB' });
      window.addEventListener('resize', () => {
        DashboardCharts.drawLineChart(canvas, this.data, { prefix: '$', color: '#1A6FDB' });
      });
    }
  }
};

/* ── Vehicle Management ───────────────────────────────────── */
const VehicleManager = {
  init() {
    const addBtn = document.getElementById('add-vehicle-btn');
    const modal = document.getElementById('add-vehicle-modal');
    if (!addBtn || !modal) return;

    addBtn.addEventListener('click', () => {
      window.CarAudio?.ModalManager?.open(modal);
    });

    const form = modal.querySelector('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      window.CarAudio?.ToastManager?.show('Vehicle added successfully!', 'success');
      window.CarAudio?.ModalManager?.close(modal);
    });
  }
};

/* ── Warranty Claims ──────────────────────────────────────── */
const WarrantyClaimManager = {
  init() {
    const form = document.getElementById('warranty-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.classList.add('loading'); btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
        window.CarAudio?.ToastManager?.show('Warranty claim submitted! Reference #WC-' + Math.floor(Math.random() * 90000 + 10000), 'success', 'Claim Submitted');
        form.reset();
      }, 1500);
    });
  }
};

/* ── Profile Form ─────────────────────────────────────────── */
const ProfileManager = {
  init() {
    const form = document.getElementById('profile-form');
    if (!form) return;

    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    avatarUpload?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (avatarPreview) avatarPreview.style.backgroundImage = `url(${ev.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.classList.add('loading'); btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
        window.CarAudio?.ToastManager?.show('Profile updated successfully!', 'success');
      }, 1000);
    });
  }
};

/* ── Initialize Dashboard ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.init();
  DashboardCharts.initAll();
  LiveTracking.init();
  AppointmentCalendar.init();
  DataTable.init();
  NotificationManager.init();
  SettingsManager.init();
  RevenueChart.init();
  VehicleManager.init();
  WarrantyClaimManager.init();
  ProfileManager.init();
});

// Expose for event handler use
window.NotificationManager = NotificationManager;
window.DashboardCharts = DashboardCharts;
