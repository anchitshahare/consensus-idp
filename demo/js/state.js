/**
 * ConsensusIDP — Global Application State
 * Manages all screen and workflow state across the multi-page demo.
 * Stored in localStorage for persistence across page refreshes.
 */

(function () {
  const STORAGE_KEY = 'cidp_demo_v3';

  const DEFAULT_STATE = {
    // Navigation
    currentScreen: 1,
    unlockedScreens: [1],

    // Screen 1 — Workspace
    workspace: null,
    // { name: string, createdAt: string }

    // Screen 2 — Schema (pre-filled, user just reviews)
    schema: {
      name: 'Hotel Folio Schema',
      fields: [
        { id: 'f1', name: 'guest_name',      label: 'Guest Name',          type: 'VARCHAR',   required: true,  description: 'Full name of the primary guest' },
        { id: 'f2', name: 'folio_number',    label: 'Folio Number',        type: 'VARCHAR',   required: true,  description: 'Unique folio reference identifier' },
        { id: 'f3', name: 'hotel_name',      label: 'Hotel Name',          type: 'VARCHAR',   required: true,  description: 'Name of the property' },
        { id: 'f4', name: 'check_in_date',   label: 'Check-in Date',       type: 'DATE',      required: true,  description: 'Guest check-in date (ISO 8601)' },
        { id: 'f5', name: 'check_out_date',  label: 'Check-out Date',      type: 'DATE',      required: true,  description: 'Guest check-out date (ISO 8601)' },
        { id: 'f6', name: 'room_number',     label: 'Room Number',         type: 'VARCHAR',   required: true,  description: 'Assigned room number at time of stay' },
        { id: 'f7', name: 'room_type',       label: 'Room Type',           type: 'VARCHAR',   required: false, description: 'Room category (e.g. Deluxe King)' },
        { id: 'f8', name: 'total_amount',    label: 'Total Amount (USD)',  type: 'DECIMAL',   required: true,  description: 'Total folio balance due' },
        { id: 'f9', name: 'currency',        label: 'Currency',            type: 'VARCHAR',   required: false, description: 'Billing currency code' },
        { id: 'f10', name: 'tax_id',         label: 'Tax ID',              type: 'VARCHAR',   required: false, description: 'Hotel tax registration number' },
      ]
    },

    // Screen 3 — Workflow
    workflow: {
      name: 'Folio Extraction Pipeline',
      splitRules: [
        { id: 'sr1', childName: 'Guest Folio A', startPage: 1, endPage: 2 },
        { id: 'sr2', childName: 'Guest Folio B', startPage: 3, endPage: 3 },
      ],
      modelA: 'claude-sonnet-4-5',
      modelB: 'gpt-4o',
      consensusThreshold: 0.85,
      autoApprove: true,
    },

    // Screen 4 — Upload
    uploadedFile: null,
    // Will be set to the lakeside inn sample file info on screen 4

    // Screen 5 — Run
    runComplete: false,

    // Screen 6 — HITL
    // Uses mockData.js for field data; tracks review state separately
    activeChildId: null,
    activeCellId: null,
    currentPageNum: 1,
    showAllBoxes: false,
    reviewTab: 'needs_review', // 'needs_review' | 'all'
    // Field review state is managed in reviewState (derived from mockData)
    reviewState: null, // initialized on first visit to screen 6

    // Screen 7 — Dataset
    // Derived from reviewState
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      const parsed = JSON.parse(saved);
      // Validate minimal shape
      if (typeof parsed.currentScreen !== 'number' || parsed.currentScreen < 1 || parsed.currentScreen > 7) {
        throw new Error('invalid screen number');
      }
      if (!Array.isArray(parsed.unlockedScreens) || parsed.unlockedScreens.length === 0) {
        parsed.unlockedScreens = [1];
      }
      if (!parsed.schema || !Array.isArray(parsed.schema.fields)) {
        parsed.schema = DEFAULT_STATE.schema;
      }
      if (!parsed.workflow || !Array.isArray(parsed.workflow.splitRules)) {
        parsed.workflow = DEFAULT_STATE.workflow;
      }
      return parsed;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function saveState(s) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) { /* private browsing */ }
  }

  // ── State Store ──────────────────────────────────────────────

  const store = {
    _state: loadState(),
    _listeners: [],

    get() { return this._state; },

    set(updates) {
      Object.assign(this._state, updates);
      saveState(this._state);
      this._notify();
    },

    // Convenience getter
    s() { return this._state; },

    subscribe(fn) {
      this._listeners.push(fn);
      return () => { this._listeners = this._listeners.filter(l => l !== fn); };
    },

    _notify() {
      this._listeners.forEach(fn => { try { fn(this._state); } catch(e) { console.error(e); } });
    },

    // ── Navigation ──────────────────────────────────────────────

    navigateTo(screen) {
      const s = this._state;
      if (!s.unlockedScreens.includes(screen)) return;
      s.currentScreen = screen;
      saveState(s);
      this._notify();
    },

    unlock(screen) {
      const s = this._state;
      if (!s.unlockedScreens.includes(screen)) {
        s.unlockedScreens.push(screen);
        saveState(s);
      }
    },

    // ── Workspace ───────────────────────────────────────────────

    createWorkspace(name) {
      const trimmed = (name || '').trim();
      if (!trimmed) return false;
      this._state.workspace = { name: trimmed, createdAt: new Date().toISOString() };
      this.unlock(2);
      saveState(this._state);
      this._notify();
      return true;
    },

    // ── Schema ──────────────────────────────────────────────────

    updateSchemaField(id, updates) {
      const s = this._state;
      const field = s.schema.fields.find(f => f.id === id);
      if (!field) return;
      Object.assign(field, updates);
      saveState(s);
      this._notify();
    },

    addSchemaField() {
      const s = this._state;
      const newId = 'f' + Date.now();
      s.schema.fields.push({ id: newId, name: '', label: 'New Field', type: 'VARCHAR', required: false, description: '' });
      saveState(s);
      this._notify();
      return newId;
    },

    removeSchemaField(id) {
      const s = this._state;
      s.schema.fields = s.schema.fields.filter(f => f.id !== id);
      saveState(s);
      this._notify();
    },

    confirmSchema() {
      this.unlock(3);
      this._notify();
    },

    // ── Workflow ────────────────────────────────────────────────

    updateWorkflow(updates) {
      Object.assign(this._state.workflow, updates);
      saveState(this._state);
      this._notify();
    },

    confirmWorkflow() {
      this.unlock(4);
      this._notify();
    },

    // ── Upload ──────────────────────────────────────────────────

    setUploadedFile(fileInfo) {
      this._state.uploadedFile = fileInfo;
      this.unlock(5);
      saveState(this._state);
      this._notify();
    },

    // ── Run ─────────────────────────────────────────────────────

    completeRun() {
      this._state.runComplete = true;
      this.unlock(6);
      this.unlock(7);
      saveState(this._state);
      this._notify();
    },

    // ── Review State (HITL) ─────────────────────────────────────

    initReviewState() {
      if (this._state.reviewState) return; // already initialized
      // Deep-clone from DEMO_DATA (mockData.js)
      if (!window.DEMO_DATA) { console.error('DEMO_DATA not loaded'); return; }
      const scenario = window.DEMO_DATA.scenarios.find(s => s.id === 'lakeside-inn');
      if (!scenario) return;

      const reviewState = {
        scenarioId: 'lakeside-inn',
        files: JSON.parse(JSON.stringify(scenario.files)),
      };

      this._state.reviewState = reviewState;

      // Set defaults
      const firstFile = reviewState.files[0];
      if (firstFile && firstFile.children && firstFile.children.length) {
        this._state.activeChildId = firstFile.children[0].childId;
        this._state.currentPageNum = firstFile.children[0].pages[0] || 1;
        // Auto-select first needs_review cell
        this._setFirstActiveCell(firstFile.children[0]);
      }

      saveState(this._state);
    },

    _setFirstActiveCell(child) {
      for (const comp of (child.components || [])) {
        for (const cell of (comp.cells || [])) {
          if (cell.reviewStatus === 'needs_review') {
            this._state.activeCellId = cell.cellId;
            if (cell.boundingBox && cell.boundingBox.page) {
              this._state.currentPageNum = cell.boundingBox.page;
            }
            return;
          }
        }
      }
      // fallback: first cell
      if (child.components[0] && child.components[0].cells[0]) {
        this._state.activeCellId = child.components[0].cells[0].cellId;
      }
    },

    getCurrentReviewFile() {
      const s = this._state;
      if (!s.reviewState) return null;
      return s.reviewState.files[0] || null;
    },

    getCurrentChild() {
      const s = this._state;
      const file = this.getCurrentReviewFile();
      if (!file) return null;
      return file.children.find(c => c.childId === s.activeChildId) || file.children[0] || null;
    },

    selectChild(childId) {
      const s = this._state;
      s.activeChildId = childId;
      const child = this.getCurrentChild();
      if (child && child.pages && child.pages.length) {
        s.currentPageNum = child.pages[0];
      }
      s.activeCellId = null;
      this._setFirstActiveCell(child);
      saveState(s);
      this._notify();
    },

    getChildPages() {
      const child = this.getCurrentChild();
      return (child && child.pages && child.pages.length) ? child.pages : [1];
    },

    prevPage() {
      const pages = this.getChildPages();
      const idx = pages.indexOf(this._state.currentPageNum);
      if (idx > 0) { this._state.currentPageNum = pages[idx - 1]; saveState(this._state); this._notify(); }
    },

    nextPage() {
      const pages = this.getChildPages();
      const idx = pages.indexOf(this._state.currentPageNum);
      if (idx < pages.length - 1) { this._state.currentPageNum = pages[idx + 1]; saveState(this._state); this._notify(); }
    },

    setActiveCell(cellId) {
      const s = this._state;
      s.activeCellId = cellId;
      const cell = this.getCellById(cellId);
      if (cell && cell.boundingBox && cell.boundingBox.page) {
        const pages = this.getChildPages();
        if (pages.includes(cell.boundingBox.page)) s.currentPageNum = cell.boundingBox.page;
      }
      saveState(s);
      this._notify();
    },

    getCellById(cellId) {
      const s = this._state;
      if (!s.reviewState) return null;
      for (const f of s.reviewState.files) {
        for (const child of f.children) {
          for (const comp of child.components) {
            for (const cell of comp.cells) {
              if (cell.cellId === cellId) return cell;
            }
          }
        }
      }
      return null;
    },

    approveCell(cellId) {
      const cell = this.getCellById(cellId);
      if (!cell) return;
      cell.reviewStatus = 'approved';
      if (!cell.lineage) cell.lineage = {};
      cell.lineage.reviewerId = 'HUMAN_REVIEWER';
      cell.lineage.reviewedAt = new Date().toISOString();
      this._recalc();
      saveState(this._state);
      // Auto-advance active cell to next needs_review
      this._advanceActiveCell();
      this._notify();
    },

    acceptModel(cellId, modelIndex) {
      const cell = this.getCellById(cellId);
      if (!cell || !cell.extractions || !cell.extractions[modelIndex]) return;
      cell.selectedValue = cell.extractions[modelIndex].value;
      cell.lineage = cell.lineage || {};
      cell.lineage.reviewerId = cell.extractions[modelIndex].modelId;
      cell.lineage.reviewedAt = new Date().toISOString();
      cell.lineage.humanOverride = false;
      cell.reviewStatus = 'approved';
      this._recalc();
      saveState(this._state);
      this._advanceActiveCell();
      this._notify();
    },

    editCellValue(cellId, newValue) {
      const cell = this.getCellById(cellId);
      if (!cell) return;
      cell.selectedValue = newValue;
      cell.reviewStatus = 'approved';
      cell.lineage = cell.lineage || {};
      cell.lineage.reviewerId = 'HUMAN_MANUAL_EDIT';
      cell.lineage.reviewedAt = new Date().toISOString();
      cell.lineage.humanOverride = true;
      this._recalc();
      saveState(this._state);
      this._advanceActiveCell();
      this._notify();
    },

    flagCell(cellId) {
      const cell = this.getCellById(cellId);
      if (!cell) return;
      cell.reviewStatus = 'needs_review';
      this._recalc();
      saveState(this._state);
      this._notify();
    },

    // Approve all non-critical needs_review cells in the current child
    approveAllEligible() {
      const child = this.getCurrentChild();
      if (!child) return { approved: 0, skipped: 0 };
      let approved = 0, skipped = 0;
      for (const comp of child.components) {
        for (const cell of comp.cells) {
          if (cell.reviewStatus === 'needs_review') {
            if (cell.critical) { skipped++; continue; }
            cell.reviewStatus = 'approved';
            cell.lineage = cell.lineage || {};
            cell.lineage.reviewerId = 'HUMAN_BULK_APPROVE';
            cell.lineage.reviewedAt = new Date().toISOString();
            approved++;
          }
        }
      }
      this._recalc();
      saveState(this._state);
      this._notify();
      return { approved, skipped };
    },

    getChildSummary() {
      const child = this.getCurrentChild();
      if (!child) return { total: 0, needsReview: 0, criticalPending: 0, approved: 0, canPublish: false, isPublished: false };
      let total = 0, needsReview = 0, criticalPending = 0, approved = 0;
      for (const comp of child.components) {
        for (const cell of comp.cells) {
          total++;
          if (cell.reviewStatus === 'needs_review') { needsReview++; if (cell.critical) criticalPending++; }
          else approved++;
        }
      }
      return {
        total, needsReview, criticalPending, approved,
        canPublish: needsReview === 0,
        isPublished: child.publishStatus === 'published',
      };
    },

    publishCurrentChild() {
      const child = this.getCurrentChild();
      if (!child) return { success: false, reason: 'No document selected.' };
      const summary = this.getChildSummary();
      if (!summary.canPublish) {
        return { success: false, reason: `${summary.needsReview} field(s) still need review (${summary.criticalPending} critical).` };
      }
      child.publishStatus = 'published';
      const file = this.getCurrentReviewFile();
      if (file) file.lastPublishedOn = new Date().toISOString();
      this._recalc();
      saveState(this._state);
      this._notify();
      return { success: true };
    },

    getScenarioMetrics() {
      const s = this._state;
      if (!s.reviewState) return { total: 0, needsReview: 0, autoApproved: 0, humanApproved: 0, published: 0 };
      let total = 0, needsReview = 0, autoApproved = 0, humanApproved = 0, published = 0;
      for (const f of s.reviewState.files) {
        for (const child of f.children) {
          if (child.publishStatus === 'published') published++;
          for (const comp of child.components) {
            for (const cell of comp.cells) {
              total++;
              if (cell.reviewStatus === 'needs_review') needsReview++;
              else if (cell.reviewStatus === 'approved') {
                if (cell.lineage && cell.lineage.reviewerId && cell.lineage.reviewerId !== 'AUTO_CONSENSUS') humanApproved++;
                else autoApproved++;
              }
            }
          }
        }
      }
      return { total, needsReview, autoApproved, humanApproved, published };
    },

    _advanceActiveCell() {
      const child = this.getCurrentChild();
      if (!child) return;
      const s = this._state;
      // Find next needs_review cell
      let found = false;
      for (const comp of child.components) {
        for (const cell of comp.cells) {
          if (cell.reviewStatus === 'needs_review') {
            s.activeCellId = cell.cellId;
            if (cell.boundingBox && cell.boundingBox.page) {
              const pages = this.getChildPages();
              if (pages.includes(cell.boundingBox.page)) s.currentPageNum = cell.boundingBox.page;
            }
            found = true;
            return;
          }
        }
      }
      if (!found) s.activeCellId = null;
    },

    _recalc() {
      const s = this._state;
      if (!s.reviewState) return;
      for (const f of s.reviewState.files) {
        for (const child of f.children) {
          const hasNeedsReview = child.components.some(c => c.cells.some(cell => cell.reviewStatus === 'needs_review'));
          child.status = hasNeedsReview ? 'needs_review' : 'approved';
        }
      }
    },

    // ── Full Reset ───────────────────────────────────────────────

    fullReset() {
      try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
      this._state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this._notify();
    },
  };

  window.appState = store;
})();
