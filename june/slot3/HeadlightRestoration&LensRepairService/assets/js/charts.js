/* ============================================================
   LUME — Chart.js Dashboard Charts
   ============================================================ */

const ChartsManager = (() => {

  const COLORS = {
    primary: '#1A3A5C',
    primaryLight: '#2a5a8c',
    primaryAlpha: 'rgba(26, 58, 92, 0.15)',
    secondary: '#D4A843',
    secondaryAlpha: 'rgba(212, 168, 67, 0.2)',
    success: '#27AE60',
    warning: '#E67E22',
    danger: '#C0392B',
    info: '#2980B9',
    purple: '#8e44ad',
    gridLight: 'rgba(0,0,0,0.06)',
    gridDark: 'rgba(255,255,255,0.08)',
    textLight: '#636E72',
    textDark: '#A0A9B0',
  };

  let charts = {};
  let isDark = false;

  function getThemeColors() {
    isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      grid: isDark ? COLORS.gridDark : COLORS.gridLight,
      text: isDark ? COLORS.textDark : COLORS.textLight,
      bg: isDark ? '#152333' : '#FFFFFF',
    };
  }

  function getDefaultOptions(type) {
    const tc = getThemeColors();
    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: tc.text,
            font: { family: 'Inter', size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#0D1B2A' : '#FFFFFF',
          titleColor: isDark ? '#E8E8E8' : '#2D3436',
          bodyColor: isDark ? '#A0A9B0' : '#636E72',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
        }
      }
    };

    if (type !== 'doughnut' && type !== 'pie') {
      base.scales = {
        x: {
          grid: { color: tc.grid, drawBorder: false },
          ticks: { color: tc.text, font: { family: 'Inter', size: 11 } },
          border: { display: false },
        },
        y: {
          grid: { color: tc.grid, drawBorder: false },
          ticks: { color: tc.text, font: { family: 'Inter', size: 11 } },
          border: { display: false },
        }
      };
    }

    return base;
  }

  /* ---- Chart 1: Service History Line Chart (User Dashboard) ---- */
  function initServiceHistoryChart() {
    const canvas = document.getElementById('serviceHistoryChart');
    if (!canvas) return;

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [2, 3, 1, 4, 3, 5];

    const opts = getDefaultOptions('line');
    opts.plugins.legend.display = false;
    opts.elements = {
      line: { tension: 0.4, borderWidth: 2.5 },
      point: { radius: 4, hoverRadius: 6, borderWidth: 2 }
    };

    charts.serviceHistory = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Services',
          data,
          borderColor: COLORS.primary,
          backgroundColor: COLORS.primaryAlpha,
          fill: true,
          pointBackgroundColor: COLORS.secondary,
          pointBorderColor: COLORS.primary,
        }]
      },
      options: opts
    });
  }

  /* ---- Chart 2: Spending Bar Chart (User Dashboard) ---- */
  function initSpendingChart() {
    const canvas = document.getElementById('spendingChart');
    if (!canvas) return;

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const opts = getDefaultOptions('bar');
    opts.plugins.legend.position = 'bottom';
    opts.scales.x.stacked = false;
    opts.scales.y.ticks.callback = (v) => '$' + v;

    charts.spending = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Restoration',
            data: [120, 180, 80, 200, 150, 220],
            backgroundColor: COLORS.primary,
            borderRadius: 4,
          },
          {
            label: 'Repair',
            data: [60, 90, 40, 110, 80, 100],
            backgroundColor: COLORS.secondary,
            borderRadius: 4,
          },
          {
            label: 'Coating',
            data: [30, 50, 20, 60, 40, 70],
            backgroundColor: COLORS.success,
            borderRadius: 4,
          },
          {
            label: 'Warranty',
            data: [10, 20, 5, 25, 15, 30],
            backgroundColor: COLORS.info,
            borderRadius: 4,
          }
        ]
      },
      options: opts
    });
  }

  /* ---- Chart 3: Revenue Area Chart (Admin Dashboard) ---- */
  function initRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    const labels = [];
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      data.push(Math.floor(Math.random() * 1200 + 400));
    }

    const opts = getDefaultOptions('line');
    opts.plugins.legend.display = false;
    opts.elements = {
      line: { tension: 0.4, borderWidth: 2.5 },
      point: { radius: 0, hoverRadius: 5, borderWidth: 2 }
    };
    opts.scales.y.ticks.callback = (v) => '$' + v.toLocaleString();

    // Gradient fill
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(26, 58, 92, 0.35)');
    gradient.addColorStop(1, 'rgba(26, 58, 92, 0.02)');

    charts.revenue = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Revenue',
          data,
          borderColor: COLORS.primary,
          backgroundColor: gradient,
          fill: true,
          pointBackgroundColor: COLORS.secondary,
          pointBorderColor: '#FFFFFF',
        }]
      },
      options: opts
    });

    // Time range buttons
    const rangeBtns = document.querySelectorAll('[data-range]');
    rangeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        rangeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const days = parseInt(btn.getAttribute('data-range'), 10);
        const newLabels = [];
        const newData = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          newLabels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
          newData.push(Math.floor(Math.random() * 1200 + 400));
        }

        charts.revenue.data.labels = newLabels;
        charts.revenue.data.datasets[0].data = newData;
        charts.revenue.update('active');
      });
    });
  }

  /* ---- Chart 4: Service Distribution Doughnut (Admin Dashboard) ---- */
  function initDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;

    const tc = getThemeColors();
    const opts = getDefaultOptions('doughnut');
    opts.plugins.legend.position = 'bottom';
    opts.cutout = '70%';
    opts.plugins.tooltip.callbacks = {
      label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
    };

    // Center text plugin
    opts.plugins.centerText = {
      display: true,
      text: '284',
      subText: 'Total'
    };

    charts.distribution = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Restoration', 'Lens Repair', 'UV Coating', 'Warranty Claims'],
        datasets: [{
          data: [48, 27, 18, 7],
          backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.info],
          borderColor: isDark ? '#152333' : '#FFFFFF',
          borderWidth: 3,
          hoverBorderWidth: 0,
        }]
      },
      options: opts,
      plugins: [{
        id: 'centerText',
        afterDraw(chart) {
          const { ctx, chartArea: { top, bottom, left, right } } = chart;
          const cx = (left + right) / 2;
          const cy = (top + bottom) / 2;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.font = `bold 28px Inter, sans-serif`;
          ctx.fillStyle = isDark ? '#E8E8E8' : '#2D3436';
          ctx.fillText('284', cx, cy - 10);

          ctx.font = `12px Inter, sans-serif`;
          ctx.fillStyle = isDark ? '#A0A9B0' : '#636E72';
          ctx.fillText('Total Services', cx, cy + 14);
          ctx.restore();
        }
      }]
    });
  }

  /* ---- Update all charts for theme change ---- */
  function updateTheme(theme) {
    isDark = theme === 'dark';
    const tc = getThemeColors();

    Object.values(charts).forEach(chart => {
      if (!chart) return;

      // Update grid and tick colors
      if (chart.options.scales) {
        ['x', 'y'].forEach(axis => {
          if (chart.options.scales[axis]) {
            chart.options.scales[axis].grid.color = tc.grid;
            chart.options.scales[axis].ticks.color = tc.text;
          }
        });
      }

      // Update tooltip colors
      chart.options.plugins.tooltip.backgroundColor = isDark ? '#0D1B2A' : '#FFFFFF';
      chart.options.plugins.tooltip.titleColor = isDark ? '#E8E8E8' : '#2D3436';
      chart.options.plugins.tooltip.bodyColor = isDark ? '#A0A9B0' : '#636E72';
      chart.options.plugins.tooltip.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

      // Update legend colors
      chart.options.plugins.legend.labels.color = tc.text;

      // Update doughnut border
      if (chart.config.type === 'doughnut') {
        chart.data.datasets.forEach(ds => {
          ds.borderColor = isDark ? '#152333' : '#FFFFFF';
        });
      }

      chart.update('none');
    });
  }

  /* ---- Init all charts ---- */
  function init() {
    if (typeof Chart === 'undefined') return;

    // Set Chart.js global defaults
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.animation.duration = 800;
    Chart.defaults.animation.easing = 'easeOutQuart';

    initServiceHistoryChart();
    initSpendingChart();
    initRevenueChart();
    initDistributionChart();
  }

  return { init, updateTheme };
})();

document.addEventListener('DOMContentLoaded', () => ChartsManager.init());
