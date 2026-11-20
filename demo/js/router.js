/**
 * ConsensusIDP — Screen Router
 * Maps screen numbers to render functions and manages the progress nav.
 */

(function () {

  const STEPS = [
    { n: 1, label: 'Workspace' },
    { n: 2, label: 'Schema' },
    { n: 3, label: 'Workflow' },
    { n: 4, label: 'Upload' },
    { n: 5, label: 'Pipeline Run' },
    { n: 6, label: 'Review' },
    { n: 7, label: 'Dataset' },
  ];

  const SCREEN_RENDERERS = {}; // registered by each screen file

  function register(screenNum, renderFn) {
    SCREEN_RENDERERS[screenNum] = renderFn;
  }

  function renderProgressNav(state) {
    const nav = document.getElementById('progress-nav');
    if (!nav) return;

    const s = state || (window.appState && window.appState.s()) || { currentScreen: 1, unlockedScreens: [1] };
    const { currentScreen, unlockedScreens } = s;

    let html = '<div class="progress-nav">';

    STEPS.forEach((step, i) => {
      const isDone      = step.n < currentScreen;
      const isActive    = step.n === currentScreen;
      const isUnlocked  = unlockedScreens && unlockedScreens.includes(step.n);
      const cls         = isDone ? 'done' : (isActive ? 'active' : 'locked');
      const ulCls       = isUnlocked && !isActive ? 'unlocked' : '';
      const clickable   = isUnlocked ? `onclick="window.router.go(${step.n})"` : '';

      html += `
        <div class="progress-step ${cls} ${ulCls}" ${clickable} title="${step.label}">
          <div class="step-inner">
            <span class="step-label">${step.label}</span>
            <div class="step-dot-row">
              <div class="step-dot"></div>
            </div>
            <div class="step-line-below"></div>
          </div>
        </div>`;

      // Connector
      if (i < STEPS.length - 1) {
        const connectorDone = step.n < currentScreen ? 'done' : '';
        html += `<div class="step-connector ${connectorDone}"></div>`;
      }
    });

    html += '</div>';
    nav.innerHTML = html;

    // Show reset button once past screen 1
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      if (currentScreen > 1) resetBtn.classList.replace('hidden', 'flex');
      else resetBtn.classList.replace('flex', 'hidden');
    }
  }

  function go(screenNum) {
    const s = window.appState ? window.appState.s() : { unlockedScreens: [1] };
    if (s.unlockedScreens && !s.unlockedScreens.includes(screenNum)) return;
    if (window.appState) {
      window.appState.navigateTo(screenNum);
    }
    renderScreen(screenNum);
  }

  function renderScreen(screenNum) {
    const container = document.getElementById('screen-container');
    if (!container) return;

    const renderFn = SCREEN_RENDERERS[screenNum];
    if (!renderFn) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-3 text-slate-400 py-16">
          <div class="text-4xl mb-1">🚧</div>
          <div class="text-sm font-medium">Screen ${screenNum} is loading…</div>
        </div>`;
      return;
    }

    // Direct render with safe opacity transition
    try {
      renderFn(container);
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    } catch (err) {
      console.error(`Error rendering screen ${screenNum}:`, err);
      container.innerHTML = `
        <div class="p-8 text-center text-rose-600 text-sm">
          Failed to load screen ${screenNum}. Please reset the demo.
          <button onclick="window.app.reset()" class="block mx-auto mt-3 px-3 py-1 bg-rose-100 rounded text-xs">Reset</button>
        </div>`;
    }

    if (window.appState) {
      renderProgressNav(window.appState.s());
    }
  }

  // ── Toast utility ────────────────────────────────────────────

  function showToast(message, type = 'success', duration = 2800) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toast-out 0.25s ease forwards';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  // ── Escape helpers ───────────────────────────────────────────

  function esc(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ── Public API ───────────────────────────────────────────────

  window.router = { register, go, renderScreen, renderProgressNav };
  window.showToast = showToast;
  window.esc = esc;

})();
