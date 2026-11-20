/**
 * ConsensusIDP — App Bootstrap
 * Initialises the app, renders the first screen, wires global reset.
 */

(function () {

  function init() {
    const s = appState.s();

    // Render progress nav
    router.renderProgressNav(s);

    // Render the current screen
    router.renderScreen(s.currentScreen);

    // Subscribe to state changes to keep nav in sync
    appState.subscribe((newState) => {
      router.renderProgressNav(newState);
    });
  }

  // Global reset handler (called from header button)
  window.app = {
    reset() {
      if (!confirm('Reset demo to the beginning? All progress will be cleared.')) return;
      appState.fullReset();
      router.renderScreen(1);
    }
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
