"""
Independently authored synthetic document generator for Scenario 2: Apex Global Solutions Commercial B2B Invoice.
Generates a 1-page clean digital PDF invoice with intentional extraction challenges:
- Critical field guardrails on total balance due ($14,850.00) and Bank Account/IBAN
- Date format normalization (Model A extracts ISO 2026-03-15 vs Model B 15/03/2026)
- Missing purchase order number (both models agree: null)
- Table quantity discrepancy on line item #3 (Model A reads 2 vs Model B reads 3)

Also exports high-resolution PNG page image and exact normalized bounding box coordinates.
"""

import json
from pathlib import Path
import fitz  # PyMuPDF
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

PAGE_W, PAGE_H = letter

INDIGO = HexColor("#1E1B4B")
SLATE = HexColor("#0F172A")
DARK_GRAY = HexColor("#334155")
LIGHT_GRAY = HexColor("#F8FAFC")
BORDER_GRAY = HexColor("#E2E8F0")
MUTED_TEXT = HexColor("#64748B")
PRIMARY_BLUE = HexColor("#2563EB")


def pt_to_norm(x, y_bottom, w, h):
    """
    Convert ReportLab points (bottom-left origin) to web normalized [x, y, w, h] (top-left origin).
    """
    x_norm = round(x / PAGE_W, 4)
    y_norm = round((PAGE_H - (y_bottom + h)) / PAGE_H, 4)
    w_norm = round(w / PAGE_W, 4)
    h_norm = round(h / PAGE_H, 4)
    return {"x": max(0.0, x_norm), "y": max(0.0, y_norm), "w": w_norm, "h": h_norm}


