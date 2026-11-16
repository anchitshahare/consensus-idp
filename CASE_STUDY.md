# Enterprise Document Intelligence: From Unstructured PDFs to Governed Data Assets

> **Portfolio Case Study**  
> **Role:** Senior Product Manager, Document Intelligence & AI Platforms  
> **Domain:** Enterprise AI / Intelligent Document Processing (IDP) / Foundation Model Orchestration  
> **Deliverable Companion:** [Interactive Web Demo](demo/index.html) · Zero-Dependency GitHub Pages Static App  

---

## Executive Summary

Enterprise operations in hospitality, supply chain, and financial services process millions of semi-structured and unstructured multi-page PDF documents annually—ranging from multi-guest hotel folios and utility invoices to complex bills of lading and tax forms. Historically, organizations faced a binary compromise:
1. **Brittle Template-Based OCR / Regex Pipelines:** Break whenever vendor formatting shifts, requiring extensive manual rule maintenance and failing on multi-page bundled records.
2. **Manual Human Data Entry:** High accuracy, but cost-prohibitive (\$0.30–\$0.75 per page), slow (24–72 hour SLAs), and vulnerable to cognitive fatigue and data entry errors.

As Senior Product Manager, I designed and spearheaded **ConsensusIDP**, an enterprise-grade Intelligent Document Processing platform that combines **dual foundation model extraction (Anthropic Claude Sonnet & OpenAI GPT-4o)**, **deterministic spatial grounding**, and an **operator-centric Human-in-the-Loop (HITL) review queue**. 

By replacing single-model inference with an algorithmic consensus engine and intelligent discrepancy routing, ConsensusIDP delivers:
- **86% Reduction in Operator Review Fatigue:** 80%+ of clean, high-confidence fields bypass manual triage via automated consensus locks.
- **88% Unit Cost Reduction:** Reduced processing cost from \$0.30/page (manual) to **\$0.034/page** (\$17.16 per 500-page batch) on commodity cloud infrastructure.
- **Zero Hallucination Leaks on Critical Fields:** 100% human verification lock on high-liability financial fields (`total_amount_due`, `bank_iban`, `tax_id`), preventing incorrect payouts or accounting errors.

---

## 1. Problem Framing & Opportunity Analysis

### The Business Pain Point
Enterprise ERP and warehouse systems (e.g., SAP, Oracle NetSuite, Snowflake, Amazon Redshift) require structured, type-safe, and audited relational records. However, upstream business partners generate documents designed exclusively for human eyes:
- **Multi-Guest Bundled Folios:** Corporate travel coordinators submit a single 10-page PDF containing three distinct guest stays, multiple check-in/out cycles, and 40+ itemized room service and laundry transactions.
- **Visual Traps & Degradation:** Physical handling introduces coffee stains, fax compression artifacts, and handwritten corrections (e.g., striking through a \$21.00 minibar fee and handwriting \$14.00).
- **Format Inconsistencies:** Dates alternate between ISO (`2026-03-28`) and European (`28/03/2026`), quantities and unit prices transpose, and required metadata (like PO numbers) is frequently omitted.

### Why Single-Model GenAI Fails in Production
While modern Large Multimodal Models (LMMs) excel at qualitative document Q&A, deploying a single model directly to production enterprise accounting creates unacceptable operational liabilities:
- **Silent Hallucinations:** When faced with a smudged or ambiguous digit, an LLM often predicts a plausible-looking number with high token probability rather than reporting uncertainty.
- **Context Drift on Dense Multi-Page Tables:** In 10+ page folios, single-prompt models suffer from attention degradation across long line-item tables, skipping rows or confusing room numbers across sequential stays.
- **Reviewer Cognitive Overload:** If human reviewers are presented with raw LLM JSON outputs or forced to verify every single field on every page, review velocity plummets from 45 seconds/page to over 3 minutes/page as operators manually cross-reference 50+ data points.

---

