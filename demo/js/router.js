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

    const { currentScreen, unlockedScreens } = state;

    let html = '<div class="progress-nav">';

    STEPS.forEach((step, i) => {
      const isDone      = step.n < currentScreen;
      const isActive    = step.n === currentScreen;
      const isUnlocked  = unlockedScreens.includes(step.n);
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
    const s = appState.s();
    if (!s.unlockedScreens.includes(screenNum)) return;
    appState.navigateTo(screenNum);
    renderScreen(screenNum);
  }

  function renderScreen(screenNum) {
    const container = document.getElementById('screen-container');
    if (!container) return;

    const renderFn = SCREEN_RENDERERS[screenNum];
    if (!renderFn) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
          <div class="text-5xl">🚧</div>
          <div class="text-sm font-medium">Screen ${screenNum} coming soon.</div>
        </div>`;
      return;
    }

    // Animate out → in
    container.style.opacity = '0';
    container.style.transform = 'translateY(6px)';
    container.style.transition = 'none';

    requestAnimationFrame(() => {
      renderFn(container);
      container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      });
    });

    renderProgressNav(appState.s());
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
