/**
 * ConsensusIDP Document Canvas Viewer
 * Handles high-resolution page rendering, bounding box overlays, and bidirectional spatial interaction.
 * Preserves scroll and zoom position across state changes and constrains navigation to the active child document.
 */

class DocumentViewer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentZoom = 1.0;
    this.showAllBoxes = false; // Default: clean view, only show active/focused box
    this.renderedFileId = null;
    this.renderedPageNum = null;
    this.renderedChildId = null;
    this.lastActiveCellId = null;

    this.init();
  }

  init() {
    window.demoState.subscribe((state) => {
      this.render(state);
    });
  }

  setZoom(delta) {
    this.currentZoom = Math.max(0.6, Math.min(2.0, Math.round((this.currentZoom + delta) * 100) / 100));
    this.applyZoom();
  }

  resetZoom() {
    this.currentZoom = 1.0;
    this.applyZoom();
  }

  applyZoom() {
    const wrapper = this.container.querySelector("#docPageWrapper");
    if (wrapper) {
      const pxWidth = Math.round(780 * this.currentZoom);
      wrapper.style.width = `${pxWidth}px`;
    }
    const zoomLabel = this.container.querySelector("#zoomIndicator");
    if (zoomLabel) {
      zoomLabel.textContent = `${Math.round(this.currentZoom * 100)}%`;
    }
  }

  render(state) {
    const file = state.getCurrentFile();
    const child = state.getCurrentChild();
    if (!file || !child) {
      this.container.innerHTML = `<div class="flex h-full items-center justify-center text-sm text-slate-400">No document selected.</div>`;
      this.renderedFileId = null;
      this.renderedPageNum = null;
      return;
    }

    const pages = state.getChildPages();
    const pageIdx = state.getChildPageIndex();
    const pageNum = pages[pageIdx] || state.currentPageNum || 1;
    const totalChildPages = pages.length;

    // Check if DOM is already rendered for this exact page
    const isSamePage =
      this.renderedFileId === file.fileId &&
      this.renderedChildId === child.childId &&
      this.renderedPageNum === pageNum &&
      this.container.querySelector("#docScrollContainer");

    if (isSamePage) {
      // Just update active bounding boxes and toolbar states without re-creating DOM
      this.updateActiveBox(state);
      this.updateToolbar(state, pageIdx, totalChildPages, pageNum);
      return;
    }

    // Full render required (page or child changed)
    this.renderedFileId = file.fileId;
    this.renderedChildId = child.childId;
    this.renderedPageNum = pageNum;
    this.lastActiveCellId = state.activeCellId;

    const imageSrc = `${file.assetBasePath}page-${pageNum}.png`;

    // Collect bounding boxes for this page belonging to the active child
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
      // Only render if showAllBoxes is true OR if this box is currently active
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

    const pxWidth = Math.round(780 * this.currentZoom);

    this.container.innerHTML = `
      <!-- Center Toolbar -->
      <div class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 select-none z-10 flex-shrink-0 shadow-xs">
        <div class="flex items-center gap-2 truncate mr-2">
          <span class="font-semibold text-slate-800 truncate">${child.childDisplayName}</span>
          <span class="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 whitespace-nowrap">
            Page ${pageIdx + 1} of ${totalChildPages} · PDF p.${pageNum}
          </span>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- Constrained Child Page Navigation -->
          <div class="inline-flex rounded-md shadow-2xs border border-slate-200 bg-white p-0.5">
            <button id="btnPrevPage" class="rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" ${pageIdx <= 0 ? "disabled" : ""} title="Previous page in document">
              ← Prev
            </button>
            <span class="px-2 py-1 text-xs font-mono text-slate-500">${pageIdx + 1}/${totalChildPages}</span>
            <button id="btnNextPage" class="rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" ${pageIdx >= totalChildPages - 1 ? "disabled" : ""} title="Next page in document">
              Next →
            </button>
          </div>

          <div class="h-4 w-px bg-slate-200 mx-0.5"></div>

          <!-- Clean Zoom Controls (no CSS transform clipping) -->
          <div class="inline-flex items-center rounded-md border border-slate-200 bg-white text-xs">
            <button id="btnZoomOut" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold transition-colors" title="Zoom out">−</button>
            <span id="zoomIndicator" class="px-1.5 font-mono text-[11px] text-slate-600">${Math.round(this.currentZoom * 100)}%</span>
            <button id="btnZoomIn" class="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold transition-colors" title="Zoom in">+</button>
            <button id="btnZoomReset" class="px-2 py-1 border-l border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors">Fit</button>
          </div>

          <!-- Outline Toggle -->
          <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-500 hover:text-slate-700 select-none ml-1 pl-2 border-l border-slate-200" title="Display all detected bounding boxes simultaneously">
            <input type="checkbox" id="chkShowAllBoxes" ${this.showAllBoxes ? "checked" : ""} class="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer">
            <span class="hidden sm:inline">Show all</span>
          </label>
        </div>
      </div>

      <!-- Canvas Scroll Area -->
      <div id="docScrollContainer" class="relative flex-1 overflow-auto bg-slate-100/90 p-4 sm:p-6 flex justify-center items-start">
        <div id="docPageWrapper" class="relative shadow-lg border border-slate-200/80 rounded bg-white transition-[width] duration-150 ease-out origin-top" style="width: ${pxWidth}px; max-width: none;">
          <img src="${imageSrc}" alt="Page ${pageNum}" class="w-full h-auto block rounded" />
          <div id="boxesContainer" class="absolute inset-0 pointer-events-none">
            ${boxesHtml}
          </div>
        </div>
      </div>
    `;

    // Wire events
    this.wireEvents(state);

    // Auto-scroll active box into view
    this.scrollToActiveBox();
  }

  wireEvents(state) {
    const prevBtn = this.container.querySelector("#btnPrevPage");
    const nextBtn = this.container.querySelector("#btnNextPage");
    const zoomInBtn = this.container.querySelector("#btnZoomIn");
    const zoomOutBtn = this.container.querySelector("#btnZoomOut");
    const zoomResetBtn = this.container.querySelector("#btnZoomReset");
    const chkShowAll = this.container.querySelector("#chkShowAllBoxes");

    if (prevBtn) prevBtn.onclick = () => state.prevChildPage();
    if (nextBtn) nextBtn.onclick = () => state.nextChildPage();
    if (zoomInBtn) zoomInBtn.onclick = () => this.setZoom(0.15);
    if (zoomOutBtn) zoomOutBtn.onclick = () => this.setZoom(-0.15);
    if (zoomResetBtn) zoomResetBtn.onclick = () => this.resetZoom();

    if (chkShowAll) {
      chkShowAll.onchange = (e) => {
        this.showAllBoxes = e.target.checked;
        this.renderedFileId = null; // force re-render of boxes
        this.render(state);
      };
    }

    this.wireBoxClicks(state);
  }

  wireBoxClicks(state) {
    const boxEls = this.container.querySelectorAll(".bounding-box-highlight");
    boxEls.forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const cellId = el.getAttribute("data-cell-id");
        state.setActiveCell(cellId);
      };
    });
  }

  updateActiveBox(state) {
    const boxesContainer = this.container.querySelector("#boxesContainer");
    if (!boxesContainer) return;

    const child = state.getCurrentChild();
    if (!child) return;

    const pageNum = this.renderedPageNum;
    const activeCellId = state.activeCellId;

    if (!this.showAllBoxes) {
      // Re-populate boxes container with ONLY the active box for this page
      const cell = state.getCellById(activeCellId);
      if (cell && cell.boundingBox && cell.boundingBox.page === pageNum) {
        const leftPct = (cell.boundingBox.x * 100).toFixed(2);
        const topPct = (cell.boundingBox.y * 100).toFixed(2);
        const widthPct = (cell.boundingBox.w * 100).toFixed(2);
        const heightPct = (cell.boundingBox.h * 100).toFixed(2);
        const label = cell.label || cell.fieldName;

        boxesContainer.innerHTML = `
          <div class="bounding-box-highlight active" 
               data-cell-id="${cell.cellId}"
               style="left: ${leftPct}%; top: ${topPct}%; width: ${widthPct}%; height: ${heightPct}%;"
               title="${label}">
            <span class="bounding-box-label">${label}</span>
          </div>
        `;
        this.wireBoxClicks(state);
      } else {
        boxesContainer.innerHTML = "";
      }
    } else {
      // Toggle active class on existing boxes
      const boxEls = boxesContainer.querySelectorAll(".bounding-box-highlight");
      boxEls.forEach((el) => {
        const cId = el.getAttribute("data-cell-id");
        if (cId === activeCellId) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    }

    if (this.lastActiveCellId !== activeCellId) {
      this.lastActiveCellId = activeCellId;
      this.scrollToActiveBox();
    }
  }

  updateToolbar(state, pageIdx, totalChildPages, pageNum) {
    const prevBtn = this.container.querySelector("#btnPrevPage");
    const nextBtn = this.container.querySelector("#btnNextPage");
    if (prevBtn) prevBtn.disabled = pageIdx <= 0;
    if (nextBtn) nextBtn.disabled = pageIdx >= totalChildPages - 1;
  }

  scrollToActiveBox() {
    const activeEl = this.container.querySelector(".bounding-box-highlight.active");
    if (activeEl) {
      setTimeout(() => {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }, 40);
    }
  }
}

window.DocumentViewer = DocumentViewer;
