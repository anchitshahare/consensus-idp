/**
 * ConsensusIDP Demo State Store
 * Manages reactive in-memory state with graceful localStorage fallback and strict business validation rules.
 */

class DemoStateStore {
  constructor() {
    this.listeners = [];
    this.storageKey = "consensus_idp_demo_state_v2";
    this.data = null;
    this.currentScenarioId = "lakeside-inn";
    this.currentFileId = null;
    this.currentChildId = null;
    this.activeCellId = null;
    this.currentViewMode = "review"; // "review" | "warehouse"
    this.currentTab = "needs_review"; // "needs_review" | "all"
    this.currentPageNum = 1;

    this.init();
  }

  init() {
    const rawInitial = window.DEMO_DATA || { scenarios: [] };
    // Try restoring from localStorage if available and valid
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.scenarios) && parsed.scenarios.length > 0) {
          this.data = parsed;
        } else {
          this.data = JSON.parse(JSON.stringify(rawInitial));
        }
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

    // Default active cell to first review item if present
    this.selectFirstActionableCell();
  }

  selectFirstActionableCell() {
    const child = this.getCurrentChild();
    if (!child) return;

    for (const comp of child.components) {
      for (const cell of comp.cells) {
        if (cell.reviewStatus === "needs_review") {
          this.activeCellId = cell.cellId;
          if (cell.boundingBox && cell.boundingBox.page) {
            this.currentPageNum = cell.boundingBox.page;
          }
          return;
        }
      }
    }

    // Fallback to first cell if none need review
    if (child.components[0] && child.components[0].cells[0]) {
      this.activeCellId = child.components[0].cells[0].cellId;
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
    this.currentTab = "needs_review";

    const sc = this.getCurrentScenario();
    if (sc && sc.files && sc.files.length) {
      this.currentFileId = sc.files[0].fileId;
      if (sc.files[0].children && sc.files[0].children.length) {
        this.currentChildId = sc.files[0].children[0].childId;
        this.currentPageNum = sc.files[0].children[0].pages[0] || 1;
      }
    }

    this.selectFirstActionableCell();
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
      try {
        fn(this);
      } catch (err) {
        console.error("State listener error:", err);
      }
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
    this.selectFirstActionableCell();
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
    this.selectFirstActionableCell();
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
    this.selectFirstActionableCell();
    this.notify();
  }

  // Restrict page navigation to pages belonging to this child document!
  getChildPages() {
    const child = this.getCurrentChild();
    return (child && child.pages && child.pages.length) ? child.pages : [1];
  }

  getChildPageIndex() {
    const pages = this.getChildPages();
    const idx = pages.indexOf(this.currentPageNum);
    return idx >= 0 ? idx : 0;
  }

  setChildPageIndex(index) {
    const pages = this.getChildPages();
    const clamped = Math.max(0, Math.min(pages.length - 1, index));
    this.currentPageNum = pages[clamped];
    this.notify();
  }

  prevChildPage() {
    const idx = this.getChildPageIndex();
    if (idx > 0) {
      this.setChildPageIndex(idx - 1);
    }
  }

  nextChildPage() {
    const idx = this.getChildPageIndex();
    const pages = this.getChildPages();
    if (idx < pages.length - 1) {
      this.setChildPageIndex(idx + 1);
    }
  }

  setActiveCell(cellId) {
    this.activeCellId = cellId;
    // Auto-switch document page if cell belongs to a different page within the child
    const cell = this.getCellById(cellId);
    if (cell && cell.boundingBox && cell.boundingBox.page) {
      const childPages = this.getChildPages();
      if (childPages.includes(cell.boundingBox.page)) {
        this.currentPageNum = cell.boundingBox.page;
      }
    }
    this.notify();
  }

  setTab(tabName) {
    if (this.currentTab === tabName) return;
    this.currentTab = tabName;
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
    if (!cell.lineage) {
      cell.lineage = {};
    }
    cell.lineage.reviewerId = actionSource;
    cell.lineage.reviewedAt = new Date().toISOString();
    cell.lineage.humanOverride = true;

    this.recalculateStatuses();
    this.save();
  }

  approveCell(cellId) {
    const cell = this.getCellById(cellId);
    if (!cell) return;

    cell.reviewStatus = "approved";
    if (!cell.lineage) {
      cell.lineage = {};
    }
    cell.lineage.reviewerId = "HUMAN_REVIEWER";
    cell.lineage.reviewedAt = new Date().toISOString();

    this.recalculateStatuses();
    this.save();
  }

  flagCell(cellId) {
    const cell = this.getCellById(cellId);
    if (!cell) return;

    cell.reviewStatus = "needs_review";
    if (!cell.reviewReason) cell.reviewReason = "mismatch";
    this.recalculateStatuses();
    this.save();
  }

  // Critical fields MUST NEVER be automatically approved through bulk approval!
  approveAllInChild(childId) {
    const child = this.getCurrentChild();
    if (!child || child.childId !== childId) {
      return { approvedCount: 0, skippedCriticalCount: 0 };
    }

    let approvedCount = 0;
    let skippedCriticalCount = 0;

    for (const comp of child.components) {
      for (const cell of comp.cells) {
        if (cell.reviewStatus === "needs_review") {
          if (cell.critical) {
            // CRITICAL FIELDS REQUIRE EXPLICIT INDIVIDUAL HUMAN REVIEW
            skippedCriticalCount++;
            continue;
          }
          cell.reviewStatus = "approved";
          if (!cell.lineage) cell.lineage = {};
          cell.lineage.reviewerId = "HUMAN_BULK_APPROVE_ELIGIBLE";
          cell.lineage.reviewedAt = new Date().toISOString();
          approvedCount++;
        }
      }
    }

    this.recalculateStatuses();
    this.save();

    return { approvedCount, skippedCriticalCount };
  }

  // Publishing must NOT mark a document as published while mandatory review items remain!
  publishChild(childId) {
    const child = this.getCurrentChild();
    if (!child || child.childId !== childId) {
      return { success: false, reason: "Document not found." };
    }

    const unresolvedCells = [];
    for (const comp of child.components) {
      for (const cell of comp.cells) {
        if (cell.reviewStatus === "needs_review") {
          unresolvedCells.push(cell);
        }
      }
    }

    if (unresolvedCells.length > 0) {
      const criticalCount = unresolvedCells.filter((c) => c.critical).length;
      return {
        success: false,
        reason: `Cannot publish: ${unresolvedCells.length} field(s) require review (${criticalCount} critical).`,
        unresolvedCount: unresolvedCells.length,
        criticalCount,
      };
    }

    child.publishStatus = "published";
    const f = this.getCurrentFile();
    if (f) {
      f.lastPublishedOn = new Date().toISOString();
    }

    this.recalculateStatuses();
    this.save();

    return { success: true };
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

  // Helpers for current child document status
  getCurrentChildSummary() {
    const child = this.getCurrentChild();
    if (!child) return { total: 0, needsReview: 0, criticalNeedsReview: 0, approved: 0, isReadyToPublish: false };

    let total = 0;
    let needsReview = 0;
    let criticalNeedsReview = 0;
    let approved = 0;

    for (const comp of child.components) {
      for (const cell of comp.cells) {
        total++;
        if (cell.reviewStatus === "needs_review") {
          needsReview++;
          if (cell.critical) criticalNeedsReview++;
        } else {
          approved++;
        }
      }
    }

    return {
      total,
      needsReview,
      criticalNeedsReview,
      approved,
      isReadyToPublish: needsReview === 0,
      isPublished: child.publishStatus === "published",
    };
  }
}

window.demoState = new DemoStateStore();
