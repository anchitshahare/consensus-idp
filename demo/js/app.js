/**
 * ConsensusIDP Main Web Application Controller
 * Handles application lifecycle, UI event binding, sidebar navigation, and warehouse dataset rendering.
 */

document.addEventListener("DOMContentLoaded", () => {
  const viewerContainer = document.getElementById("documentViewerPane");
  const viewer = new window.DocumentViewer(viewerContainer);

  const elements = {
    scenarioSelector: document.getElementById("scenarioSelector"),
    scenarioCategory: document.getElementById("scenarioCategory"),
    scenarioDesc: document.getElementById("scenarioDesc"),
    parentFileList: document.getElementById("parentFileList"),
    reviewGrid: document.getElementById("reviewGridPane"),
    warehouseView: document.getElementById("warehouseViewPane"),
    btnReviewMode: document.getElementById("btnReviewMode"),
    btnWarehouseMode: document.getElementById("btnWarehouseMode"),
    btnApproveAll: document.getElementById("btnApproveAll"),
    btnPublish: document.getElementById("btnPublish"),
    btnResetState: document.getElementById("btnResetState"),
    filterChips: document.querySelectorAll("[data-filter-reason]"),
    // Metric cards
    kpiNeedsReview: document.getElementById("kpiNeedsReview"),
    kpiApproved: document.getElementById("kpiApproved"),
    kpiPublished: document.getElementById("kpiPublished"),
    kpiDiscrepancies: document.getElementById("kpiDiscrepancies"),
    // Lineage modal close
    btnCloseLineageModal: document.getElementById("btnCloseLineageModal"),
    btnModalCloseOverlay: document.getElementById("btnModalCloseOverlay"),
  };

  // Populate Scenario Dropdown
  const scenarios = window.demoState.getScenarios();
  elements.scenarioSelector.innerHTML = scenarios
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join("");

  elements.scenarioSelector.onchange = (e) => {
    window.demoState.setScenario(e.target.value);
  };

  // Wire Top Tab Navigation (Review Queue vs. Warehouse Dataset)
  elements.btnReviewMode.onclick = () => window.demoState.setViewMode("review");
  elements.btnWarehouseMode.onclick = () => window.demoState.setViewMode("warehouse");

  // Wire Filter Chips
  elements.filterChips.forEach((chip) => {
    chip.onclick = () => {
      elements.filterChips.forEach((c) => c.classList.remove("bg-blue-50", "text-blue-700", "border-blue-300"));
      chip.classList.add("bg-blue-50", "text-blue-700", "border-blue-300");
      window.demoState.setFilterReason(chip.getAttribute("data-filter-reason"));
    };
  });

  // Wire Global Actions
  elements.btnApproveAll.onclick = () => {
    const child = window.demoState.getCurrentChild();
    if (!child) return;
    if (confirm(`Auto-approve all remaining unreviewed fields in "${child.childDisplayName}"? This accepts model-recommended defaults.`)) {
      window.demoState.approveAllInChild(child.childId);
    }
  };

  elements.btnPublish.onclick = () => {
    const child = window.demoState.getCurrentChild();
    if (!child) return;

    // Check if there are still unresolved items
    const hasUnresolved = child.components.some((c) =>
      c.cells.some((cell) => cell.reviewStatus === "needs_review")
    );

    if (hasUnresolved) {
      if (!confirm(`Warning: Some critical or discrepant fields still require review in "${child.childDisplayName}". Do you wish to publish approved fields anyway?`)) {
        return;
      }
    }

    elements.btnPublish.disabled = true;
    elements.btnPublish.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
      Publishing to Redshift…
    `;

    setTimeout(() => {
      window.demoState.publishChild(child.childId);
      elements.btnPublish.disabled = false;
      elements.btnPublish.textContent = "Publish to Warehouse";
      // Auto-switch to warehouse view to show published result
      window.demoState.setViewMode("warehouse");
    }, 600);
  };

  elements.btnResetState.onclick = () => {
    if (confirm("Reset demo data to initial recorded extraction state? All edits and approvals will be restored to default.")) {
      window.demoState.reset();
    }
  };

  if (elements.btnCloseLineageModal) elements.btnCloseLineageModal.onclick = window.closeLineageModal;
  if (elements.btnModalCloseOverlay) elements.btnModalCloseOverlay.onclick = window.closeLineageModal;

  // React to State Changes
  window.demoState.subscribe((state) => {
    updateUI(state);
  });

  // Initial Render
  updateUI(window.demoState);

  function updateUI(state) {
    const sc = state.getCurrentScenario();
    const file = state.getCurrentFile();
    const child = state.getCurrentChild();
    const metrics = state.getMetrics();

    // 1. Update Scenario Meta & KPIs
    if (elements.scenarioSelector) elements.scenarioSelector.value = sc.id;
    if (elements.scenarioCategory) elements.scenarioCategory.textContent = sc.category;
    if (elements.scenarioDesc) elements.scenarioDesc.textContent = sc.description;

    if (elements.kpiNeedsReview) elements.kpiNeedsReview.textContent = metrics.needsReviewCount;
    if (elements.kpiApproved) elements.kpiApproved.textContent = metrics.approvedCount;
    if (elements.kpiPublished) elements.kpiPublished.textContent = metrics.publishedCount;
    if (elements.kpiDiscrepancies) elements.kpiDiscrepancies.textContent = metrics.discrepanciesCount;

    // 2. View Mode Tabs Toggle
    if (state.currentViewMode === "warehouse") {
      elements.reviewGrid.classList.add("hidden");
      elements.warehouseView.classList.remove("hidden");
      elements.btnReviewMode.classList.remove("bg-white", "text-blue-600", "shadow-sm");
      elements.btnReviewMode.classList.add("text-slate-500");
      elements.btnWarehouseMode.classList.add("bg-white", "text-blue-600", "shadow-sm");
      elements.btnWarehouseMode.classList.remove("text-slate-500");
      renderWarehouseView(state);
    } else {
      elements.reviewGrid.classList.remove("hidden");
      elements.warehouseView.classList.add("hidden");
      elements.btnWarehouseMode.classList.remove("bg-white", "text-blue-600", "shadow-sm");
      elements.btnWarehouseMode.classList.add("text-slate-500");
      elements.btnReviewMode.classList.add("bg-white", "text-blue-600", "shadow-sm");
      elements.btnReviewMode.classList.remove("text-slate-500");
    }

    // 3. Render Document & Child Backlog (Sidebar)
    renderSidebarList(state);

    // 4. Render Right Review Grid
    renderReviewGrid(state);
  }

  function renderSidebarList(state) {
    const sc = state.getCurrentScenario();
    if (!sc) return;

    let html = "";
    for (const f of sc.files) {
      const isSelectedFile = f.fileId === state.currentFileId;

      html += `
        <div class="mb-3 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="flex items-center justify-between p-2.5 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
               onclick="window.demoState.selectFile('${f.fileId}')">
            <div class="flex items-center gap-2 overflow-hidden">
              <svg class="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              <span class="text-xs font-semibold text-slate-800 truncate" title="${f.fileName}">${f.fileName}</span>
            </div>
            <span class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${f.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${f.status === 'approved' ? 'Clean' : 'Needs Review'}
            </span>
          </div>

          <div class="divide-y divide-slate-100">
            ${f.children.map((c) => {
              const isSelectedChild = c.childId === state.currentChildId;
              const hasFlagged = c.components.some(comp => comp.cells.some(cell => cell.reviewStatus === 'needs_review'));

              return `
                <div class="p-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${isSelectedChild ? 'bg-blue-50/70 border-l-4 border-blue-600 font-semibold text-blue-900' : 'hover:bg-slate-50 text-slate-700'}"
                     onclick="window.demoState.selectChild('${c.childId}')">
                  <div class="truncate mr-2">
                    <div class="truncate">${c.childDisplayName}</div>
                    <div class="text-[10px] font-normal text-slate-400">Pages ${c.pages.join(', ')} · ${c.publishStatus === 'published' ? 'Published' : 'Unpublished'}</div>
                  </div>
                  <span class="rounded-full w-2 h-2 flex-shrink-0 ${hasFlagged ? 'bg-amber-500' : 'bg-emerald-500'}" title="${hasFlagged ? 'Review Pending' : 'Approved'}"></span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    elements.parentFileList.innerHTML = html;
  }

  function renderReviewGrid(state) {
    const child = state.getCurrentChild();
    if (!child) {
      elements.reviewGrid.innerHTML = `<div class="p-8 text-center text-sm text-slate-400">Select a document from the left backlog.</div>`;
      return;
    }

    const filterReason = state.filterReason;
    let componentsHtml = "";

    for (const comp of child.components) {
      // Filter cells based on user's active filter
      const filteredCells = comp.cells.filter((cell) => {
        if (filterReason === "all") return true;
        if (filterReason === "discrepancies") return cell.reviewReason === "mismatch";
        if (filterReason === "low_confidence") return cell.reviewReason === "low_confidence";
        if (filterReason === "critical") return cell.critical === true;
        if (filterReason === "missing") return cell.reviewReason === "missing";
        return true;
      });

      if (filteredCells.length === 0) continue;

      let cellsHtml = "";
      for (const cell of filteredCells) {
        const isActive = cell.cellId === state.activeCellId;
        const activeClass = isActive ? "cell-row-active" : "";

        cellsHtml += `
          <div class="border-b border-slate-100 p-3 hover:bg-slate-50/80 transition-colors ${activeClass}" 
               data-cell-id="${cell.cellId}"
               onclick="window.demoState.setActiveCell('${cell.cellId}')">
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-800">${cell.label || cell.fieldName}</span>
                <span class="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] text-slate-500">${cell.dataType}</span>
              </div>
              <div class="flex items-center gap-2">
                ${window.renderStatusBadge(cell)}
                <button class="text-slate-400 hover:text-blue-600 transition-colors p-1" title="View Field Lineage & Audit Provenance"
                        onclick="event.stopPropagation(); window.openLineageModal(window.demoState.getCellById('${cell.cellId}'))">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
              </div>
            </div>

            <!-- Current Value & Inline Editing -->
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 mr-3">
                <span class="text-[11px] font-semibold text-slate-400">Resolved:</span>
                <div class="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded shadow-inner flex-1 max-w-sm truncate"
                     title="Double click to edit directly"
                     ondblclick="startInlineEdit(this, '${cell.cellId}')">
                  ${cell.selectedValue != null ? window.escapeHtml(String(cell.selectedValue)) : '<em class="text-slate-400 font-normal">null (not found)</em>'}
                </div>
              </div>

              <!-- Quick action button -->
              <div class="flex items-center gap-1.5 flex-shrink-0">
                ${cell.reviewStatus === 'needs_review' ? `
                  <button class="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                          onclick="event.stopPropagation(); window.demoState.approveCell('${cell.cellId}')">
                    Approve
                  </button>
                ` : `
                  <button class="rounded border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-100"
                          onclick="event.stopPropagation(); window.demoState.flagCell('${cell.cellId}')">
                    Re-flag
                  </button>
                `}
              </div>
            </div>

            <!-- Multi-Model Consensus Inspector -->
            ${window.renderConsensusInspector(cell)}
          </div>
        `;
      }

      componentsHtml += `
        <div class="mb-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">${comp.name}</h3>
              <p class="text-[10px] text-slate-500">${comp.description || ''}</p>
            </div>
            <span class="text-[11px] font-mono font-medium text-slate-400">${comp.cells.length} fields</span>
          </div>
          <div>
            ${cellsHtml}
          </div>
        </div>
      `;
    }

    if (!componentsHtml) {
      componentsHtml = `
        <div class="rounded-xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-400">
          No fields match the active filter ("${filterReason}").
          <button class="mt-2 block mx-auto text-xs font-semibold text-blue-600 hover:underline" onclick="window.demoState.setFilterReason('all')">Clear filter</button>
        </div>
      `;
    }

    elements.reviewGrid.innerHTML = `
      <div class="mb-4 flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 class="text-sm font-bold text-slate-900">${child.childDisplayName}</h2>
          <span class="text-[11px] text-slate-500">Document Review Queue · Source PDF Pages: ${child.pages.join(', ')}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                  onclick="window.demoState.approveAllInChild('${child.childId}')">
            Approve All in Document
          </button>
        </div>
      </div>
      ${componentsHtml}
    `;
  }

  function renderWarehouseView(state) {
    const sc = state.getCurrentScenario();
    const rows = [];

    // Collect all child files and flatten approved/resolved fields into warehouse records
    for (const f of sc.files) {
      for (const child of f.children) {
        const rowData = {
          _source_file: f.fileName,
          _child_doc: child.childDisplayName,
          _publish_status: child.publishStatus.toUpperCase(),
          _published_on: f.lastPublishedOn || "PENDING",
        };

        for (const comp of child.components) {
          for (const cell of comp.cells) {
            rowData[cell.fieldName] = cell.selectedValue;
          }
        }
        rows.push(rowData);
      }
    }

    const columns = rows.length ? Object.keys(rows[0]) : [];

    elements.warehouseView.innerHTML = `
      <div class="p-6">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm0 5c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3"></path></svg>
              Curated Data Warehouse Table Preview (Amazon Redshift / Snowflake)
            </h2>
            <p class="text-xs text-slate-500">Live sync from validated IDP extraction. Maintains field-level lineage provenance and CDC versioning.</p>
          </div>
          <span class="rounded bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 text-xs font-mono font-semibold">
            Table: curated_${sc.id.replace(/-/g, '_')}_dataset
          </span>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
                ${columns.map((c) => `<th class="px-3 py-2.5 whitespace-nowrap">${c}</th>`).join('')}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${rows.map((row) => `
                <tr class="hover:bg-slate-50 transition-colors">
                  ${columns.map((col) => {
                    const val = row[col];
                    const isSystemCol = col.startsWith('_');
                    return `
                      <td class="px-3 py-2.5 whitespace-nowrap font-mono text-[11px] ${isSystemCol ? 'font-bold text-indigo-900 bg-slate-50/50' : 'text-slate-700'}">
                        ${val != null ? window.escapeHtml(String(val)) : '<span class="text-slate-300 font-normal">NULL</span>'}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
});

// Inline Editing helper
function startInlineEdit(el, cellId) {
  const currentVal = el.textContent.trim();
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentVal === "null (not found)" ? "" : currentVal;
  input.className = "w-full rounded border border-blue-500 px-1 py-0.5 font-mono text-xs focus:outline-none shadow-sm";

  el.innerHTML = "";
  el.appendChild(input);
  input.focus();

  const finish = () => {
    const newVal = input.value.trim();
    window.demoState.updateCellValue(cellId, newVal || null, "HUMAN_INLINE_EDIT");
  };

  input.onblur = finish;
  input.onkeydown = (e) => {
    if (e.key === "Enter") finish();
    if (e.key === "Escape") window.demoState.notify();
  };
}
