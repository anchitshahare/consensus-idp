/**
 * ConsensusIDP Demo State Store
 * Manages reactive in-memory state with graceful localStorage fallback.
 */

class DemoStateStore {
  constructor() {
    this.listeners = [];
    this.storageKey = "consensus_idp_demo_state_v1";
    this.data = null;
    this.currentScenarioId = "lakeside-inn";
    this.currentFileId = null;
    this.currentChildId = null;
    this.activeCellId = null;
    this.currentViewMode = "review"; // "review" | "warehouse"
    this.filterReason = "all"; // "all" | "discrepancies" | "low_confidence" | "critical" | "missing"
    this.currentPageNum = 1;

    this.init();
  }

  init() {
    const rawInitial = window.DEMO_DATA || { scenarios: [] };
    // Try restoring from localStorage if available and valid
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.data = JSON.parse(JSON.stringify(rawInitial));
      }
    } catch (e) {
      // In private browsing or restricted environments, use in-memory clone
      this.data = JSON.parse(JSON.stringify(rawInitial));
    }

    // Set default scenario and file selection
    const sc = this.getCurrentScenario();
    if (sc && sc.files && sc.files.length) {
      this.currentFileId = sc.files[0].fileId;
      if (sc.files[0].children && sc.files[0].children.length) {
        this.currentChildId = sc.files[0].children[0].childId;
        this.currentPageNum = sc.files[0].children[0].pages[0] || 1;
      }
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      // Ignore localStorage write failure in restricted browsing contexts
    }
    this.notify();
  }

  reset() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
    const rawInitial = window.DEMO_DATA || { scenarios: [] };
    this.data = JSON.parse(JSON.stringify(rawInitial));
    this.activeCellId = null;
    this.currentViewMode = "review";
    this.filterReason = "all";
    const sc = this.getCurrentScenario();
    if (sc && sc.files && sc.files.length) {
      this.currentFileId = sc.files[0].fileId;
      if (sc.files[0].children && sc.files[0].children.length) {
        this.currentChildId = sc.files[0].children[0].childId;
        this.currentPageNum = sc.files[0].children[0].pages[0] || 1;
      }
    }
    this.notify();
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  notify() {
    for (const fn of this.listeners) {
      fn(this);
    }
  }

  // --- Scenario & Navigation Getters / Setters ---

  getScenarios() {
    return this.data.scenarios || [];
  }

  getCurrentScenario() {
    return this.getScenarios().find((s) => s.id === this.currentScenarioId) || this.getScenarios()[0];
  }

  setScenario(scenarioId) {
    if (this.currentScenarioId === scenarioId) return;
    this.currentScenarioId = scenarioId;
    const sc = this.getCurrentScenario();
    if (sc && sc.files && sc.files.length) {
      this.currentFileId = sc.files[0].fileId;
      if (sc.files[0].children && sc.files[0].children.length) {
        this.currentChildId = sc.files[0].children[0].childId;
        this.currentPageNum = sc.files[0].children[0].pages[0] || 1;
      } else {
        this.currentChildId = null;
        this.currentPageNum = 1;
      }
    }
    this.activeCellId = null;
    this.notify();
  }

  getCurrentFile() {
    const sc = this.getCurrentScenario();
    return (sc && sc.files.find((f) => f.fileId === this.currentFileId)) || (sc && sc.files[0]) || null;
  }

  selectFile(fileId) {
    this.currentFileId = fileId;
    const f = this.getCurrentFile();
    if (f && f.children && f.children.length) {
      this.currentChildId = f.children[0].childId;
      this.currentPageNum = f.children[0].pages[0] || 1;
    }
    this.activeCellId = null;
    this.notify();
  }

  getCurrentChild() {
    const f = this.getCurrentFile();
    if (!f || !f.children) return null;
    return f.children.find((c) => c.childId === this.currentChildId) || f.children[0] || null;
  }

  selectChild(childId) {
    this.currentChildId = childId;
    const c = this.getCurrentChild();
    if (c && c.pages && c.pages.length) {
      this.currentPageNum = c.pages[0];
    }
    this.activeCellId = null;
    this.notify();
  }

  setPageNum(page) {
    this.currentPageNum = page;
    this.notify();
  }

  setActiveCell(cellId) {
    this.activeCellId = cellId;
    // Auto-switch document page if cell belongs to a different page
    const cell = this.getCellById(cellId);
    if (cell && cell.boundingBox && cell.boundingBox.page) {
      this.currentPageNum = cell.boundingBox.page;
    }
    this.notify();
  }

  setFilterReason(reason) {
    this.filterReason = reason;
    this.notify();
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    this.notify();
  }

  // --- Cell & Approval Operations ---

  getCellById(cellId) {
    const sc = this.getCurrentScenario();
    if (!sc) return null;
    for (const f of sc.files) {
      for (const child of f.children) {
        for (const comp of child.components) {
          for (const cell of comp.cells) {
            if (cell.cellId === cellId) return cell;
          }
        }
      }
    }
    return null;
  }

  updateCellValue(cellId, newValue, actionSource = "HUMAN_REVIEWER") {
    const cell = this.getCellById(cellId);
    if (!cell) return;

    cell.selectedValue = newValue;
    cell.reviewStatus = "approved";
    if (cell.lineage) {
      cell.lineage.reviewerId = actionSource;
      cell.lineage.reviewedAt = new Date().toISOString();
      cell.lineage.humanOverride = true;
    }

    this.recalculateStatuses();
    this.save();
  }

  approveCell(cellId) {
    const cell = this.getCellById(cellId);
    if (!cell) return;

    cell.reviewStatus = "approved";
    if (cell.lineage) {
      cell.lineage.reviewerId = "HUMAN_REVIEWER";
      cell.lineage.reviewedAt = new Date().toISOString();
    }

    this.recalculateStatuses();
    this.save();
  }

  flagCell(cellId) {
    const cell = this.getCellById(cellId);
    if (!cell) return;

    cell.reviewStatus = "needs_review";
    cell.reviewReason = "mismatch";
    this.recalculateStatuses();
    this.save();
  }

  approveAllInChild(childId) {
    const child = this.getCurrentChild();
    if (!child || child.childId !== childId) return;

    for (const comp of child.components) {
      for (const cell of comp.cells) {
        cell.reviewStatus = "approved";
        if (cell.lineage) {
          cell.lineage.reviewerId = cell.lineage.reviewerId || "HUMAN_BULK_APPROVE";
          cell.lineage.reviewedAt = new Date().toISOString();
        }
      }
    }

    this.recalculateStatuses();
    this.save();
  }

  publishChild(childId) {
    const child = this.getCurrentChild();
    if (!child || child.childId !== childId) return;

    child.publishStatus = "published";
    const f = this.getCurrentFile();
    if (f) {
      f.lastPublishedOn = new Date().toISOString();
    }

    this.recalculateStatuses();
    this.save();
  }

  recalculateStatuses() {
    const sc = this.getCurrentScenario();
    if (!sc) return;

    for (const f of sc.files) {
      let allChildrenPublished = true;
      let anyChildNeedsReview = false;

      for (const c of f.children) {
        let childNeedsReview = false;
        for (const comp of c.components) {
          for (const cell of comp.cells) {
            if (cell.reviewStatus === "needs_review") {
              childNeedsReview = true;
              anyChildNeedsReview = true;
            }
          }
        }
        c.status = childNeedsReview ? "needs_review" : "approved";
        if (c.publishStatus !== "published") {
          allChildrenPublished = false;
        }
      }

      f.status = anyChildNeedsReview ? "needs_review" : "approved";
      f.publishStatus = allChildrenPublished ? "published" : "partially_published";
    }
  }

  getMetrics() {
    const sc = this.getCurrentScenario();
    let totalCells = 0;
    let needsReviewCount = 0;
    let approvedCount = 0;
    let publishedCount = 0;
    let discrepanciesCount = 0;
    let lowConfidenceCount = 0;
    let criticalCount = 0;

    if (sc) {
      for (const f of sc.files) {
        for (const c of f.children) {
          if (c.publishStatus === "published") publishedCount++;
          for (const comp of c.components) {
            for (const cell of comp.cells) {
              totalCells++;
              if (cell.reviewStatus === "needs_review") needsReviewCount++;
              if (cell.reviewStatus === "approved") approvedCount++;
              if (cell.reviewReason === "mismatch") discrepanciesCount++;
              if (cell.reviewReason === "low_confidence") lowConfidenceCount++;
              if (cell.critical) criticalCount++;
            }
          }
        }
      }
    }

    return {
      totalCells,
      needsReviewCount,
      approvedCount,
      publishedCount,
      discrepanciesCount,
      lowConfidenceCount,
      criticalCount,
    };
  }
}

window.demoState = new DemoStateStore();
