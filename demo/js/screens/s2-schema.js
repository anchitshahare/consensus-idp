/**
 * ConsensusIDP — Screen 2: Schema Builder
 * Pre-filled extraction schema with inline field editing and live JSON preview.
 */

(function () {

  function render(container) {
    const s = appState.s();
    const schema = s.schema;

    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-6 py-8">
        
        <!-- Header & Breadcrumb -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>${esc(s.workspace ? s.workspace.name : 'Workspace')}</span>
              <span>/</span>
              <span class="text-slate-600">Schema Definition</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Document Extraction Schema</h1>
            <p class="text-xs text-slate-500 mt-0.5">Pre-configured target attributes for hotel guest folios and settlement charges.</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              id="btn-add-field"
              class="inline-flex items-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-2xs"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Field
            </button>
            <button
              id="btn-continue-schema"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Continue to Workflow
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Two Column Workspace: Field Table & JSON Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left: Schema Table (8 cols) -->
          <div class="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div class="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <input
                  id="schema-name-input"
                  type="text"
                  value="${esc(schema.name)}"
                  class="font-semibold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded outline-none transition"
                  title="Click to rename schema"
                />
              </div>
              <span class="text-xs font-mono text-slate-400" id="field-count-badge">${schema.fields.length} attributes</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th class="py-2.5 px-4 w-1/4">Field Key</th>
                    <th class="py-2.5 px-4 w-1/4">Display Label</th>
                    <th class="py-2.5 px-3 w-28">Type</th>
                    <th class="py-2.5 px-3 w-20 text-center">Required</th>
                    <th class="py-2.5 px-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody id="schema-fields-tbody" class="divide-y divide-slate-100">
                  ${renderFieldRows(schema.fields)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right: Live JSON Schema Preview (4 cols) -->
          <div class="lg:col-span-4 bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800 flex flex-col h-[560px]">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 flex-shrink-0">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span class="text-xs font-mono font-medium text-slate-300">schema.json preview</span>
              </div>
              <span class="text-[10px] font-mono text-slate-500">Read-only target</span>
            </div>
            <pre id="json-preview" class="flex-1 overflow-auto font-mono text-[11px] text-slate-300 leading-relaxed pr-1 select-all"></pre>
          </div>

        </div>

      </div>
    `;

    updateJsonPreview();
    wireEvents(container);
  }

  function renderFieldRows(fields) {
    if (!fields || fields.length === 0) {
      return `<tr><td colspan="5" class="p-8 text-center text-slate-400">No fields defined yet.</td></tr>`;
    }

    return fields.map((f) => `
      <tr class="hover:bg-slate-50/70 transition-colors group" data-field-id="${f.id}">
        <!-- Key -->
        <td class="py-2.5 px-4">
          <input
            type="text"
            data-key="name"
            value="${esc(f.name)}"
            class="field-input w-full font-mono text-xs text-blue-700 bg-transparent border-b border-transparent focus:border-blue-400 focus:bg-white px-1 py-0.5 rounded outline-none"
            placeholder="field_key"
          />
        </td>

        <!-- Label -->
        <td class="py-2.5 px-4">
          <input
            type="text"
            data-key="label"
            value="${esc(f.label)}"
            class="field-input w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-blue-400 focus:bg-white px-1 py-0.5 rounded outline-none"
            placeholder="Field Label"
          />
        </td>

        <!-- Type -->
        <td class="py-2.5 px-3">
          <select data-key="type" class="field-select rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-mono text-slate-700 focus:border-blue-500 outline-none">
            <option value="VARCHAR" ${f.type === 'VARCHAR' ? 'selected' : ''}>VARCHAR</option>
            <option value="DECIMAL" ${f.type === 'DECIMAL' ? 'selected' : ''}>DECIMAL</option>
            <option value="DATE" ${f.type === 'DATE' ? 'selected' : ''}>DATE</option>
            <option value="INTEGER" ${f.type === 'INTEGER' ? 'selected' : ''}>INTEGER</option>
          </select>
        </td>

        <!-- Required -->
        <td class="py-2.5 px-3 text-center">
          <input
            type="checkbox"
            data-key="required"
            ${f.required ? 'checked' : ''}
            class="field-checkbox rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
          />
        </td>

        <!-- Remove -->
        <td class="py-2.5 px-3 text-center">
          <button
            data-action="delete"
            class="text-slate-300 hover:text-rose-600 transition-colors p-1"
            title="Delete attribute"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function updateJsonPreview() {
    const s = appState.s();
    const previewEl = document.getElementById('json-preview');
    if (!previewEl) return;

    const payload = {
      schema_name: s.schema.name,
      target_entity: "hospitality_guest_folio",
      fields: s.schema.fields.map(f => ({
        key: f.name,
        display_label: f.label,
        type: f.type,
        required: f.required
      }))
    };

    previewEl.textContent = JSON.stringify(payload, null, 2);
  }

  function wireEvents(container) {
    const schemaNameInput = container.querySelector('#schema-name-input');
    if (schemaNameInput) {
      schemaNameInput.onchange = (e) => {
        appState.s().schema.name = e.target.value.trim() || 'Untitled Schema';
        updateJsonPreview();
      };
    }

    const tbody = container.querySelector('#schema-fields-tbody');
    if (tbody) {
      // Delegate input changes
      tbody.addEventListener('change', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const fieldId = tr.getAttribute('data-field-id');
        const key = e.target.getAttribute('data-key');
        if (!key) return;

        let val = e.target.value;
        if (e.target.type === 'checkbox') val = e.target.checked;

        appState.updateSchemaField(fieldId, { [key]: val });
        updateJsonPreview();
      });

      // Delegate delete
      tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="delete"]');
        if (!btn) return;
        const tr = btn.closest('tr');
        if (!tr) return;
        const fieldId = tr.getAttribute('data-field-id');
        appState.removeSchemaField(fieldId);
        tr.remove();
        updateJsonPreview();
        const badge = container.querySelector('#field-count-badge');
        if (badge) badge.textContent = `${appState.s().schema.fields.length} attributes`;
      });
    }

    // Add field
    const btnAdd = container.querySelector('#btn-add-field');
    if (btnAdd) {
      btnAdd.onclick = () => {
        appState.addSchemaField();
        render(container);
        showToast('New field added to schema.', 'info');
      };
    }

    // Continue
    const btnContinue = container.querySelector('#btn-continue-schema');
    if (btnContinue) {
      btnContinue.onclick = () => {
        appState.confirmSchema();
        router.go(3);
      };
    }
  }

  router.register(2, render);

})();
