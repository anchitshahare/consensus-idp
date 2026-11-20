/**
 * ConsensusIDP — Screen 3: Workflow / DAG Builder
 * 2-Node Pipeline: Split Node (page range boundaries) + Extraction Node (Dual LLMs).
 * Clicking DAG nodes switches the inspector panel.
 */

(function () {
  let selectedNode = 'extraction'; // 'split' | 'extraction'

  function render(container) {
    const s = appState.s();
    const wf = s.workflow;

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-6 py-8">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>${esc(s.workspace ? s.workspace.name : 'Workspace')}</span>
              <span>/</span>
              <span>${esc(s.schema.name)}</span>
              <span>/</span>
              <span class="text-slate-600">DAG Pipeline</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Workflow &amp; Extraction DAG</h1>
            <p class="text-xs text-slate-500 mt-0.5">Two-stage execution: Document segmentation followed by dual-model raw &amp; schema consensus extraction.</p>
          </div>

          <button
            id="btn-continue-workflow"
            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Continue to File Upload
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Main Layout: DAG Canvas (7 cols) + Node Config Inspector (5 cols) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- Left: DAG Visual Canvas (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
            
            <div class="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-100 mb-8">
              <span class="font-mono uppercase text-[10px] tracking-wider font-semibold text-slate-500">Pipeline Flow Diagram</span>
              <span>Click a node to inspect parameters</span>
            </div>

            <!-- Visual Flow Diagram -->
            <div class="flex flex-col items-center justify-center gap-6 my-auto py-4">

              <!-- Source Input Document -->
              <div class="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono shadow-2xs">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <span>Input: Bundled Multi-Page PDF</span>
              </div>

              <!-- Connector Arrow -->
              <div class="w-px h-6 bg-slate-300 relative">
                <div class="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-r-2 border-slate-400 transform rotate-45"></div>
              </div>

              <!-- Node 1: Split Node -->
              <div
                id="dag-node-split"
                class="dag-node w-full max-w-md ${selectedNode === 'split' ? 'selected' : ''}"
              >
                <div class="node-card rounded-xl border-2 ${selectedNode === 'split' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 bg-white hover:border-slate-300'} p-4 transition-all">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-900">Split Node</div>
                        <div class="text-[11px] text-slate-500">Document Boundary Segmentation</div>
                      </div>
                    </div>
                    <span class="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">2 Children</span>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>Range Rules: p.1-2 / p.3</span>
                    <span class="text-blue-600 font-sans text-xs">Configure &rarr;</span>
                  </div>
                </div>
              </div>

              <!-- Connector Arrow -->
              <div class="w-px h-6 bg-slate-300 relative">
                <div class="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-r-2 border-slate-400 transform rotate-45"></div>
              </div>

              <!-- Node 2: Extraction Node -->
              <div
                id="dag-node-extraction"
                class="dag-node w-full max-w-md ${selectedNode === 'extraction' ? 'selected' : ''}"
              >
                <div class="node-card rounded-xl border-2 ${selectedNode === 'extraction' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 bg-white hover:border-slate-300'} p-4 transition-all">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <div class="text-xs font-bold text-slate-900">Extraction Node (Dual LLMs)</div>
                        <div class="text-[11px] text-slate-500">Raw KV &amp; Schema Extraction Engine</div>
                      </div>
                    </div>
                    <span class="rounded bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-semibold">Consensus IDP</span>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>Claude Sonnet 4.5 + GPT-4o</span>
                    <span class="text-purple-600 font-sans text-xs">Inspect Models &rarr;</span>
                  </div>
                </div>
              </div>

              <!-- Connector Arrow -->
              <div class="w-px h-6 bg-slate-300 relative">
                <div class="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-r-2 border-slate-400 transform rotate-45"></div>
              </div>

              <!-- Destination: Output Triage -->
              <div class="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Auto-Approve (&ge;0.85 Match) &amp; HITL Triage Queue</span>
              </div>

            </div>

            <div class="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-100">
              Pipeline defined: Linear 2-Stage DAG execution
            </div>

          </div>

          <!-- Right: Inspector Configuration Panel (5 cols) -->
          <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-5" id="dag-inspector-panel">
            ${selectedNode === 'split' ? renderSplitConfig(wf) : renderExtractionConfig(wf, s.schema)}
          </div>

        </div>

      </div>
    `;

    wireEvents(container);
  }

  function renderSplitConfig(wf) {
    return `
      <div class="animate-slide-up">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">1</span>
            <h3 class="text-sm font-bold text-slate-900">Split Node Configuration</h3>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Boundary Rules</span>
        </div>

        <p class="text-xs text-slate-500 mb-4">
          Defines start and end page boundaries to split bundled multi-page PDFs into standalone child documents.
        </p>

        <div class="space-y-3 mb-5">
          ${wf.splitRules.map((rule, idx) => `
            <div class="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-800">Child #${idx + 1}: ${esc(rule.childName)}</span>
                <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Pages ${rule.startPage}–${rule.endPage}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5">Start Page</label>
                  <input type="number" value="${rule.startPage}" class="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs font-mono" readonly />
                </div>
                <div>
                  <label class="block text-[10px] text-slate-400 mb-0.5">End Page</label>
                  <input type="number" value="${rule.endPage}" class="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs font-mono" readonly />
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900">
          <div class="font-semibold mb-0.5">✓ Boundary Strategy Validated</div>
          <p class="text-[11px] text-blue-800/80">3-page bundled PDF will produce Child 1 (Priya Raman, 2 pgs) and Child 2 (Daniel Okafor, 1 pg).</p>
        </div>
      </div>
    `;
  }

  function renderExtractionConfig(wf, schema) {
    return `
      <div class="animate-slide-up">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">2</span>
            <h3 class="text-sm font-bold text-slate-900">Selected Extraction LLMs</h3>
          </div>
          <span class="text-[10px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Consensus Engine</span>
        </div>

        <p class="text-xs text-slate-500 mb-4">
          Extraction runs through two independent foundation models in parallel, using raw extraction followed by schema mapping.
        </p>

        <!-- Model Selection Cards -->
        <div class="space-y-3 mb-5">
          
          <!-- Model A -->
          <div class="rounded-lg border-2 border-blue-500 bg-blue-50/40 p-3.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                Primary Model A
              </span>
              <span class="text-[10px] font-mono font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Vision &amp; Coordinates</span>
            </div>
            <div class="text-sm font-bold text-blue-900 mt-1">Anthropic Claude Sonnet 4.5</div>
            <div class="text-[11px] text-slate-600 mt-1">
              Extracts high-resolution visual bounding boxes and dense line-item transaction tables.
            </div>
          </div>

          <!-- Model B -->
          <div class="rounded-lg border-2 border-emerald-500 bg-emerald-50/40 p-3.5">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                Secondary Model B (Consensus Verifier)
              </span>
              <span class="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Cross-Validation</span>
            </div>
            <div class="text-sm font-bold text-emerald-900 mt-1">OpenAI GPT-4o</div>
            <div class="text-[11px] text-slate-600 mt-1">
              Independent tokenization distribution used to verify numeric values and identify visual traps.
            </div>
          </div>

        </div>

        <!-- Consensus Threshold Setting -->
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-slate-800">Auto-Approval Threshold</span>
            <span class="font-mono font-bold text-blue-600">85% Confidence</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-snug">
            When both models match and confidence is &ge; 0.85, the field is automatically approved and published to Amazon Redshift without operator intervention.
          </p>
        </div>

        <div class="rounded-lg bg-slate-100 p-2.5 text-[11px] font-mono text-slate-600 flex items-center justify-between">
          <span>Target Schema:</span>
          <span class="font-semibold text-slate-800">${esc(schema.name)} (${schema.fields.length} keys)</span>
        </div>
      </div>
    `;
  }

  function wireEvents(container) {
    const nodeSplit = container.querySelector('#dag-node-split');
    const nodeExt = container.querySelector('#dag-node-extraction');

    if (nodeSplit) {
      nodeSplit.onclick = () => {
        selectedNode = 'split';
        render(container);
      };
    }

    if (nodeExt) {
      nodeExt.onclick = () => {
        selectedNode = 'extraction';
        render(container);
      };
    }

    const btnContinue = container.querySelector('#btn-continue-workflow');
    if (btnContinue) {
      btnContinue.onclick = () => {
        appState.confirmWorkflow();
        router.go(4);
      };
    }
  }

  router.register(3, render);

})();
