/**
 * ConsensusIDP Multi-Model Diff & Provenance Components
 * Manages model consensus views, diff badges, inline editing, and lineage metadata modals.
 */

const BADGE_CONFIG = {
  match: { label: "Model Approved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  mismatch: { label: "Discrepancy Flag", cls: "bg-amber-50 text-amber-700 border-amber-300 font-semibold" },
  low_confidence: { label: "Low Confidence", cls: "bg-orange-50 text-orange-700 border-orange-300" },
  critical: { label: "Critical Guard", cls: "bg-purple-50 text-purple-700 border-purple-300 font-semibold" },
  missing: { label: "Not Found (Null)", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-800 border-emerald-300" },
};

function renderStatusBadge(cell) {
  let key = cell.reviewReason || "match";
  if (cell.critical && cell.reviewStatus === "needs_review") {
    key = "critical";
  }
  const conf = BADGE_CONFIG[key] || BADGE_CONFIG.match;

  const critTag = cell.critical
    ? `<span class="inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-800 border border-purple-200" title="Mandatory human sign-off required">
         <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
         Critical
       </span>`
    : "";

  return `
    <div class="flex items-center gap-1.5">
      <span class="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium tracking-wide ${conf.cls}">
        ${conf.label}
      </span>
      ${critTag}
    </div>
  `;
}

function renderConsensusInspector(cell) {
  const extractions = cell.extractions || [];
  if (extractions.length < 2) return "";

  const [modelA, modelB] = extractions;
  const isMismatch = cell.reviewReason === "mismatch" || modelA.value !== modelB.value;

  const noteHtml = cell.discrepancyNote
    ? `<div class="mt-2 rounded bg-amber-50/80 p-2 text-[11px] text-amber-900 border border-amber-200 flex items-start gap-1.5">
         <svg class="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
         <span><strong>PM Extraction Analysis:</strong> ${cell.discrepancyNote}</span>
       </div>`
    : "";

  return `
    <div class="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs">
      <div class="flex items-center justify-between pb-1.5 border-b border-slate-200/60 mb-2">
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Multi-Model Consensus Comparison
        </span>
        <span class="text-[10px] text-slate-400">2 Independent Providers</span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- Model A -->
        <div class="rounded border ${modelA.value === cell.selectedValue ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white'} p-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-600">${modelA.modelId}</span>
            <span class="rounded bg-slate-100 px-1 text-[9px] font-semibold text-slate-500">${modelA.confidence} Conf</span>
          </div>
          <div class="mt-1 text-[13px] font-mono font-medium text-slate-800 break-words">
            ${modelA.value !== null ? escapeHtml(String(modelA.value)) : '<em class="text-slate-400">null (missing)</em>'}
          </div>
          ${isMismatch && cell.reviewStatus === 'needs_review' ? `
            <button class="mt-2 w-full rounded bg-white border border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onclick="window.demoState.updateCellValue('${cell.cellId}', '${escapeJs(String(modelA.value))}', '${modelA.modelId}')">
              Accept Model A
            </button>` : ''}
        </div>

        <!-- Model B -->
        <div class="rounded border ${modelB.value === cell.selectedValue ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white'} p-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-600">${modelB.modelId}</span>
            <span class="rounded bg-slate-100 px-1 text-[9px] font-semibold text-slate-500">${modelB.confidence} Conf</span>
          </div>
          <div class="mt-1 text-[13px] font-mono font-medium text-slate-800 break-words">
            ${modelB.value !== null ? escapeHtml(String(modelB.value)) : '<em class="text-slate-400">null (missing)</em>'}
          </div>
          ${isMismatch && cell.reviewStatus === 'needs_review' ? `
            <button class="mt-2 w-full rounded bg-white border border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onclick="window.demoState.updateCellValue('${cell.cellId}', '${escapeJs(String(modelB.value))}', '${modelB.modelId}')">
              Accept Model B
            </button>` : ''}
        </div>
      </div>

      ${noteHtml}
    </div>
  `;
}

function openLineageModal(cell) {
  const modal = document.getElementById("lineageModal");
  const modalBody = document.getElementById("lineageModalBody");
  if (!modal || !modalBody) return;

  const lineage = cell.lineage || {};
  const box = cell.boundingBox || {};

  modalBody.innerHTML = `
    <div class="space-y-4 text-xs text-slate-700">
      <div class="flex items-center justify-between border-b pb-3">
        <div>
          <h3 class="text-sm font-bold text-slate-900">${cell.label || cell.fieldName}</h3>
          <span class="font-mono text-[11px] text-slate-500">Key: ${cell.fieldName} · Type: ${cell.dataType}</span>
        </div>
        ${renderStatusBadge(cell)}
      </div>

      <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <div class="text-[10px] uppercase font-semibold text-slate-400">Published / Resolved Value</div>
          <div class="mt-0.5 font-mono text-sm font-bold text-slate-900">${cell.selectedValue != null ? escapeHtml(String(cell.selectedValue)) : '—'}</div>
        </div>
        <div>
          <div class="text-[10px] uppercase font-semibold text-slate-400">Review Status</div>
          <div class="mt-0.5 text-xs font-semibold ${cell.reviewStatus === 'approved' ? 'text-emerald-700' : 'text-amber-700'} uppercase">${cell.reviewStatus.replace('_', ' ')}</div>
        </div>
      </div>

      <div>
        <h4 class="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">Source Document Spatial Provenance</h4>
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border rounded bg-white"><strong class="text-slate-500">Source Document ID:</strong> <span class="font-mono">${lineage.documentId || '—'}</span></div>
          <div class="p-2 border rounded bg-white"><strong class="text-slate-500">Page Reference:</strong> <span>${lineage.pageRef || '—'}</span></div>
          <div class="p-2 border rounded bg-white col-span-2">
            <strong class="text-slate-500">Bounding Box (Norm. Coord):</strong>
            <span class="font-mono text-[10px] block mt-0.5 text-slate-600">x: ${box.x ?? 'N/A'}, y: ${box.y ?? 'N/A'}, w: ${box.w ?? 'N/A'}, h: ${box.h ?? 'N/A'} (Page ${box.page ?? 'N/A'})</span>
          </div>
        </div>
      </div>

      <div>
        <h4 class="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-2">Audit Attribution & Signature</h4>
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 border rounded bg-white"><strong class="text-slate-500">Approved By:</strong> <span class="font-semibold">${lineage.reviewerId || 'Pending Human Review'}</span></div>
          <div class="p-2 border rounded bg-white"><strong class="text-slate-500">Timestamp:</strong> <span>${lineage.reviewedAt || 'Not yet validated'}</span></div>
        </div>
      </div>

      <div>
        <h4 class="font-semibold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Exportable Lineage JSON Payload</h4>
        <pre class="max-h-36 overflow-auto rounded bg-slate-900 p-2.5 font-mono text-[10px] text-slate-200">${escapeHtml(JSON.stringify(cell, null, 2))}</pre>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeLineageModal() {
  const modal = document.getElementById("lineageModal");
  if (modal) modal.classList.add("hidden");
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeJs(str) {
  if (str == null) return "";
  return String(str).replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

window.renderStatusBadge = renderStatusBadge;
window.renderConsensusInspector = renderConsensusInspector;
window.openLineageModal = openLineageModal;
window.closeLineageModal = closeLineageModal;
window.escapeHtml = escapeHtml;
window.escapeJs = escapeJs;