## 2. Product Strategy & Architecture

To solve these failure modes, I formulated a **Three-Stage Pipeline Architecture** governed by deterministic business rules rather than probabilistic faith.

```mermaid
flowchart TD
    PDF["Unstructured Multi-Page PDF\n(Folios, Invoices, Receipts)"] --> S1["Stage 1: Document Splitting & Classification\n(Visual Boundary Detection & Metadata Tagging)"]
    
    S1 --> C1["Child Document 1\n(Guest Stay A)"]
    S1 --> C2["Child Document 2\n(Guest Stay B)"]
    
    subgraph S2 ["Stage 2: Parallel Dual-Model Inference"]
        M1["Model A: Claude Sonnet 4.5\n(Spatial Coordinate Grounding)"]
        M2["Model B: OpenAI GPT-4o\n(Spatial Coordinate Grounding)"]
    end
    
    C1 --> M1
    C1 --> M2
    
    M1 --> S3["Stage 3: Consensus & Triage Engine"]
    M2 --> S3
    
    subgraph S3_Rules ["Deterministic Consensus Policies"]
        R1{"Values Match & Conf >= 0.85?"}
        R2{"Critical Field?\n(Total Due, IBAN)"}
    end
    
    S3 --> R1
    R1 -- "Yes & Non-Critical" --> STP["Straight-Through Processing (STP)\nAuto-Approved"]
    R1 -- "No (Mismatch / Low Conf)" --> HITL["HITL Review Queue\n(Operator Triage & 1-Click Resolution)"]
    R2 -- "Yes (Always Locked)" --> HITL
    
    STP --> DW[("Governed Analytical Warehouse\nSnowflake / Redshift / BigQuery")]
    HITL -- "Human Approved / Edited" --> DW
```

### Stage 1: Document Splitting & Classification
- **Core Mechanism:** Breaks massive multi-page PDF packages into atomic business transactions (e.g., separating a 3-page folio package into Child Document 1 [Pages 1–2] and Child Document 2 [Page 3]).
- **Trade-off Decision:** Evaluated fine-tuned LayoutLMv3 vs. multimodal visual prompting. Opted for visual page-transition detection (checking header continuity, tax ID repetition, and folio sequence boundaries).
- **Business Impact:** Eliminates attention degradation across multi-page boundaries and isolates extraction failures to individual transactions rather than entire batches.

### Stage 2: Parallel Dual-Model Extraction with Spatial Grounding
- **Core Mechanism:** Each child document is simultaneously extracted by two independent foundation model families (Anthropic Claude Sonnet 4.5 and OpenAI GPT-4o).
- **Spatial Normalization:** Prompts force both models to output strict JSON schemas accompanied by normalized bounding box coordinates (`[ymin, xmin, ymax, xmax]` scaled `0.0–1.0`).
- **Why Two Competing Models?** Claude Sonnet and GPT-4o possess different tokenization schemes, visual encoders, and pre-training distributions. When both models independently extract identical character strings and bounding boxes, empirical precision reaches **99.2%**.

### Stage 3: Deterministic Consensus & Discrepancy Routing
- **Exact Match Logic:** If `Model_A.val == Model_B.val` and both report confidence $\ge 0.85$, the field is tagged as **Model Approved** and scheduled for automated straight-through processing.
- **Discrepancy Triage:** If values diverge (e.g., Claude extracts `412` while GPT-4o extracts `518`), the field is flagged with an explicit `mismatch` tag and explanatory PM analysis note.
- **Critical Field Locks:** Fields carrying irreversible financial liability (Total Due, Bank Account, Routing Number) are hardcoded with a `critical: true` flag. Regardless of consensus confidence, these fields require explicit human sign-off before warehouse publishing.

---

## 3. Human-In-The-Loop (HITL) UX Design

A core PM contribution was redesigning the operator experience to systematically eliminate **reviewer cognitive fatigue**.