def generate_apex_invoice(pdf_path: Path):
    c = canvas.Canvas(str(pdf_path), pagesize=letter)
    boxes = {"page_1": {}}

    # Top brand bar
    c.setFillColor(INDIGO)
    c.rect(0, PAGE_H - 100, PAGE_W, 100, fill=1, stroke=0)

    # Vendor branding
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(40, PAGE_H - 42, "APEX GLOBAL SOLUTIONS INC.")
    boxes["page_1"]["vendor_name"] = pt_to_norm(40, PAGE_H - 46, 320, 24)

    c.setFont("Helvetica", 8.5)
    c.setFillColorRGB(0.85, 0.9, 1.0)
    c.drawString(40, PAGE_H - 60, "100 Innovation Way, Suite 400, Austin, TX 78701  |  Tel: (512) 555-0199")
    c.drawString(40, PAGE_H - 74, "Tax ID / EIN: 74-2948102  |  DUNS: 08-941-8201  |  billing@apexsolutions.example")
    boxes["page_1"]["vendor_address"] = pt_to_norm(40, PAGE_H - 78, 380, 22)

    # Invoice title & status
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 14)
    c.drawRightString(PAGE_W - 40, PAGE_H - 42, "COMMERCIAL TAX INVOICE")

    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(HexColor("#93C5FD"))
    c.drawRightString(PAGE_W - 40, PAGE_H - 60, "INVOICE #: INV-2026-0847")
    boxes["page_1"]["invoice_number"] = pt_to_norm(PAGE_W - 200, PAGE_H - 64, 160, 16)

    c.setFont("Helvetica", 8.5)
    c.setFillColorRGB(0.9, 0.95, 1.0)
    c.drawRightString(PAGE_W - 40, PAGE_H - 74, "Status: ISSUED / UNPAID")

    # Meta Details Grid
    meta_y = PAGE_H - 120
    c.setFillColor(LIGHT_GRAY)
    c.setStrokeColor(BORDER_GRAY)
    c.roundRect(40, meta_y - 90, 255, 90, 4, fill=1, stroke=1)
    c.roundRect(315, meta_y - 90, 257, 90, 4, fill=1, stroke=1)

    # Customer Panel
    c.setFillColor(INDIGO)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(52, meta_y - 18, "BILL TO / CUSTOMER DETAILS")

    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(SLATE)
    c.drawString(52, meta_y - 34, "Meridian Logistics Corporation")
    boxes["page_1"]["customer_name"] = pt_to_norm(50, meta_y - 37, 180, 14)

    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED_TEXT)
    c.drawString(52, meta_y - 48, "Attn: Accounts Payable & Financial Operations")
    c.drawString(52, meta_y - 62, "450 North Harbor Blvd, Suite 800")
    c.drawString(52, meta_y - 76, "Long Beach, CA 90802  |  ap@meridianlogistics.example")
    boxes["page_1"]["customer_address"] = pt_to_norm(50, meta_y - 78, 240, 20)

    # Invoice Properties Panel
    c.setFillColor(INDIGO)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(327, meta_y - 18, "INVOICE ATTRIBUTES")

    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED_TEXT)
    c.drawString(327, meta_y - 34, "Invoice Date:")
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(SLATE)
    c.drawString(410, meta_y - 34, "March 15, 2026 (2026-03-15)")
    boxes["page_1"]["invoice_date"] = pt_to_norm(408, meta_y - 37, 130, 14)

    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED_TEXT)
    c.drawString(327, meta_y - 48, "Payment Due:")
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(SLATE)
    c.drawString(410, meta_y - 48, "April 14, 2026 (Net 30 Days)")
    boxes["page_1"]["payment_due_date"] = pt_to_norm(408, meta_y - 51, 130, 14)

    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED_TEXT)
    c.drawString(327, meta_y - 62, "Purchase Order:")
    c.setFont("Helvetica-Oblique", 8.5)
    c.setFillColor(MUTED_TEXT)
    c.drawString(410, meta_y - 62, "— (None Provided)")
    boxes["page_1"]["purchase_order"] = pt_to_norm(408, meta_y - 65, 110, 14)

    c.setFont("Helvetica", 8.5)
    c.drawString(327, meta_y - 76, "Billing Currency:")
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(SLATE)
    c.drawString(410, meta_y - 76, "USD ($) United States Dollars")
    boxes["page_1"]["currency"] = pt_to_norm(408, meta_y - 79, 130, 14)

    # Line Items Table
    tbl_y = meta_y - 120
    c.setFillColor(INDIGO)
    c.rect(40, tbl_y, 532, 22, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(48, tbl_y + 7, "#")
    c.drawString(70, tbl_y + 7, "SERVICE / PRODUCT DESCRIPTION")
    c.drawString(340, tbl_y + 7, "BILLING CODE")
    c.drawString(430, tbl_y + 7, "QTY")
    c.drawString(475, tbl_y + 7, "UNIT PRICE")
    c.drawRightString(564, tbl_y + 7, "LINE TOTAL")

    line_items = [
        ("1", "Enterprise Cloud Infrastructure — Managed Tier (March 2026)", "CLD-MGMT-01", "1 mo", "$4,500.00", "$4,500.00"),
        ("2", "Data Pipeline Engineering & Integration Architecture", "ENG-SR-CONS", "30 hrs", "$175.00", "$5,250.00"),
        ("3", "Tier-3 Enterprise API Gateway Access License (Annual Base)", "LIC-API-T3", "2 units", "$1,200.00", "$2,400.00"),
        ("4", "Automated Security Audit & SOC-2 Continuous Monitoring", "SEC-AUD-MON", "1 ev", "$1,500.00", "$1,500.00"),
        ("5", "Priority 24/7 Production Support Retainer (SLA Guarantee)", "SUP-247-RET", "1 mo", "$1,200.00", "$1,200.00"),
    ]

    curr_y = tbl_y - 24
    boxes["page_1"]["table_rows"] = []
    for r_idx, (num, desc, code, qty, rate, amt) in enumerate(line_items):
        bg = LIGHT_GRAY if r_idx % 2 == 1 else HexColor("#FFFFFF")
        c.setFillColor(bg)
        c.rect(40, curr_y, 532, 22, fill=1, stroke=0)

        c.setFillColor(SLATE)
        c.setFont("Helvetica", 8)
        c.drawString(48, curr_y + 7, num)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(70, curr_y + 7, desc)
        c.setFont("Helvetica", 8)
        c.setFillColor(MUTED_TEXT)
        c.drawString(340, curr_y + 7, code)

        c.setFillColor(SLATE)
        c.drawString(430, curr_y + 7, qty)
        c.drawString(475, curr_y + 7, rate)
        c.setFont("Helvetica-Bold", 8)
        c.drawRightString(564, curr_y + 7, amt)

        row_box = pt_to_norm(40, curr_y, 532, 22)
        boxes["page_1"]["table_rows"].append({"row": r_idx, "box": row_box, "desc": desc, "qty": qty, "amt": amt})
        curr_y -= 23

    # Totals Section (Right)
    sum_y = curr_y - 30
    c.setStrokeColor(BORDER_GRAY)
    c.setFillColor(LIGHT_GRAY)
    c.roundRect(315, sum_y - 95, 257, 95, 4, fill=1, stroke=1)

    c.setFillColor(SLATE)
    c.setFont("Helvetica", 9)
    c.drawString(330, sum_y - 20, "Taxable Subtotal:")
    c.drawRightString(560, sum_y - 20, "$14,850.00")
    boxes["page_1"]["subtotal"] = pt_to_norm(328, sum_y - 23, 235, 14)

    c.drawString(330, sum_y - 38, "Sales Tax (0.0% B2B Exempt):")
    c.drawRightString(560, sum_y - 38, "$0.00")

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(INDIGO)
    c.drawString(330, sum_y - 68, "TOTAL AMOUNT DUE:")
    c.drawRightString(560, sum_y - 68, "$14,850.00")
    boxes["page_1"]["total_amount_due"] = pt_to_norm(328, sum_y - 74, 235, 22)

    # Remittance & Wire Instructions Panel (Left)
    c.setFillColor(HexColor("#F1F5F9"))
    c.setStrokeColor(BORDER_GRAY)
    c.roundRect(40, sum_y - 95, 255, 95, 4, fill=1, stroke=1)

    c.setFillColor(INDIGO)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(52, sum_y - 18, "WIRE & ACH REMITTANCE DETAILS")

    c.setFont("Helvetica", 7.5)
    c.setFillColor(DARK_GRAY)
    c.drawString(52, sum_y - 34, "Depository Bank: First Commercial Bank of Texas")
    c.drawString(52, sum_y - 48, "Account Title: Apex Global Solutions Operating Account")
    c.drawString(52, sum_y - 62, "Routing / ABA Number: 111000025")
    c.setFont("Helvetica-Bold", 8)
    c.drawString(52, sum_y - 78, "Account / IBAN: US89-FCBT-0111-0000-2591-84")
    boxes["page_1"]["bank_iban"] = pt_to_norm(50, sum_y - 82, 235, 16)

    # Footer note
    c.setFont("Helvetica", 7.5)
    c.setFillColor(MUTED_TEXT)
    c.drawString(40, 40, "Terms: Net 30 Days. Late payments accrue interest at 1.5% per month. Wire remittance confirmation to finance@apexsolutions.example.")
    c.drawRightString(PAGE_W - 40, 40, "Page 1 of 1 · Apex Global Solutions Inc.")

    c.showPage()
    c.save()

    return boxes


def render_pdf_to_images(pdf_path: Path, output_dir: Path):
    """Render PDF page to 150 DPI PNG using PyMuPDF."""
    output_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    img_paths = []
    for i, page in enumerate(doc):
        zoom = 150 / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_file = output_dir / f"page-{i + 1}.png"
        pix.save(str(out_file))
        img_paths.append(out_file)
    return img_paths


if __name__ == "__main__":
    out_dir = Path("/Users/anchitshahare/Documents/IDP/demo/assets/apex-invoice")
    out_dir.mkdir(parents=True, exist_ok=True)
    pdf_file = out_dir / "apex_invoice.pdf"

    print(f"Generating synthetic invoice: {pdf_file}")
    boxes = generate_apex_invoice(pdf_file)

    print("Rendering page to high-resolution PNG...")
    img_files = render_pdf_to_images(pdf_file, out_dir)
    print(f"Rendered {len(img_files)} pages to {out_dir}")

    box_file = out_dir / "bounding_boxes.json"
    box_file.write_text(json.dumps(boxes, indent=2), encoding="utf-8")
    print(f"Saved normalized bounding boxes to {box_file}")
