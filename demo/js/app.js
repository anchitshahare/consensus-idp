/**
 * ConsensusIDP — App Bootstrap
 * Initialises the app, renders the first screen, wires global reset.
 */

(function () {

  function init() {
    try {
      const appState = window.appState;
      const router = window.router;

      if (!appState || !router) {
        console.error("ConsensusIDP: appState or router missing during bootstrap.");
        return;
      }

      const s = appState.s();

      // Render progress nav
      router.renderProgressNav(s);

      // Render current active screen
      const screenToRender = (s && s.currentScreen) ? s.currentScreen : 1;
      router.renderScreen(screenToRender);

      // Subscribe to state changes to keep nav in sync
      appState.subscribe((newState) => {
        router.renderProgressNav(newState);
      });
    } catch (err) {
      console.error("Bootstrap error in app.js:", err);
      // Fallback: render screen 1 directly
      if (window.router) {
        window.router.renderScreen(1);
      }
    }
  }

  // Global reset handler (called from header button)
  window.app = {
    reset() {
      if (!confirm('Reset demo to the beginning? All progress will be cleared.')) return;
      if (window.appState) {
        window.appState.fullReset();
      }
      if (window.router) {
        window.router.renderScreen(1);
      }
    }
  };

  // Boot on DOM ready or immediate if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