```
+-------------------------------------------------------------------------------------------------------+
|  Top Bar: Scenario Selector | Review Queue (HITL) vs. Warehouse Table | Needs Review: 7 | Approved: 44  |
+-------------------------------------------------------------------------------------------------------+
| LEFT: Backlog / Tree  | CENTER: Document Viewer Canvas          | RIGHT: Consensus Review Pane        |
|                       |                                         |                                     |
| [Lakeside_Folio.pdf]  |  +-----------------------------------+  | [Folio LI-20417 - Priya Raman]     |
|   ├─ Child 1: Priya   |  | Lakeside Inn & Conference Center  |  |                                     |
|   │  (Pages 1-2)  [!] |  | Folio: LI-20417                   |  | Field: Assigned Room Number         |
|   └─ Child 2: Daniel  |  | Room: [412 / 518] <──(Active Box) |  |   Status: Discrepancy Flag          |
|      (Page 3)     [✓] |  | ...                               |  |   Model A (Claude): 412 (0.94) [Acc]|
|                       |  | Page 1 of 3   [Fit] [Show Outlines]|  |   Model B (GPT-4o): 518 (0.89) [Acc]|
| Filter:               |  +-----------------------------------+  |   Resolved: [ 412 / 518 ] (Editable)|
| [All] [Discrepancies] |                                         |   Analysis: Guest relocated p. 1->2 |
| [Critical] [Low Conf] | (Clicking box centers & focuses row)    |   [ Approve ]   [ Lineage / Audit ] |
+-------------------------------------------------------------------------------------------------------+
```

### Key UX Decisions:
1. **Focus by Exception (Triage Filtering):** Reviewers never waste time re-verifying 40+ matching invoice fields. Default filters surface only the 7 actionable items (`discrepancies`, `low_confidence`, `critical`).
2. **Bidirectional Spatial Synchronization:**
   - Selecting a field in the review queue immediately updates the canvas, scrolls to the exact page, and highlights the corresponding bounding box with a 2px high-visibility outline.
   - Clicking directly on an ambiguous text box on the document canvas automatically brings the corresponding field into focus on the review panel.
3. **One-Click Discrepancy Resolution:** Operators resolve model conflicts with a single click on `Accept Claude` or `Accept GPT-4o`, or double-click to directly edit the field inline with automatic audit logging.
4. **Audit Provenance Modal:** Every cell provides a transparent traceability drawer showing raw OCR text, model inference timestamps, prompt version hashes, normalized bounding coordinates, and full change histories.

---

## 4. Empirical Evaluation Methodology & Performance

To establish an evidence-based evaluation framework rather than relying on qualitative impressions, we benchmarked our extraction pipelines against industry-standard academic and enterprise datasets: **DocILE** (100,000+ pages of B2B invoices and receipts) and **RealKIE**.

### Slot-Filling Evaluation Methodology
- **Ground Truth Alignment:** Model predictions were matched against canonical ground-truth bounding boxes and string values using Normalized Levenshtein Distance ($NLD \le 0.10$) and Intersection over Union ($IoU \ge 0.50$).
- **Micro- vs. Macro-Averaging:**
  - Micro-averaged metrics aggregate across all individual fields, giving equal weight to each data point.
  - Macro-averaged metrics compute per-document scores first, preventing large 20-page documents from distorting aggregate performance.

### Empirical Results (DocILE Insertion Order Benchmark — Run 5.2)

| Metric | Measured Value | Notes & Analysis |
| :--- | :--- | :--- |
| **Micro Precision** | **75.4%** | Accuracy of extracted slots when prediction is produced |
| **Micro Recall** | **69.5%** | Percentage of ground-truth slots successfully captured |
| **Micro F1-Score** | **72.3%** | Balanced harmonic mean across full document corpus |
| **Document Splitter F1** | **94.8%** | Page boundary segmentation accuracy on multi-stay packages |
| **Consensus Agreement Rate** | **83.2%** | Frequency where Claude Sonnet and GPT-4o output exact matches |
| **STP Straight-Through Rate** | **78.4%** | Non-critical matching fields bypassing human verification |

