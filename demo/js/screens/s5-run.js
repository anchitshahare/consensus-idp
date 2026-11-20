/**
 * ConsensusIDP — Screen 5: Pipeline Run
 * 3-Second animated execution simulating document splitting, raw extraction,
 * schema extraction, consensus matching, auto-approval to Redshift, and routing to HITL.
 */

(function () {
  let timerId = null;

  function render(container) {
    const s = appState.s();

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-6 py-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>Pipeline: ${esc(s.workflow.name)}</span>
              <span>/</span>
              <span class="text-slate-600">DAG Execution</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span id="run-status-spinner" class="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin inline-block"></span>
              <span id="run-status-title">Executing Workflow DAG…</span>
            </h1>
          </div>

          <div class="flex items-center gap-2">
            <button
              id="btn-skip-run"
              class="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 bg-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Skip Animation &rarr;
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
          <div id="run-progress-bar" class="bg-blue-600 h-full w-0 transition-all duration-300 ease-out"></div>
        </div>

        <!-- Terminal Log Console -->
        <div class="log-terminal mb-6 shadow-sm overflow-hidden" id="terminal-body">
          <!-- Populated by animation -->
        </div>

        <!-- Completion Actions (Hidden initially) -->
        <div id="run-completion-actions" class="hidden rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 animate-slide-up">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-sm font-bold text-emerald-950">Workflow Execution Complete (3.0s)</span>
              </div>
              <p class="text-xs text-emerald-800 mt-1">
                44 fields auto-approved and published to Redshift. <strong>7 fields flagged</strong> for Human-in-the-Loop review.
              </p>
            </div>

            <div class="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="btn-goto-dataset-early"
                class="flex-1 sm:flex-initial text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2.5 rounded-lg shadow-2xs transition-colors"
              >
                View Auto-Approved Data
              </button>
              <button
                id="btn-goto-hitl"
                class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
              >
                Review 7 Flagged Fields &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    startExecution(container);
  }

  function startExecution(container) {
    const term = container.querySelector('#terminal-body');
    const pbar = container.querySelector('#run-progress-bar');
    const title = container.querySelector('#run-status-title');
    const spinner = container.querySelector('#run-status-spinner');
    const actions = container.querySelector('#run-completion-actions');
    const btnSkip = container.querySelector('#btn-skip-run');

    const logs = [
      { t: 0,    pct: 10,  msg: '<span class="log-info">[00:00.0]</span> Initiating DAG pipeline on Lakeside_Inn_Guest_Folios.pdf (3 pages)...' },
      { t: 400,  pct: 28,  msg: '<span class="log-ok">[00:00.4]</span> <strong>Split Node:</strong> Document segmentation complete. Generated 2 child records:' },
      { t: 650,  pct: 35,  msg: '<span class="log-child">└─ Child 1: Folio LI-20417 (Priya Raman) — Pages 1–2 (17 itemized charges)</span>' },
      { t: 850,  pct: 42,  msg: '<span class="log-child">└─ Child 2: Folio LI-20418 (Daniel Okafor) — Page 3 (Single-night express stay)</span>' },
      { t: 1200, pct: 60,  msg: '<span class="log-ok">[00:01.2]</span> <strong>Extraction Node (Pass 1):</strong> Parallel Raw KV Extraction complete across Claude Sonnet 4.5 &amp; GPT-4o (51 total keys extracted).' },
      { t: 1900, pct: 80,  msg: '<span class="log-ok">[00:01.9]</span> <strong>Extraction Node (Pass 2):</strong> Schema-Specific Extraction complete. Target schema mapped using raw extractions as input.' },
      { t: 2500, pct: 95,  msg: '<span class="log-wait">[00:02.5]</span> <strong>Consensus Engine:</strong> Evaluating model agreement &amp; confidence scores (&ge; 0.85):' },
      { t: 2750, pct: 98,  msg: '<span class="log-child text-emerald-400">✓ 44 fields auto-approved (Dual-model exact agreement &ge; 0.85 conf) ➔ Published to Amazon Redshift</span>' },
      { t: 2900, pct: 99,  msg: '<span class="log-child text-amber-400">⚠ 7 fields flagged (Room change trap, coffee stain, handwritten minibar strike-through) ➔ Routing to HITL queue</span>' },
      { t: 3000, pct: 100, msg: '<span class="log-ok font-bold">[00:03.0]</span> <strong>Pipeline execution completed successfully in 3.0 seconds.</strong>' }
    ];

    term.innerHTML = '';

    // Play logs over 3000ms
    const timeouts = [];

    logs.forEach(item => {
      const id = setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = item.msg;
        term.appendChild(line);
        pbar.style.width = item.pct + '%';
        term.scrollTop = term.scrollHeight;

        if (item.pct === 100) {
          finishRun();
        }
      }, item.t);
      timeouts.push(id);
    });

    function finishRun() {
      timeouts.forEach(clearTimeout);
      spinner.classList.add('hidden');
      title.textContent = 'Workflow Execution Complete';
      title.classList.add('text-emerald-700');
      btnSkip.classList.add('hidden');
      actions.classList.remove('hidden');

      // Update state
      appState.initReviewState();
      appState.completeRun();

      // Wire next buttons
      const btnHitl = container.querySelector('#btn-goto-hitl');
      if (btnHitl) btnHitl.onclick = () => router.go(6);

      const btnDs = container.querySelector('#btn-goto-dataset-early');
      if (btnDs) btnDs.onclick = () => router.go(7);
    }

    btnSkip.onclick = () => {
      timeouts.forEach(clearTimeout);
      term.innerHTML = logs.map(l => `<div class="log-line">${l.msg}</div>`).join('');
      pbar.style.width = '100%';
      finishRun();
    };
  }

  router.register(5, render);

})();
