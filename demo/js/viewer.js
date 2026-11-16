/**
 * ConsensusIDP Document Canvas Viewer
 * Handles high-resolution page rendering, bounding box overlays, and bidirectional spatial interaction.
 */

class DocumentViewer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentZoom = 1.0;
    this.showAllBoxes = false; // Default: clean view, only show active/focused box
    this.init();
  }

  init() {
    window.demoState.subscribe((state) => {
      this.render(state);
    });
  }

  setZoom(delta) {
    this.currentZoom = Math.max(0.6, Math.min(2.0, this.currentZoom + delta));
    const wrapper = this.container.querySelector("#docPageWrapper");
    if (wrapper) {
      wrapper.style.transform = `scale(${this.currentZoom})`;
      wrapper.style.transformOrigin = "top center";
    }
    const zoomLabel = document.getElementById("zoomIndicator");
    if (zoomLabel) zoomLabel.textContent = `${Math.round(this.currentZoom * 100)}%`;
  }

  resetZoom() {
    this.currentZoom = 1.0;
    const wrapper = this.container.querySelector("#docPageWrapper");
    if (wrapper) {
      wrapper.style.transform = "scale(1)";
    }
    const zoomLabel = document.getElementById("zoomIndicator");
    if (zoomLabel) zoomLabel.textContent = "100%";
  }

  render(state) {
    const file = state.getCurrentFile();
    const child = state.getCurrentChild();
    if (!file || !child) {
      this.container.innerHTML = `<div class="flex h-full items-center justify-center text-sm text-slate-400">No document selected.</div>`;
      return;
    }

    const pageNum = state.currentPageNum;
    const totalPages = file.pageCount || 1;
    const imageSrc = `${file.assetBasePath}page-${pageNum}.png`;

    // Collect all bounding boxes belonging to this page across all components in the active child
    const pageBoxes = [];
    for (const comp of child.components) {
      for (const cell of comp.cells) {
        if (cell.boundingBox && cell.boundingBox.page === pageNum) {
          pageBoxes.push({
            cellId: cell.cellId,
            label: cell.label || cell.fieldName,
            box: cell.boundingBox,
            isActive: cell.cellId === state.activeCellId,
            reviewReason: cell.reviewReason,
            critical: cell.critical,
          });
        }
      }
    }

    let boxesHtml = "";
    for (const b of pageBoxes) {
      // If showAllBoxes is false, only render the active bounding box
      if (!this.showAllBoxes && !b.isActive) continue;

      const activeClass = b.isActive ? "active" : "";
      const leftPct = (b.box.x * 100).toFixed(2);
      const topPct = (b.box.y * 100).toFixed(2);
      const widthPct = (b.box.w * 100).toFixed(2);
      const heightPct = (b.box.h * 100).toFixed(2);

      boxesHtml += `
        <div class="bounding-box-highlight ${activeClass}" 
             data-cell-id="${b.cellId}"
             style="left: ${leftPct}%; top: ${topPct}%; width: ${widthPct}%; height: ${heightPct}%;"
             title="${b.label}">
          <span class="bounding-box-label">${b.label}</span>
        </div>
      `;
    }

    this.container.innerHTML = `
      <!-- Toolbar -->
      <div class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 select-none z-10 flex-shrink-0">
        <div class="flex items-center gap-2">
          <span class="font-medium text-slate-800">${file.fileName}</span>
          <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">Page ${pageNum} of ${totalPages}</span>
        </div>

        <div class="flex items-center gap-2">
          <button id="btnPrevPage" class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 disabled:opacity-40 font-medium" ${pageNum <= 1 ? "disabled" : ""}>
            ← Prev
          </button>
          <span class="text-[11px] font-medium text-slate-500">${pageNum} / ${totalPages}</span>
          <button id="btnNextPage" class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 disabled:opacity-40 font-medium" ${pageNum >= totalPages ? "disabled" : ""}>
            Next →
          </button>
          <div class="mx-1 h-4 w-px bg-slate-200"></div>
          <button id="btnZoomOut" class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 font-mono text-xs font-semibold" title="Zoom Out">−</button>
          <span id="zoomIndicator" class="font-mono text-[11px] text-slate-500">${Math.round(this.currentZoom * 100)}%</span>
          <button id="btnZoomIn" class="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 font-mono text-xs font-semibold" title="Zoom In">+</button>
          <button id="btnZoomReset" class="rounded border border-slate-200 px-2 py-1 text-[11px] hover:bg-slate-50 font-medium">Fit</button>

          <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-500 hover:text-slate-800 select-none ml-2 border-l border-slate-200 pl-3">
            <input type="checkbox" id="chkShowAllBoxes" ${this.showAllBoxes ? "checked" : ""} class="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer">
            <span>Show all outlines</span>
          </label>
        </div>
      </div>

      <!-- Canvas Scroll Area -->
      <div id="docScrollContainer" class="relative flex-1 overflow-auto bg-slate-100 p-6 flex justify-center items-start">
        <div id="docPageWrapper" class="relative shadow-2xl transition-transform duration-150 ease-out origin-top" style="max-width: 820px; width: 100%; transform: scale(${this.currentZoom});">
          <img src="${imageSrc}" alt="Page ${pageNum}" class="w-full h-auto block rounded border border-slate-300 bg-white" />
          <div class="absolute inset-0 pointer-events-none">
            ${boxesHtml}
          </div>
        </div>
      </div>
    `;

    // Wire pagination and zoom handlers
    const prevBtn = this.container.querySelector("#btnPrevPage");
    const nextBtn = this.container.querySelector("#btnNextPage");
    const zoomInBtn = this.container.querySelector("#btnZoomIn");
    const zoomOutBtn = this.container.querySelector("#btnZoomOut");
    const zoomResetBtn = this.container.querySelector("#btnZoomReset");
    const chkShowAll = this.container.querySelector("#chkShowAllBoxes");

    if (prevBtn) prevBtn.onclick = () => state.setPageNum(Math.max(1, pageNum - 1));
    if (nextBtn) nextBtn.onclick = () => state.setPageNum(Math.min(totalPages, pageNum + 1));
    if (zoomInBtn) zoomInBtn.onclick = () => this.setZoom(0.15);
    if (zoomOutBtn) zoomOutBtn.onclick = () => this.setZoom(-0.15);
    if (zoomResetBtn) zoomResetBtn.onclick = () => this.resetZoom();
    if (chkShowAll) {
      chkShowAll.onchange = (e) => {
        this.showAllBoxes = e.target.checked;
        this.render(state);
      };
    }

    // Wire click events on bounding boxes to select cell in review grid
    const boxEls = this.container.querySelectorAll(".bounding-box-highlight");
    boxEls.forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const cellId = el.getAttribute("data-cell-id");
        state.setActiveCell(cellId);
      };
    });

    // Auto-scroll to active box if present
    const activeEl = this.container.querySelector(".bounding-box-highlight.active");
    if (activeEl) {
      setTimeout(() => {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }, 50);
    }
  }
}

window.DocumentViewer = DocumentViewer;
