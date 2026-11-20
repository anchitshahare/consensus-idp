/**
 * ConsensusIDP — Screen 6: Human-in-the-Loop (HITL) Review Queue
 * Split screen: Left = PDF viewer with spatial bounding boxes (constrained to child pages).
 * Right = Field review queue (default "Needs Review" tab) with focused dual-model inspector.
 */

(function () {
  let zoomLevel = 1.0;
  let showAllBoxes = false;

  function render(container) {
    const s = appState.s();
    if (!s.reviewState) {
      appState.initReviewState();
    }

    const file = appState.getCurrentReviewFile();
    const child = appState.getCurrentChild();
    const summary = appState.getChildSummary();

    if (!file || !child) {
      container.innerHTML = `<div class="p-12 text-center text-slate-400">Loading document review data…</div>`;
      return;
    }

    const childPages = appState.getChildPages();
    const pageIndex = childPages.indexOf(s.currentPageNum) >= 0 ? childPages.indexOf(s.currentPageNum) : 0;
    const activePage = childPages[pageIndex];

    container.innerHTML = `
      <div class="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-100">
        
        <!-- Top Review Header -->
        <div class="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-20 shadow-xs">
          
          <!-- Child Document Selector Pills -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Child Doc:</span>
            <div class="flex items-center gap-1.5">
              ${file.children.map(c => {
                const isSelected = c.childId === s.activeChildId;
                const hasPending = c.components.some(comp => comp.cells.some(cell => cell.reviewStatus === 'needs_review'));
                return `
                  <button
                    data-child-id="${c.childId}"
                    class="btn-select-child px-3 py-1 text-xs rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border border-blue-300 font-semibold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }"
                  >
                    <span>${esc(c.childDisplayName.split('—')[1] || c.childDisplayName)}</span>
                    <span class="w-1.5 h-1.5 rounded-full ${hasPending ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Review Progress & Primary Publish Action -->
          <div class="flex items-center gap-3">
            
            <!-- Outstanding status tag -->
            <div class="flex items-center gap-2 text-xs">
              <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                summary.needsReview > 0 ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }">
                ${summary.needsReview > 0 
                  ? `⚠ ${summary.needsReview} Needs Review ${summary.criticalPending > 0 ? `(${summary.criticalPending} critical)` : ''}`
                  : '✓ All Fields Approved'}
              </span>
              <span class="text-slate-400">·</span>
              <span class="text-[11px] text-slate-500">${summary.approved} Approved</span>
            </div>

            <!-- Approve All Eligible Button (Skipping critical) -->
            ${summary.needsReview > 0 ? `
              <button
                id="btn-bulk-approve"
                class="text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                title="Approves non-critical matching fields. Critical fields require explicit individual sign-off."
              >
                Approve Eligible
              </button>
            ` : ''}

            <!-- Publish to Output Dataset Button -->
            <button
              id="btn-publish-child"
              ${!summary.canPublish ? 'disabled' : ''}
              class="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                summary.canPublish
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }"
              title="${!summary.canPublish ? `Cannot publish: ${summary.needsReview} field(s) require review (${summary.criticalPending} critical).` : 'Publish validated records to simulated Redshift warehouse.'}"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <span>Publish to Dataset</span>
            </button>

          </div>

        </div>

        <!-- Main Split Screen -->
        <div class="flex-1 flex overflow-hidden">
          
          <!-- LEFT PANE: PDF Document Canvas (50%) -->
          <div class="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100 overflow-hidden relative" id="pdf-viewer-pane">
            ${renderPdfViewer(file, child, activePage, pageIndex, childPages.length, s.activeCellId)}
          </div>

          <!-- RIGHT PANE: Extracted Fields Review & Inspector (50%) -->
          <div class="w-1/2 flex flex-col bg-white overflow-hidden" id="fields-review-pane">
            ${renderReviewPane(child, s.reviewTab, s.activeCellId)}
          </div>

        </div>

      </div>

      <!-- Lineage Modal -->
      <div id="lineage-modal-overlay" class="hidden modal-overlay">
        <div class="modal-box p-6 max-w-lg">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <h3 class="text-sm font-bold text-slate-900">Field Lineage &amp; Audit Traceability</h3>
            <button id="btn-close-lineage" class="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <div id="lineage-modal-content"></div>
        </div>
      </div>
    `;

    wireReviewEvents(container);
  }

  // ── Left: PDF Viewer HTML ────────────────────────────────────

  function renderPdfViewer(file, child, pageNum, pageIdx, totalChildPages, activeCellId) {
    const imageSrc = `${file.assetBasePath}page-${pageNum}.png`;
    const pxWidth = Math.round(760 * zoomLevel);

    // Collect bounding boxes for this page
    const boxes = [];
    for (const comp of child.components) {
      for (const cell of comp.cells) {
        if (cell.boundingBox && cell.boundingBox.page === pageNum) {
          boxes.push({
            cellId: cell.cellId,
            label: cell.label || cell.fieldName,
            box: cell.boundingBox,
            isActive: cell.cellId === activeCellId
          });
        }
      }
    }

    const boxesHtml = boxes.map(b => {
      if (!showAllBoxes && !b.isActive) return '';
      const left = (b.box.x * 100).toFixed(2);
      const top = (b.box.y * 100).toFixed(2);
      const width = (b.box.w * 100).toFixed(2);
      const height = (b.box.h * 100).toFixed(2);

      return `
        <div
          class="bbox ${b.isActive ? 'active' : ''}"
          data-cell-id="${b.cellId}"
          style="left: ${left}%; top: ${top}%; width: ${width}%; height: ${height}%;"
          title="${esc(b.label)}"
        >
          <span class="bbox-label">${esc(b.label)}</span>
        </div>
      `;
    }).join('');

    return `
      <!-- Canvas Toolbar -->
      <div class="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs select-none z-10 flex-shrink-0">
        
        <!-- Scoped Page Nav -->
        <div class="flex items-center gap-2">
          <div class="inline-flex rounded-md border border-slate-200 bg-white">
            <button
              id="btn-prev-page"
              ${pageIdx <= 0 ? 'disabled' : ''}
              class="px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              ← Prev
            </button>
            <span class="px-2 py-1 font-mono text-[11px] text-slate-500 border-x border-slate-200">
              Page ${pageIdx + 1} of ${totalChildPages}
            </span>
            <button
              id="btn-next-page"
              ${pageIdx >= totalChildPages - 1 ? 'disabled' : ''}
              class="px-2 py-1 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              Next →
            </button>
          </div>
          <span class="text-[11px] text-slate-400 font-mono hidden sm:inline">(PDF p.${pageNum})</span>
        </div>

        <!-- Zoom & Outlines -->
        <div class="flex items-center gap-2">
          <div class="inline-flex rounded-md border border-slate-200 bg-white text-xs">
            <button id="btn-zoom-out" class="px-2 py-1 hover:bg-slate-50 font-bold">−</button>
            <span class="px-1.5 py-1 font-mono text-[11px] text-slate-600">${Math.round(zoomLevel * 100)}%</span>
            <button id="btn-zoom-in" class="px-2 py-1 hover:bg-slate-50 font-bold">+</button>
            <button id="btn-zoom-fit" class="px-2 py-1 border-l border-slate-200 text-[11px] hover:bg-slate-50">Fit</button>
          </div>

          <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 select-none ml-2 border-l border-slate-200 pl-3">
            <input type="checkbox" id="chk-show-all-boxes" ${showAllBoxes ? 'checked' : ''} class="rounded border-slate-300 text-blue-600 focus:ring-0">
            <span>Show all</span>
          </label>
        </div>

      </div>

      <!-- Scrollable Image Viewport -->
      <div id="pdf-scroll-area" class="flex-1 overflow-auto p-6 flex justify-center items-start">
        <div id="pdf-page-wrapper" class="relative shadow-md border border-slate-300/80 rounded bg-white" style="width: ${pxWidth}px; max-width: none;">
          <img src="${imageSrc}" alt="Page ${pageNum}" class="w-full h-auto block rounded" />
          <div class="absolute inset-0 pointer-events-none">
            ${boxesHtml}
          </div>
        </div>
      </div>
    `;
  }

  // ── Right: Review Pane & Inspector HTML ──────────────────────

  function renderReviewPane(child, activeTab, activeCellId) {
    const allCells = [];
    for (const comp of child.components) {
      for (const cell of comp.cells) {
        allCells.push(cell);
      }
    }

    const needsReviewCells = allCells.filter(c => c.reviewStatus === 'needs_review');
    const displayCells = activeTab === 'needs_review' ? needsReviewCells : allCells;
    const activeCell = activeCellId ? appState.getCellById(activeCellId) : (displayCells[0] || null);

    return `
      <!-- Tab Header -->
      <div class="px-6 pt-3 pb-0 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
        <div class="flex items-center gap-4">
          <button
            data-tab="needs_review"
            class="tab-btn pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'needs_review'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }"
          >
            Needs Review (${needsReviewCells.length})
          </button>
          <button
            data-tab="all"
            class="tab-btn pb-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }"
          >
            All Fields (${allCells.length})
          </button>
        </div>
        <span class="text-[11px] text-slate-400 font-mono mb-2">Click row to inspect</span>
      </div>

      <!-- Field Rows List (Scrollable, 50% max height) -->
      <div class="overflow-y-auto border-b border-slate-200" style="max-height: 42%;">
        ${displayCells.length === 0 ? `
          <div class="p-8 text-center text-xs text-slate-400">
            ✓ No fields pending review in this view.
          </div>
        ` : displayCells.map(cell => {
          const isSelected = activeCell && cell.cellId === activeCell.cellId;
          return `
            <div
              class="field-row ${isSelected ? 'active' : ''}"
              data-cell-id="${cell.cellId}"
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-slate-800 truncate">${esc(cell.label || cell.fieldName)}</span>
                  <span class="font-mono text-[10px] text-slate-400">${cell.dataType}</span>
                  ${cell.critical ? `
                    <span class="rounded bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 py-0.2 uppercase">Critical</span>
                  ` : ''}
                </div>
                <div class="font-mono text-xs font-medium text-slate-900 mt-0.5 truncate">
                  ${cell.selectedValue != null ? esc(String(cell.selectedValue)) : '<em class="text-slate-400 font-sans font-normal">null</em>'}
                </div>
              </div>

              <!-- Status badge -->
              <div class="flex-shrink-0">
                ${renderStatusPill(cell)}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Bottom Inspector Area (Focused detailed review) -->
      <div class="flex-1 overflow-y-auto p-5 bg-slate-50/70" id="selected-field-inspector">
        ${activeCell ? renderInspectorCard(activeCell) : `
          <div class="h-full flex items-center justify-center text-xs text-slate-400">
            Select a field above to inspect dual-model extractions.
          </div>
        `}
      </div>
    `;
  }

  function renderStatusPill(cell) {
    if (cell.reviewStatus === 'approved') {
      return `<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5">✓ Approved</span>`;
    }
    if (cell.reviewReason === 'mismatch') {
      return `<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">Discrepancy</span>`;
    }
    if (cell.reviewReason === 'low_confidence') {
      return `<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded px-2 py-0.5">Low Conf</span>`;
    }
    return `<span class="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded px-2 py-0.5">Review</span>`;
  }

  function renderInspectorCard(cell) {
    const extractions = cell.extractions || [];
    const modelA = extractions[0] || { modelId: 'Claude Sonnet 4.5', value: null, confidence: 0 };
    const modelB = extractions[1] || { modelId: 'OpenAI GPT-4o', value: null, confidence: 0 };
    const isMismatch = modelA.value !== modelB.value;

    return `
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        
        <!-- Inspector Title & Critical Callout -->
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900">${esc(cell.label || cell.fieldName)}</h4>
              <span class="font-mono text-[10px] text-slate-400">(${cell.fieldName})</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Source: Page ${cell.boundingBox ? cell.boundingBox.page : '1'} · Type: <span class="font-mono">${cell.dataType}</span>
            </div>
          </div>

          <button
            id="btn-open-lineage"
            data-cell-id="${cell.cellId}"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 p-1"
            title="View raw JSON & audit provenance"
          >
            <span>Audit Lineage</span> &rarr;
          </button>
        </div>

        ${cell.critical ? `
          <div class="rounded-lg bg-purple-50 border border-purple-200 p-2.5 text-xs text-purple-900 mb-3 flex items-start gap-2">
            <span class="text-purple-600 font-bold mt-0.5">🔒</span>
            <div>
              <strong>Critical Field Lock:</strong> High-liability financial field. Automated bulk approval is prohibited; explicit human verification is mandatory.
            </div>
          </div>
        ` : ''}

        <!-- Dual Model Comparison Side-by-Side -->
        <div class="grid grid-cols-2 gap-2.5 mb-3">
          
          <!-- Model A Card -->
          <div class="rounded-lg border ${modelA.value === cell.selectedValue ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-slate-50'} p-3">
            <div class="flex items-center justify-between text-[10px] mb-1">
              <span class="font-bold text-slate-700">Claude Sonnet 4.5</span>
              <span class="font-mono text-blue-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">${modelA.confidence} Conf</span>
            </div>
            <div class="font-mono text-xs font-bold text-slate-900 break-words mb-2">
              ${modelA.value !== null ? esc(String(modelA.value)) : '<em class="text-slate-400">null</em>'}
            </div>
            ${cell.reviewStatus === 'needs_review' ? `
              <button
                class="btn-accept-model w-full rounded border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 text-slate-700 text-[10px] font-semibold py-1 transition-colors"
                data-model-idx="0"
                data-cell-id="${cell.cellId}"
              >
                Accept Claude Output
              </button>
            ` : ''}
          </div>

          <!-- Model B Card -->
          <div class="rounded-lg border ${modelB.value === cell.selectedValue ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 bg-slate-50'} p-3">
            <div class="flex items-center justify-between text-[10px] mb-1">
              <span class="font-bold text-slate-700">OpenAI GPT-4o</span>
              <span class="font-mono text-emerald-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">${modelB.confidence} Conf</span>
            </div>
            <div class="font-mono text-xs font-bold text-slate-900 break-words mb-2">
              ${modelB.value !== null ? esc(String(modelB.value)) : '<em class="text-slate-400">null</em>'}
            </div>
            ${cell.reviewStatus === 'needs_review' ? `
              <button
                class="btn-accept-model w-full rounded border border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 text-slate-700 text-[10px] font-semibold py-1 transition-colors"
                data-model-idx="1"
                data-cell-id="${cell.cellId}"
              >
                Accept GPT-4o Output
              </button>
            ` : ''}
          </div>

        </div>

        <!-- Discrepancy / PM Analysis Note -->
        ${cell.discrepancyNote ? `
          <div class="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 mb-3">
            <strong>PM Root Cause Analysis:</strong> ${esc(cell.discrepancyNote)}
          </div>
        ` : ''}

        <!-- Manual Override Form & Approve Button -->
        <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1">
            <span class="text-xs text-slate-400 font-medium">Value:</span>
            <input
              id="manual-edit-input"
              type="text"
              value="${cell.selectedValue != null ? esc(String(cell.selectedValue)) : ''}"
              class="w-full rounded border border-slate-300 px-2 py-1 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 outline-none"
              placeholder="Enter override value"
            />
            <button
              id="btn-apply-manual-edit"
              data-cell-id="${cell.cellId}"
              class="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
            >
              Apply
            </button>
          </div>

          <div class="flex items-center gap-2">
            ${cell.reviewStatus === 'needs_review' ? `
              <button
                id="btn-approve-single-cell"
                data-cell-id="${cell.cellId}"
                class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-2xs transition-colors"
              >
                Approve Field ✓
              </button>
            ` : `
              <button
                id="btn-reflag-cell"
                data-cell-id="${cell.cellId}"
                class="border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Re-flag
              </button>
            `}
          </div>
        </div>

      </div>
    `;
  }

  // ── Event Wiring ─────────────────────────────────────────────

  function wireReviewEvents(container) {
    // Child selector
    container.querySelectorAll('.btn-select-child').forEach(btn => {
      btn.onclick = () => {
        const cId = btn.getAttribute('data-child-id');
        appState.selectChild(cId);
        render(container);
      };
    });

    // Scoped Page Navigation
    const btnPrev = container.querySelector('#btn-prev-page');
    const btnNext = container.querySelector('#btn-next-page');
    if (btnPrev) btnPrev.onclick = () => { appState.prevPage(); render(container); };
    if (btnNext) btnNext.onclick = () => { appState.nextPage(); render(container); };

    // Zoom Controls
    const btnZoomIn = container.querySelector('#btn-zoom-in');
    const btnZoomOut = container.querySelector('#btn-zoom-out');
    const btnZoomFit = container.querySelector('#btn-zoom-fit');
    const chkShowAll = container.querySelector('#chk-show-all-boxes');

    if (btnZoomIn) btnZoomIn.onclick = () => { zoomLevel = Math.min(2.0, zoomLevel + 0.15); render(container); };
    if (btnZoomOut) btnZoomOut.onclick = () => { zoomLevel = Math.max(0.6, zoomLevel - 0.15); render(container); };
    if (btnZoomFit) btnZoomFit.onclick = () => { zoomLevel = 1.0; render(container); };
    if (chkShowAll) chkShowAll.onchange = (e) => { showAllBoxes = e.target.checked; render(container); };

    // Bounding Box Clicks on Canvas
    container.querySelectorAll('.bbox').forEach(box => {
      box.onclick = (e) => {
        e.stopPropagation();
        const cellId = box.getAttribute('data-cell-id');
        appState.setActiveCell(cellId);
        render(container);
      };
    });

    // Tab buttons
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute('data-tab');
        appState.s().reviewTab = tab;
        render(container);
      };
    });

    // Row selection
    container.querySelectorAll('.field-row').forEach(row => {
      row.onclick = () => {
        const cellId = row.getAttribute('data-cell-id');
        appState.setActiveCell(cellId);
        render(container);
      };
    });

    // Accept Model A or B
    container.querySelectorAll('.btn-accept-model').forEach(btn => {
      btn.onclick = () => {
        const cellId = btn.getAttribute('data-cell-id');
        const modelIdx = parseInt(btn.getAttribute('data-model-idx'), 10);
        appState.acceptModel(cellId, modelIdx);
        render(container);
        showToast('Model output accepted and field approved.', 'success');
      };
    });

    // Approve single field
    const btnApproveSingle = container.querySelector('#btn-approve-single-cell');
    if (btnApproveSingle) {
      btnApproveSingle.onclick = () => {
        const cellId = btnApproveSingle.getAttribute('data-cell-id');
        appState.approveCell(cellId);
        render(container);
        showToast('Field approved with human signature.', 'success');
      };
    }

    // Reflag field
    const btnReflag = container.querySelector('#btn-reflag-cell');
    if (btnReflag) {
      btnReflag.onclick = () => {
        const cellId = btnReflag.getAttribute('data-cell-id');
        appState.flagCell(cellId);
        render(container);
      };
    }

    // Manual edit
    const btnManual = container.querySelector('#btn-apply-manual-edit');
    const inputManual = container.querySelector('#manual-edit-input');
    if (btnManual && inputManual) {
      const applyEdit = () => {
        const cellId = btnManual.getAttribute('data-cell-id');
        const val = inputManual.value.trim();
        appState.editCellValue(cellId, val || null);
        render(container);
        showToast('Manual correction saved and field approved.', 'success');
      };

      btnManual.onclick = applyEdit;
      inputManual.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyEdit();
        }
      };
    }

    // Bulk approve non-critical
    const btnBulk = container.querySelector('#btn-bulk-approve');
    if (btnBulk) {
      btnBulk.onclick = () => {
        const res = appState.approveAllEligible();
        render(container);
        if (res.skipped > 0) {
          showToast(`Approved ${res.approved} eligible fields. ${res.skipped} critical field(s) require individual review.`, 'info', 3500);
        } else {
          showToast(`Approved all ${res.approved} remaining fields.`, 'success');
        }
      };
    }

    // Publish child to dataset
    const btnPublish = container.querySelector('#btn-publish-child');
    if (btnPublish && !btnPublish.disabled) {
      btnPublish.onclick = () => {
        const res = appState.publishCurrentChild();
        if (res.success) {
          showToast('Document published to simulated Redshift warehouse.', 'success');
          setTimeout(() => router.go(7), 400);
        } else {
          showToast(res.reason, 'error');
        }
      };
    }

    // Lineage Modal
    const btnLineage = container.querySelector('#btn-open-lineage');
    if (btnLineage) {
      btnLineage.onclick = () => {
        const cellId = btnLineage.getAttribute('data-cell-id');
        const cell = appState.getCellById(cellId);
        if (!cell) return;

        const modalOverlay = container.querySelector('#lineage-modal-overlay');
        const modalContent = container.querySelector('#lineage-modal-content');

        modalContent.innerHTML = `
          <div class="space-y-3 text-xs">
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div class="text-[10px] text-slate-400 uppercase font-semibold">Field</div>
              <div class="font-bold text-slate-900">${esc(cell.label)} (${cell.fieldName})</div>
              <div class="font-mono text-blue-700 font-bold mt-1">Value: ${cell.selectedValue != null ? esc(String(cell.selectedValue)) : 'null'}</div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div class="p-2 border rounded bg-white"><strong>Reviewer:</strong> ${cell.lineage ? cell.lineage.reviewerId || 'Auto' : 'Auto'}</div>
              <div class="p-2 border rounded bg-white"><strong>Timestamp:</strong> ${cell.lineage ? (cell.lineage.reviewedAt ? new Date(cell.lineage.reviewedAt).toLocaleTimeString() : 'Pending') : 'Pending'}</div>
            </div>

            <div>
              <div class="text-[10px] text-slate-400 uppercase font-semibold mb-1">Raw JSON Payload</div>
              <pre class="bg-slate-900 text-slate-200 p-2.5 rounded font-mono text-[10px] max-h-36 overflow-auto">${esc(JSON.stringify(cell, null, 2))}</pre>
            </div>
          </div>
        `;

        modalOverlay.classList.remove('hidden');

        const btnClose = container.querySelector('#btn-close-lineage');
        if (btnClose) btnClose.onclick = () => modalOverlay.classList.add('hidden');
        modalOverlay.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.classList.add('hidden'); };
      };
    }
  }

  router.register(6, render);

})();
