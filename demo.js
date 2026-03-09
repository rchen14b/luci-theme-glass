/* ==========================================================================
   luci-theme-glass — Demo site interactivity
   ========================================================================== */

(function() {
  'use strict';

  /* ---- Theme toggle (shared between login + main views) ---- */
  function initThemeToggle() {
    var btns = document.querySelectorAll('[id^="theme-toggle"]');
    var order = ['auto', 'light', 'dark'];
    var labels = { auto: 'Theme: Auto', light: 'Theme: Light', dark: 'Theme: Dark' };

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      var d = document.getElementById('dark-styles');
      var m = document.getElementById('meta-theme-color');
      if (theme === 'dark') { d.media = 'all'; if (m) m.content = '#2c2e3a'; }
      else if (theme === 'light') { d.media = 'not all'; if (m) m.content = '#f5f5f7'; }
      else { d.media = '(prefers-color-scheme: dark)'; if (m) m.content = window.matchMedia('(prefers-color-scheme: dark)').matches ? '#2c2e3a' : '#f5f5f7'; }
      btns.forEach(function(btn) { btn.title = labels[theme]; btn.setAttribute('aria-label', labels[theme]); });
      try { localStorage.setItem('glass-theme', theme); } catch (e) {}
    }

    var cur = document.documentElement.dataset.theme || 'auto';
    btns.forEach(function(btn) {
      btn.title = labels[cur];
      btn.setAttribute('aria-label', labels[cur]);
      btn.addEventListener('click', function() {
        var c = document.documentElement.dataset.theme || 'auto';
        var next = order[(order.indexOf(c) + 1) % 3];
        applyTheme(next);
      });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (document.documentElement.dataset.theme !== 'auto') return;
      var m = document.getElementById('meta-theme-color');
      if (m) m.content = e.matches ? '#2c2e3a' : '#f5f5f7';
    });
  }

  /* ---- Login → Main transition ---- */
  function initLogin() {
    var form = document.getElementById('login-form');
    var loginView = document.getElementById('login-view');
    var mainView = document.getElementById('main-view');
    if (!form || !loginView || !mainView) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      loginView.style.opacity = '0';
      loginView.style.transform = 'scale(0.96)';

      setTimeout(function() {
        loginView.style.display = 'none';
        mainView.style.display = 'block';
        requestAnimationFrame(function() {
          mainView.classList.add('visible');
          initSidebarSlider();
        });
      }, 300);
    });

    /* Focus password field */
    var pw = document.getElementById('luci_password');
    if (pw) pw.focus();
  }

  /* ---- Logout → back to login ---- */
  function initLogout() {
    var btns = document.querySelectorAll('[data-name="logout"]');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var mainView = document.getElementById('main-view');
        var loginView = document.getElementById('login-view');
        mainView.classList.remove('visible');
        mainView.style.opacity = '0';
        setTimeout(function() {
          mainView.style.display = 'none';
          loginView.style.display = '';
          loginView.style.opacity = '1';
          loginView.style.transform = '';
          var pw = document.getElementById('luci_password');
          if (pw) pw.focus();
        }, 300);
      });
    });
  }

  /* ---- Mobile sidebar toggle ---- */
  function initSidebar() {
    var toggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!toggle || !sidebar || !overlay) return;

    function close() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }
    toggle.addEventListener('click', function() {
      sidebar.classList.contains('open') ? close() : (sidebar.classList.add('open'), overlay.classList.add('active'));
    });
    overlay.addEventListener('click', close);
  }

  /* ---- Sidebar nav — parent expand/collapse + sub-item clicks ---- */
  function initSidebarNav() {
    var parents = document.querySelectorAll('.nav-item[data-parent]');

    /* Parent items toggle their next .nav-sub */
    parents.forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        var sub = item.nextElementSibling;
        if (!sub || !sub.classList.contains('nav-sub')) return;

        if (sub.classList.contains('open')) {
          /* Collapse */
          sub.classList.remove('open');
          item.classList.remove('open');
        } else {
          /* Expand */
          sub.classList.add('open');
          item.classList.add('open');
        }
      });
    });

    /* Sub-item clicks — slide indicator + switch page */
    var subItems = document.querySelectorAll('.nav-sub .nav-item');
    subItems.forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        var pageId = item.dataset.page;
        if (!pageId) return;

        /* Clear active from ALL sub-items across all groups */
        document.querySelectorAll('.nav-sub .nav-item.active').forEach(function(a) {
          a.classList.remove('active');
        });
        /* Hide slider in all other nav-subs */
        document.querySelectorAll('.nav-sub .nav-slider').forEach(function(s) {
          s.style.opacity = '0';
        });

        item.classList.add('active');

        /* Slide nav-slider in this sub */
        var slider = item.parentElement.querySelector('.nav-slider');
        if (slider) {
          slider.style.top = item.offsetTop + 'px';
          slider.style.height = item.offsetHeight + 'px';
          slider.style.opacity = '1';
        }

        /* Update header title to show the active page name */
        var title = document.getElementById('header-title');
        var label = item.querySelector('.nav-label');
        if (title && label) {
          title.textContent = label.textContent;
        }

        /* Switch page content */
        switchPage(pageId);

        /* Close sidebar on mobile */
        if (window.innerWidth <= 1024) {
          var sidebar = document.getElementById('sidebar');
          var overlay = document.getElementById('sidebar-overlay');
          if (sidebar) sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('active');
        }
      });
    });
  }

  /* ---- Position sidebar slider on active item ---- */
  function initSidebarSlider() {
    var active = document.querySelector('.nav-sub .nav-item.active');
    if (!active) return;
    var slider = active.parentElement.querySelector('.nav-slider');
    if (!slider) return;
    slider.style.transition = 'none';
    slider.style.top = active.offsetTop + 'px';
    slider.style.height = active.offsetHeight + 'px';
    slider.style.opacity = '1';
    requestAnimationFrame(function() { slider.style.transition = ''; });
  }

  /* ---- Switch page content ---- */
  function switchPage(pageId) {
    var pages = document.querySelectorAll('.page-content');
    var targetId = 'page-' + pageId;
    var found = false;

    pages.forEach(function(page) {
      if (page.id === targetId) {
        page.classList.add('active');
        page.style.animation = 'none';
        requestAnimationFrame(function() { page.style.animation = ''; });
        found = true;
      } else {
        page.classList.remove('active');
      }
    });

    /* Pages without dedicated content → show placeholder */
    if (!found) {
      var existing = document.getElementById('page-placeholder');
      if (existing) existing.remove();

      pages.forEach(function(p) { p.classList.remove('active'); });

      var placeholder = document.createElement('div');
      placeholder.className = 'page-content active';
      placeholder.id = 'page-placeholder';
      placeholder.innerHTML = '<div class="cbi-section"><h3>' + pageId.charAt(0).toUpperCase() + pageId.slice(1) + '</h3><p style="color:var(--color-text-secondary);padding:var(--space-lg) 0;">This page is not available in the demo.</p></div>';
      document.getElementById('maincontent').appendChild(placeholder);
    } else {
      var existing = document.getElementById('page-placeholder');
      if (existing) existing.remove();
    }
  }

  /* ---- CBI tab switching (in-page tabs) ---- */
  function initCBITabs() {
    var tabLinks = document.querySelectorAll('.cbi-tabmenu a');
    tabLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var tabId = link.dataset.tab;
        if (!tabId) return;

        /* Update active tab */
        var menu = link.closest('.cbi-tabmenu');
        if (menu) {
          menu.querySelectorAll('li').forEach(function(li) { li.classList.remove('cbi-tab'); });
          link.parentElement.classList.add('cbi-tab');
        }

        /* Show/hide tab content */
        var section = link.closest('.cbi-section');
        if (section) {
          section.querySelectorAll('.cbi-tab-content').forEach(function(content) {
            var isTarget = content.id === 'tab-' + tabId;
            content.style.display = isTarget ? '' : 'none';
            content.dataset.tabActive = isTarget ? 'true' : 'false';
          });
        }
      });
    });
  }

  /* ---- Live clock ---- */
  function initClock() {
    var el = document.getElementById('local-time');
    var uptimeEl = document.getElementById('uptime');
    if (!el) return;

    var startTime = Date.now();
    var baseUptime = 3 * 86400 + 14 * 3600 + 32 * 60 + 18; /* 3d 14h 32m 18s in seconds */

    function pad(n) { return n < 10 ? '0' + n : n; }

    function update() {
      var now = new Date();
      el.textContent = now.getFullYear() + '/' +
        pad(now.getMonth() + 1) + '/' +
        pad(now.getDate()) + ' ' +
        pad(now.getHours()) + ':' +
        pad(now.getMinutes()) + ':' +
        pad(now.getSeconds());

      if (uptimeEl) {
        var elapsed = Math.floor((Date.now() - startTime) / 1000);
        var total = baseUptime + elapsed;
        var d = Math.floor(total / 86400);
        var h = Math.floor((total % 86400) / 3600);
        var m = Math.floor((total % 3600) / 60);
        var s = total % 60;
        uptimeEl.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
      }
    }

    update();
    setInterval(update, 1000);
  }

  /* ---- Initialize everything ---- */
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initLogin();
    initLogout();
    initSidebar();
    initSidebarNav();
    initCBITabs();
    initClock();
  });

})();
