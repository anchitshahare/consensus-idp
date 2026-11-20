/**
 * ConsensusIDP — Screen 1: Workspace
 *
 * Shows existing workspaces and lets the user create a new one.
 * On creation, unlocks Screen 2 (Schema) and shows a Continue button.
 */

(function () {

  function render(container) {
    const s = appState.s();

    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-6 py-10">

        <!-- Page header -->
        <div class="flex items-start justify-between mb-8">
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Workspaces</h1>
            <p class="text-sm text-slate-500 mt-1">Organise your document extraction projects into isolated workspaces.</p>
          </div>
          <button
            id="btn-new-workspace"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
            </svg>
            New Workspace
          </button>
        </div>

        <!-- Workspace list -->
        <div id="workspace-list">
          ${renderList(s)}
        </div>

        <!-- Continue button -->
        ${s.workspace ? `
          <div class="mt-8 flex justify-end" id="continue-row">
            <button
              onclick="router.go(2)"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Continue to Schema
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>` : ''}

      </div>
    `;

    // Wire new workspace button
    document.getElementById('btn-new-workspace').addEventListener('click', openCreateModal);
  }

  // ── Workspace List HTML ──────────────────────────────────────

  function renderList(s) {
    if (!s.workspace) {
      return `
        <div class="rounded-xl border border-dashed border-slate-300 bg-white/60 px-10 py-16 text-center">
          <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-slate-700 mb-1">No workspaces yet</h3>
          <p class="text-xs text-slate-400 max-w-xs mx-auto">Create a workspace to begin setting up an extraction pipeline for your documents.</p>
        </div>
      `;
    }

    const ws = s.workspace;
    const date = new Date(ws.createdAt);
    const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return `
      <div class="workspace-card rounded-xl border border-blue-300 bg-blue-50/40 p-5 flex items-center gap-5 cursor-default animate-slide-up" style="border-left: 3px solid #2563eb;">
        <div class="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-sm font-semibold text-slate-900">${esc(ws.name)}</span>
            <span class="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase">Active</span>
          </div>
          <div class="text-xs text-slate-400">Created ${dateStr}</div>
          <div class="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>1 document</span>
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 11h16M4 15h8"/>
              </svg>
              <span>1 schema</span>
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>1 workflow</span>
            </span>
          </div>
        </div>
        <div class="flex-shrink-0">
          <span class="text-xs font-medium text-blue-600">Selected ✓</span>
        </div>
      </div>
    `;
  }

  // ── Create Modal ─────────────────────────────────────────────

  function openCreateModal() {
    // Remove any existing modal
    const existing = document.getElementById('create-ws-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'create-ws-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box p-6">
        <h2 class="text-base font-semibold text-slate-900 mb-1">Create Workspace</h2>
        <p class="text-xs text-slate-500 mb-5">Give your workspace a descriptive name. You can always rename it later.</p>

        <label class="block text-xs font-medium text-slate-700 mb-1.5">Workspace name</label>
        <input
          id="ws-name-input"
          type="text"
          value="Hospitality Extraction"
          placeholder="e.g. Hotel Folio Processing"
          class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          autocomplete="off"
          maxlength="60"
        />
        <div id="ws-name-error" class="text-xs text-red-500 mt-1.5 hidden">Please enter a workspace name.</div>

        <div class="mt-5 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-ws"
            class="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-ws"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            Create Workspace
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = document.getElementById('ws-name-input');
    const errorEl = document.getElementById('ws-name-error');
    const confirmBtn = document.getElementById('btn-confirm-ws');
    const cancelBtn = document.getElementById('btn-cancel-ws');

    // Focus input on open
    setTimeout(() => input.select(), 50);

    // Allow Enter key to submit
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    });

    cancelBtn.addEventListener('click', () => overlay.remove());

    // Click outside to cancel
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    confirmBtn.addEventListener('click', () => {
      const name = input.value.trim();
      if (!name) {
        errorEl.classList.remove('hidden');
        input.focus();
        return;
      }

      const ok = appState.createWorkspace(name);
      if (ok) {
        overlay.remove();
        // Re-render the screen to show the new workspace
        const container = document.getElementById('screen-container');
        if (container) render(container);
        showToast(`Workspace "${name}" created.`, 'success');
      }
    });
  }

  // ── Register with Router ─────────────────────────────────────

  router.register(1, render);

})();