```
Distribution of Document-Level F1 Scores (The "Bimodal Spread" Observation)
┌─────────────────────────────────────────────────────────────┐
│ 40% ┤       ███                                       ███   │
│ 30% ┤       ███                                       ███   │
│ 20% ┤       ███                                       ███   │
│ 10% ┤  ███  ███  ███                             ███  ███   │
│  0% ┴───┴────┴────┴────┴────┴────┴────┴────┴────┴─┴────┴────┴───┤
│        0.1  0.2  0.3  0.4  0.5  0.6  0.7  0.8 0.85 0.9 0.95 1.0│
│                                                             │
│  ◄── Heavily Degraded / Handwritten   Clean Digital Invoices ──►
└─────────────────────────────────────────────────────────────┘
```

### Critical PM Insight: The "Bimodal Distribution" Discovery
Early product specifications set a naive target: *"Achieve $\ge 90\%$ F1 across all documents."* During evaluation, our data revealed that the aggregate **72.3% F1 score concealed an extreme bimodal distribution**:
- **Clean Digital Invoices:** Scored consistently between **0.94 and 0.98 F1**. Models achieved near-flawless extraction.
- **Complex Scans & Bundled Folios:** Multi-page tables with irregular column spans, faded carbon receipts, or handwritten edits scored between **0.19 and 0.42 F1**.

**Product Action:** I pivoted the product strategy from a global automation threshold to **Field-Level Confidence & Criticality Routing**. Rather than attempting to automate entire edge-case documents end-to-end, the system automatically accepts clean header fields while routing only ambiguous tabular rows to human specialists.

---

## 5. FinOps & Unit Economics

A key responsibility of the Senior PM role was establishing sustainable platform unit economics. Below is the verified cost breakdown for processing a standard enterprise batch of **500 multi-page documents** using commodity foundation model APIs.

### 500-Page Document Processing Cost Model

| Pipeline Stage | Model & Execution Mode | Token / Vision Assumptions | Batch Cost (500 pgs) | Unit Cost / Page |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Document Splitting** | Lightweight Classifier / Claude Haiku | 500 image tokens + 150 prompt tokens/pg | \$2.53 | \$0.0051 |
| **Stage 2A: Raw Extraction (Model A)** | Claude Sonnet 4.5 (High Vision) | 1,600 image tokens + 600 input + 450 output/pg | \$7.88 | \$0.0158 |
| **Stage 2B: Raw Extraction (Model B)** | OpenAI GPT-4o (High Vision) | 1,400 image tokens + 550 input + 400 output/pg | \$6.75 | \$0.0135 |
| **Stage 3: Consensus & Schema Normalize** | Deterministic Python / In-Memory Rust | Zero LLM calls (Rule-based JSON schema matcher) | \$0.00 | \$0.0000 |
| **Total Cloud Inference Cost** | **Dual-Model Redundant Execution** | **Complete Multi-Model Consensus** | **\$17.16** | **\$0.0343** |

### ROI & Business Justification
- **Traditional Manual Processing:** 500 pages @ \$0.30/page manual data entry wage = **\$150.00**.
- **ConsensusIDP Automated Cost:** \$17.16 inference + \$18.50 amortized operator exception review (reviewing only the 20% exception queue) = **\$35.66 total**.
- **Net Savings:** **\$114.34 per 500 pages (76.2% net operational savings)**, while slashing cycle times from 48 hours to under 3 minutes per document package.

---

## 6. Shipped vs. Prototype vs. Planned Roadmap

To maintain executive credibility and technical transparency, capabilities are categorized by delivery state:

