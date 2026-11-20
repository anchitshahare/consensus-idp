/**
 * ConsensusIDP — Screen 7: Curated Output Dataset
 * Displays the published analytical table in Amazon Redshift format,
 * showing unified columns across records, publish status, and lineage inspection.
 */

(function () {

  function render(container) {
    const s = appState.s();
    const file = appState.getCurrentReviewFile();

    if (!file || !file.children) {
      container.innerHTML = `<div class="p-12 text-center text-slate-400">No output dataset available.</div>`;
      return;
    }

    // Build flattened row objects for each child document
    const rows = [];
    const allColumnKeys = new Set(['_child_doc', '_pages', '_publish_status', '_published_on']);

    file.children.forEach(c => {
      const row = {
        _child_doc: c.childDisplayName,
        _pages: `pp. ${c.pages.join(', ')}`,
        _publish_status: c.publishStatus.toUpperCase(),
        _published_on: file.lastPublishedOn ? new Date(file.lastPublishedOn).toLocaleTimeString() : 'PENDING'
      };

      c.components.forEach(comp => {
        comp.cells.forEach(cell => {
          allColumnKeys.add(cell.fieldName);
          row[cell.fieldName] = cell.selectedValue;
        });
      });

      rows.push(row);
    });

    const columns = Array.from(allColumnKeys);

    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-6 py-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>${esc(s.workspace ? s.workspace.name : 'Workspace')}</span>
              <span>/</span>
              <span>Pipeline: ${esc(s.workflow.name)}</span>
              <span>/</span>
              <span class="text-slate-600">Output Lake</span>
            </div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold text-slate-900 tracking-tight">Curated Output Dataset</h1>
              <span class="rounded bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 text-xs font-mono font-semibold">
                Table: redshift_curated_folios
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1">
              Governed analytical records exported via Change-Data-Capture (CDC) from consensus-validated document extractions.
            </p>
          </div>

          <div class="flex items-center gap-2.5">
            <button
              onclick="router.go(6)"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
            >
              &larr; Back to HITL Review
            </button>
            <button
              onclick="window.app.reset()"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors"
            >
              Reset Demo ↺
            </button>
          </div>
        </div>

        <!-- Simulated Warehouse Notice Banner -->
        <div class="rounded-xl border border-blue-200 bg-blue-50/70 p-4 mb-6 text-xs text-blue-900 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <strong class="font-bold">Simulated Data Warehouse Sync:</strong> In this clean-room portfolio walkthrough, consensus-approved fields are stored in client-side reactive state. In production enterprise deployments, this engine streams validated CDC events via Apache Kafka into Amazon Redshift or Snowflake schemas.
          </div>
        </div>

        <!-- Dataset Table -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Synchronized Records (${rows.length})</span>
            <span class="text-slate-400 font-mono text-[11px]">${columns.length} columns (Full schema union)</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50/60 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  ${columns.map(c => `
                    <th class="py-2.5 px-3 whitespace-nowrap font-mono ${c.startsWith('_') ? 'text-indigo-900 bg-indigo-50/40' : ''}">${c}</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${rows.map(row => {
                  const isPublished = row._publish_status === 'PUBLISHED';
                  return `
                    <tr class="hover:bg-slate-50/80 transition-colors ${isPublished ? 'bg-emerald-50/20' : ''}">
                      ${columns.map(col => {
                        const val = row[col];
                        const isSystem = col.startsWith('_');
                        return `
                          <td class="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] ${
                            isSystem ? 'font-semibold text-indigo-900 bg-slate-50/30' : 'text-slate-800'
                          }">
                            ${
                              col === '_publish_status'
                                ? (val === 'PUBLISHED'
                                    ? '<span class="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">PUBLISHED</span>'
                                    : '<span class="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px] font-bold">PENDING_REVIEW</span>')
                                : (val != null ? esc(String(val)) : '<span class="text-slate-300">NULL</span>')
                            }
                          </td>
                        `;
                      }).join('')}
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Metric Footnote -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Straight-Through Processing</div>
            <div class="text-lg font-bold text-emerald-600">86.2%</div>
            <p class="text-slate-500 text-[11px] mt-0.5">44 of 51 fields auto-approved without operator intervention.</p>
          </div>
          <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Human Triage Touchpoints</div>
            <div class="text-lg font-bold text-blue-600">7 Fields</div>
            <p class="text-slate-500 text-[11px] mt-0.5">Discrepancies and critical liability locks resolved in HITL queue.</p>
          </div>
          <div class="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">Pipeline Cloud Cost</div>
            <div class="text-lg font-bold text-slate-800">$0.034 / page</div>
            <p class="text-slate-500 text-[11px] mt-0.5">Dual foundation model inference on commodity cloud APIs.</p>
          </div>
        </div>

      </div>
    `;
  }

  if (window.router) {
    window.router.register(7, render);
  }

})();
