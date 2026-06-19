/* ============================================================
   LUME — Dashboard Interactions
   Sidebar, topbar, data interactions
   ============================================================ */

const DashboardManager = (() => {

  /* ---- Sidebar Toggle ---- */
  function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar) return;

    const isMobile = () => window.innerWidth < 1024;
    const STORAGE_KEY = 'lume-sidebar-collapsed';

    // Restore saved state (desktop only)
    if (!isMobile() && localStorage.getItem(STORAGE_KEY) === 'true') {
      sidebar.classList.add('collapsed');
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (isMobile()) {
          sidebar.classList.toggle('mobile-open');
          if (overlay) overlay.classList.toggle('active');
          document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        } else {
          sidebar.classList.toggle('collapsed');
          localStorage.setItem(STORAGE_KEY, sidebar.classList.contains('collapsed'));
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMobileSidebar);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isMobile() && sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      }
    });

    function closeMobileSidebar() {
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMobile()) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 150);
    });
  }

  /* ---- Active Sidebar Link ---- */
  function initActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.sidebar-nav-item[data-page]');
    links.forEach(link => {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Notification Badge ---- */
  function updateNotificationCount(count) {
    const badge = document.querySelector('.topbar-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  /* ---- Skeleton Loaders → Real Content ---- */
  function initSkeletonLoaders() {
    const skeletons = document.querySelectorAll('[data-skeleton]');
    skeletons.forEach(el => {
      const delay = parseInt(el.getAttribute('data-skeleton') || '800', 10);
      setTimeout(() => {
        const real = el.getAttribute('data-real');
        if (real) el.textContent = real;
        el.classList.remove('skeleton', 'skeleton-text', 'skeleton-title', 'skeleton-card');
        el.removeAttribute('data-skeleton');
      }, delay);
    });
  }

  /* ---- Upload Area Drag & Drop ---- */
  function initUploadAreas() {
    const areas = document.querySelectorAll('.upload-area');
    areas.forEach(area => {
      const input = area.querySelector('input[type="file"]') || null;

      area.addEventListener('dragover', e => {
        e.preventDefault();
        area.classList.add('drag-over');
      });

      area.addEventListener('dragleave', () => area.classList.remove('drag-over'));

      area.addEventListener('drop', e => {
        e.preventDefault();
        area.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files, area);
      });

      area.addEventListener('click', () => {
        if (input) input.click();
      });

      if (input) {
        input.addEventListener('change', () => handleFiles(input.files, area));
      }
    });
  }

  function handleFiles(files, area) {
    if (!files || !files.length) return;
    const count = files.length;
    const icon = area.querySelector('i');
    const text = area.querySelector('p');
    if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.color = '#27AE60'; }
    if (text) text.textContent = `${count} file${count !== 1 ? 's' : ''} selected`;
  }

  /* ---- Table Sort ---- */
  function initTableSort() {
    const tables = document.querySelectorAll('.data-table[data-sortable]');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th[data-col]');
      headers.forEach(th => {
        th.addEventListener('click', () => {
          const col = th.getAttribute('data-col');
          const tbody = table.querySelector('tbody');
          if (!tbody) return;

          const isAsc = th.classList.contains('sort-asc');
          headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc', 'sorted'));
          th.classList.add('sorted', isAsc ? 'sort-desc' : 'sort-asc');

          const icon = th.querySelector('.sort-icon');
          if (icon) icon.className = `fa-solid fa-sort-${isAsc ? 'down' : 'up'} sort-icon`;

          const rows = Array.from(tbody.querySelectorAll('tr'));
          rows.sort((a, b) => {
            const aVal = a.querySelector(`td[data-col="${col}"]`)?.textContent.trim() || '';
            const bVal = b.querySelector(`td[data-col="${col}"]`)?.textContent.trim() || '';
            const aNum = parseFloat(aVal.replace(/[^0-9.]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^0-9.]/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
              return isAsc ? bNum - aNum : aNum - bNum;
            }
            return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });

          rows.forEach(row => tbody.appendChild(row));
        });
      });
    });
  }

  /* ---- Table Pagination ---- */
  function initTablePagination() {
    const tables = document.querySelectorAll('[data-paginate]');
    tables.forEach(container => {
      const perPage = parseInt(container.getAttribute('data-paginate') || '10', 10);
      const tbody = container.querySelector('tbody');
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const totalPages = Math.ceil(rows.length / perPage);
      let currentPage = 1;

      function render() {
        rows.forEach((row, i) => {
          row.style.display = (i >= (currentPage - 1) * perPage && i < currentPage * perPage) ? '' : 'none';
        });
        updatePaginationUI();
        updateTableInfo();
      }

      function updatePaginationUI() {
        const paginationEl = container.parentElement?.querySelector('.table-pagination');
        if (!paginationEl) return;
        paginationEl.innerHTML = '';

        const prev = createPageBtn('<i class="fa-solid fa-chevron-left"></i>', currentPage === 1, () => { currentPage--; render(); });
        paginationEl.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
          const btn = createPageBtn(i, false, () => { currentPage = i; render(); });
          if (i === currentPage) btn.classList.add('active');
          paginationEl.appendChild(btn);
        }

        const next = createPageBtn('<i class="fa-solid fa-chevron-right"></i>', currentPage === totalPages, () => { currentPage++; render(); });
        paginationEl.appendChild(next);
      }

      function createPageBtn(label, disabled, onClick) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        btn.innerHTML = label;
        btn.disabled = disabled;
        btn.addEventListener('click', onClick);
        return btn;
      }

      function updateTableInfo() {
        const infoEl = container.parentElement?.querySelector('.table-info');
        if (!infoEl) return;
        const start = (currentPage - 1) * perPage + 1;
        const end = Math.min(currentPage * perPage, rows.length);
        infoEl.textContent = `Showing ${start}–${end} of ${rows.length} entries`;
      }

      render();
    });
  }

  /* ---- Filter Buttons ---- */
  function initFilterButtons() {
    const filterGroups = document.querySelectorAll('[data-filter-group]');
    filterGroups.forEach(group => {
      const btns = group.querySelectorAll('.filter-btn');
      const targetId = group.getAttribute('data-filter-group');
      const target = document.getElementById(targetId);

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.getAttribute('data-filter');
          if (!target) return;

          const rows = target.querySelectorAll('tbody tr');
          rows.forEach(row => {
            if (filter === 'all') {
              row.style.display = '';
            } else {
              const status = row.querySelector('[data-status]')?.getAttribute('data-status') || '';
              row.style.display = status.toLowerCase() === filter.toLowerCase() ? '' : 'none';
            }
          });
        });
      });
    });
  }

  /* ---- User Avatar Dropdown ---- */
  function initUserDropdown() {
    const userBtn = document.querySelector('.topbar-user');
    const dropdown = document.querySelector('.user-dropdown');
    if (!userBtn || !dropdown) return;

    userBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }

  /* ---- Init ---- */
  function init() {
    initSidebar();
    initActiveSidebarLink();
    initSkeletonLoaders();
    initUploadAreas();
    initTableSort();
    initTablePagination();
    initFilterButtons();
    initUserDropdown();
    updateNotificationCount(3);
  }

  return { init, updateNotificationCount };
})();

document.addEventListener('DOMContentLoaded', () => DashboardManager.init());