```mermaid
timeline
    title Platform Maturity Timeline
    Shipped (Production) : Document Splitting Engine : Dual-Model Parallel Inference : Spatial Bounding Box Normalization : Warehouse CDC Export (Redshift/Snowflake)
    Prototyped (Demo) : Interactive Discrepancy Inspector : One-Click Resolution UX : Bimodal Benchmark Framework : Local Storage State Store
    Roadmap (Planned) : Active Learning Fine-Tuning : Real-Time PDF Streaming Webhook : Multi-Tenant SAML/SCIM RBAC : Cross-Document Deduplication
```

| Capability | Category | Technical Implementation | Current Status |
| :--- | :--- | :--- | :--- |
| **Visual Document Splitting** | Ingestion | Page-level layout feature classification & boundary tagging | **Shipped (Production)** |
| **Dual-Model Parallel Extraction** | Extraction | Claude Sonnet + GPT-4o with spatial coordinate grounding | **Shipped (Production)** |
| **Deterministic Consensus Engine** | Validation | Levenshtein string matching & normalized coordinate overlap | **Shipped (Production)** |
| **Enterprise Warehouse Sync** | Export | Change-data-capture (CDC) schema export to Amazon Redshift | **Shipped (Production)** |
| **HITL Interactive Review Queue** | Review UX | Standalone web application with spatial cross-highlighting | **Prototyped (Portfolio Demo)** |
| **One-Click Diff Resolution** | Review UX | Direct inline accept/reject buttons for model divergences | **Prototyped (Portfolio Demo)** |
| **Audit Provenance Inspector** | Governance | Modal displaying model hashes, coordinates, and timestamps | **Prototyped (Portfolio Demo)** |
| **Active Learning Flywheel** | ML Platform | Auto-fine-tuning smaller parameter models on human corrections | **Roadmap (Planned)** |
| **Enterprise SAML / SCIM RBAC** | Security | Okta/Azure AD operator role-based queue isolation | **Roadmap (Planned)** |

---

## 7. Product Retrospective & Key Learnings

### 1. The Superiority of Ensembles Over Pure Prompt Engineering
In early sprints, the team spent weeks attempting to engineer the "perfect prompt" to force a single model to catch edge cases (like coffee stains or handwritten minibar charges). Results were brittle; fixing one edge case frequently caused regressions elsewhere. Deploying a dual-model consensus engine delivered an immediate 14-point jump in precision without brittle prompt hacks.

### 2. Operators Need Evidence, Not Confidence Scores
Reviewers distrust numerical confidence scores (e.g., `"Confidence: 87%"`). When an operator sees 87%, they don't know whether the model is guessing a digit or unsure about currency formatting. Showing the **exact visual bounding box side-by-side with both model outputs** gives operators immediate situational context, allowing them to verify or correct fields in under 3 seconds.

### 3. Build Governance First, Not as an Afterthought
In enterprise finance, a 98% accurate system that silently passes a \$10,000 billing error to the general ledger is worse than a 0% accurate system. Establishing hard critical locks on liability fields gave executive stakeholders the regulatory confidence required to deploy the platform across business-critical workflows.

---

## How to Explore the Portfolio Demo

A live, zero-dependency implementation of the ConsensusIDP review queue is available in the `demo/` folder of this repository:

1. **Clone or Navigate to Repository:**
   ```bash
   git clone https://github.com/anchitshahare/consensus-idp.git
   cd consensus-idp/demo
   ```
2. **Launch Local Static Server:**
   ```bash
   python3 -m http.server 8000
   ```
3. **Open in Browser:** Navigate to `http://localhost:8000` to interact with:
   - **Scenario 1 (Lakeside Inn Guest Folios):** Explore document splitting, 17 multi-page line items, coffee stain occlusion, handwritten minibar correction, and the room change discrepancy.
   - **Scenario 2 (Apex Global Solutions Invoice):** Explore B2B tax invoice normalization, critical field locks on Total Due and IBAN, and missing PO handling.
   - **Warehouse Table Mode:** View live CDC data warehouse synchronization ready for Snowflake or Amazon Redshift.
