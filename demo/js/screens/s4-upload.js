/**
 * ConsensusIDP — Screen 4: File Upload & Run
 * Dedicated file selection screen pre-loaded with the Lakeside Inn guest folio PDF.
 */

(function () {

  function render(container) {
    const appState = window.appState;
    const router = window.router;
    const esc = window.esc || (x => x);
    const s = appState ? appState.s() : { workflow: { name: 'Workflow' } };

    const sampleFile = {
      name: 'Lakeside_Inn_Guest_Folios.pdf',
      size: '1.24 MB',
      pageCount: 3,
      format: 'PDF (Vector + Scanned)',
      category: 'Hospitality Multi-Guest Folio',
      features: [
        '3-page bundled PDF with 2 discrete guest stays',
        '17 itemized room charges across multiple pages',
        'Visual coffee-ring stain over contact block',
        'Handwritten strike-through minibar correction ($21 -> $14)',
        'Mid-stay room transfer discrepancy (Room 412 -> 518)'
      ]
    };

    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-6 py-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>${esc(s.workspace ? s.workspace.name : 'Workspace')}</span>
              <span>/</span>
              <span>Pipeline: ${esc(s.workflow ? s.workflow.name : 'Pipeline')}</span>
              <span>/</span>
              <span class="text-slate-600">Document Input</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Upload Source Documents</h1>
            <p class="text-xs text-slate-500 mt-0.5">Select the multi-page document packages to process through the configured DAG.</p>
          </div>
        </div>

        <!-- Pre-Loaded Sample Document Card -->
        <div class="rounded-xl border-2 border-blue-500 bg-white shadow-sm p-6 mb-6 relative overflow-hidden">
          
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-bold text-slate-900">${sampleFile.name}</h3>
                  <span class="rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5">Pre-loaded</span>
                </div>
                <div class="text-xs text-slate-500 mt-0.5 font-mono">${sampleFile.size} · ${sampleFile.pageCount} Pages · ${sampleFile.format}</div>
              </div>
            </div>

            <span class="rounded bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium">
              ${sampleFile.category}
            </span>
          </div>

          <!-- Document Characteristics -->
          <div class="rounded-lg bg-slate-50 border border-slate-200/80 p-4 mb-5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Scenario Stress Tests Present in Document</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              ${sampleFile.features.map(f => `
                <div class="flex items-start gap-2">
                  <span class="text-blue-500 font-bold mt-0.5">▪</span>
                  <span>${f}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Execution Summary -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div class="flex items-center gap-4 text-xs text-slate-500">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                Split: 2 Children (p.1–2, p.3)
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                Models: Claude 4.5 + GPT-4o
              </span>
            </div>

            <!-- Run Button -->
            <button
              id="btn-run-workflow"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Run Workflow
            </button>
          </div>

        </div>

        <div class="text-center text-xs text-slate-400">
          Clean-room demonstration package · Zero external dependencies · Zero live inference calls
        </div>

      </div>
    `;

    const btnRun = container.querySelector('#btn-run-workflow');
    if (btnRun) {
      btnRun.onclick = () => {
        if (appState) appState.setUploadedFile(sampleFile);
        if (router) router.go(5);
      };
    }
  }

  if (window.router) {
    window.router.register(4, render);
  }

})();
