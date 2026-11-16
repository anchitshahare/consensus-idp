"""
Independently authored synthetic document generator for Scenario 1: Lakeside Inn Guest Folios.
Generates a 3-page synthetic PDF containing two bundled hotel folios with intentional
cognitive traps: document splitting, multi-page table continuation, coffee stain over phone,
handwritten minibar charge correction ($21.00 struck out, $14.00 handwritten), and address traps.

Also exports high-resolution PNG page images and exact normalized bounding box coordinates.
"""

import json
import os
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import fitz  # PyMuPDF
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

# 612 x 792 pt (Letter)
PAGE_W, PAGE_H = letter

NAVY = HexColor("#1E3A8A")
DARK_GRAY = HexColor("#1F2937")
LIGHT_GRAY = HexColor("#F3F4F6")
BORDER_GRAY = HexColor("#E5E7EB")
MUTED_TEXT = HexColor("#4B5563")
ACCENT_BLUE = HexColor("#2563EB")
CORAL = HexColor("#DC2626")


def pt_to_norm(x, y_bottom, w, h):
    """
    Convert ReportLab points (bottom-left origin) to web normalized [x, y, w, h] (top-left origin).
    """
    x_norm = round(x / PAGE_W, 4)
    y_norm = round((PAGE_H - (y_bottom + h)) / PAGE_H, 4)
    w_norm = round(w / PAGE_W, 4)
    h_norm = round(h / PAGE_H, 4)
    return {"x": max(0.0, x_norm), "y": max(0.0, y_norm), "w": w_norm, "h": h_norm}


def create_coffee_stain(size=(120, 80)):
    """Create a realistic coffee stain overlay image with PIL."""
    random.seed(42)
    img = Image.new("RGBA", size, (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    cx, cy = size[0] // 2, size[1] // 2
    r_x, r_y = size[0] // 2 - 10, size[1] // 2 - 10

    # Outer ring
    d.ellipse([cx - r_x, cy - r_y, cx + r_x, cy + r_y], outline=(160, 110, 60, 140), width=4)
    # Inner puddle
    d.ellipse([cx - r_x + 8, cy - r_y + 6, cx + r_x - 8, cy + r_y - 6], fill=(190, 140, 80, 50))
    # Splatters
    for _ in range(8):
        sx = cx + random.randint(-r_x - 5, r_x + 5)
        sy = cy + random.randint(-r_y - 5, r_y + 5)
        d.ellipse([sx - 3, sy - 3, sx + 3, sy + 3], fill=(150, 100, 50, 120))

    img = img.filter(ImageFilter.GaussianBlur(1.5))
    return img


def create_paid_stamp(size=(140, 60)):
    """Create a slanted red 'PAID' stamp."""
    img = Image.new("RGBA", size, (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    # Double red border
    d.rectangle([4, 4, size[0] - 5, size[1] - 5], outline=(220, 38, 38, 180), width=3)
    d.rectangle([8, 8, size[0] - 9, size[1] - 9], outline=(220, 38, 38, 120), width=1)
    # Text
    d.text((28, 16), "PAID", fill=(220, 38, 38, 200))
    img = img.rotate(12, expand=True, resample=Image.BICUBIC)
    return img


def draw_header(c, folio_num, page_num, total_pages, is_child_2=False):
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 85, PAGE_W, 85, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(36, PAGE_H - 40, "LAKESIDE INN & CONFERENCE CENTER")

    c.setFont("Helvetica", 9)
    c.setFillColorRGB(0.85, 0.9, 1.0)
    c.drawString(36, PAGE_H - 56, "1200 Harbor Road, Madison, WI 53703  |  Tel: (608) 555-0142  |  stay@lakesideinn.example")
    c.drawString(36, PAGE_H - 68, "Tax ID / EIN: 39-1849201  |  VAT / Registration: WI-HTL-849102")

    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(PAGE_W - 36, PAGE_H - 38, f"GUEST FOLIO #{folio_num}")

    c.setFont("Helvetica", 9)
    c.drawRightString(PAGE_W - 36, PAGE_H - 54, f"Page {page_num} of {total_pages}")
    if is_child_2:
        c.drawRightString(PAGE_W - 36, PAGE_H - 68, "Status: SETTLED IN FULL")
    else:
        c.drawRightString(PAGE_W - 36, PAGE_H - 68, "Status: BALANCE DUE")


def generate_lakeside_folio(pdf_path: Path):
    c = canvas.Canvas(str(pdf_path), pagesize=letter)
    boxes = {"page_1": {}, "page_2": {}, "page_3": {}}

    # =========================================================================
    # PAGE 1: Child 1 - Priya Raman (Part 1 of 2)
    # =========================================================================
    draw_header(c, "LI-20417", 1, 2)
    boxes["page_1"]["hotel_name"] = pt_to_norm(36, PAGE_H - 45, 360, 20)
    boxes["page_1"]["folio_number"] = pt_to_norm(PAGE_W - 170, PAGE_H - 45, 134, 18)

    # Guest Info & Stay Details Panels
    top_y = PAGE_H - 105
    c.setFillColor(LIGHT_GRAY)
    c.setStrokeColor(BORDER_GRAY)
    c.roundRect(36, top_y - 95, 260, 95, 4, fill=1, stroke=1)
    c.roundRect(316, top_y - 95, 260, 95, 4, fill=1, stroke=1)

    # Left Panel: Guest & Billing Details
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(46, top_y - 18, "GUEST & BILLING INFORMATION")
    c.setFont("Helvetica", 9)
    c.setFillColor(DARK_GRAY)

    c.drawString(46, top_y - 34, "Guest Name:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(120, top_y - 34, "Priya Raman")
    boxes["page_1"]["guest_name"] = pt_to_norm(118, top_y - 37, 100, 14)

    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED_TEXT)
    c.drawString(46, top_y - 48, "Guest Address:")
    c.drawString(120, top_y - 48, "88 Maple Street, Springfield, IL 62704")
    boxes["page_1"]["guest_address"] = pt_to_norm(118, top_y - 51, 170, 14)

    c.drawString(46, top_y - 62, "Billing Entity:")
    c.drawString(120, top_y - 62, "Raman Consulting LLC (Suite 210, Chicago)")

    c.drawString(46, top_y - 75, "Phone / Email:")
    c.drawString(120, top_y - 75, "(217) 555-0198  |  priya.raman@example.com")
    boxes["page_1"]["guest_phone"] = pt_to_norm(118, top_y - 78, 85, 14)
    boxes["page_1"]["guest_email"] = pt_to_norm(205, top_y - 78, 125, 14)

    # Right Panel: Stay Parameters
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(326, top_y - 18, "RESERVATION DETAILS")
    c.setFont("Helvetica", 9)
    c.setFillColor(DARK_GRAY)

    c.drawString(326, top_y - 34, "Check-in Date:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(410, top_y - 34, "2026-03-02 (15:00)")
    boxes["page_1"]["check_in_date"] = pt_to_norm(408, top_y - 37, 70, 14)

    c.setFont("Helvetica", 9)
    c.drawString(326, top_y - 48, "Check-out Date:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(410, top_y - 48, "2026-03-06 (11:00)")
    boxes["page_1"]["check_out_date"] = pt_to_norm(408, top_y - 51, 70, 14)

    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED_TEXT)
    c.drawString(326, top_y - 62, "Assigned Room:")
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(DARK_GRAY)
    c.drawString(410, top_y - 62, "412 (moved to 518 on 03/04)")
    boxes["page_1"]["room_number"] = pt_to_norm(408, top_y - 65, 140, 14)

    c.setFont("Helvetica", 8)
    c.drawString(326, top_y - 75, "Rate Plan / Code:")
    c.drawString(410, top_y - 75, "DLX-KING-CORP / Raman Preferred")

    # Coffee stain overlay image on Page 1 over the phone number
    stain_img = create_coffee_stain()
    stain_path = pdf_path.parent / "temp_stain.png"
    stain_img.save(stain_path)
    c.drawImage(str(stain_path), 130, top_y - 95, width=100, height=45, mask="auto")
    if stain_path.exists():
        stain_path.unlink()

    # Table Header
    tbl_y = top_y - 120
    c.setFillColor(NAVY)
    c.rect(36, tbl_y, 540, 20, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(44, tbl_y + 6, "#")
    c.drawString(68, tbl_y + 6, "DATE")
    c.drawString(140, tbl_y + 6, "DESCRIPTION / SERVICE CODE")
    c.drawString(380, tbl_y + 6, "ROOM/REF")
    c.drawString(450, tbl_y + 6, "QTY")
    c.drawRightString(566, tbl_y + 6, "AMOUNT ($)")

    # Page 1 Table Rows (Items 1 to 11)
    rows_p1 = [
        ("1", "2026-03-02", "Room Charge — Deluxe King, Room 412", "412", "1", "189.00"),
        ("2", "2026-03-02", "Valet Parking Overnight", "VAL-01", "1", "25.00"),
        ("3", "2026-03-03", "Breakfast Buffet — Harbor Restaurant", "REST-B", "2", "36.00"),
        ("4", "2026-03-03", "Room Charge — Deluxe King, Room 412", "412", "1", "189.00"),
        ("5", "2026-03-03", "Valet Parking Overnight", "VAL-01", "1", "25.00"),
        ("6", "2026-03-03", "Minibar Refreshment Restock", "MBAR-3", "3", "14.00"),  # HANDWRITTEN OVERRIDE!
        ("7", "2026-03-04", "Room Charge — Deluxe King, Room 518", "518", "1", "189.00"),
        ("8", "2026-03-04", "Breakfast Buffet — Harbor Restaurant", "REST-B", "2", "36.00"),
        ("9", "2026-03-04", "Valet Parking Overnight", "VAL-01", "1", "25.00"),
        ("10", "2026-03-04", "Express Laundry & Dry Cleaning", "LND-88", "1", "18.50"),
        ("11", "2026-03-05", "Room Charge — Deluxe King, Room 518", "518", "1", "189.00"),
    ]

    curr_y = tbl_y - 20
    boxes["page_1"]["table_rows"] = []
    for r_idx, (num, dt, desc, ref, qty, amt) in enumerate(rows_p1):
        bg = LIGHT_GRAY if r_idx % 2 == 1 else HexColor("#FFFFFF")
        c.setFillColor(bg)
        c.rect(36, curr_y, 540, 18, fill=1, stroke=0)

        c.setFillColor(DARK_GRAY)
        c.setFont("Helvetica", 8)
        c.drawString(44, curr_y + 5, num)
        c.drawString(68, curr_y + 5, dt)
        c.drawString(140, curr_y + 5, desc)
        c.drawString(380, curr_y + 5, ref)
        c.drawString(456, curr_y + 5, qty)

        # Row 6 minibar has printed 21.00 struck out, and 14.00 written next to it
        if num == "6":
            # Struck-out printed 21.00
            c.setFillColor(HexColor("#9CA3AF"))
            c.drawRightString(525, curr_y + 5, "$21.00")
            c.setStrokeColor(CORAL)
            c.setLineWidth(1.2)
            c.line(496, curr_y + 8, 528, curr_y + 8)

            # Handwritten replacement 14.00 in dark blue pen
            c.setFillColor(HexColor("#1D4ED8"))
            c.setFont("Helvetica-BoldOblique", 9)
            c.drawRightString(566, curr_y + 5, "$14.00")
            boxes["page_1"]["minibar_charge"] = pt_to_norm(495, curr_y + 2, 75, 14)
        else:
            c.drawRightString(566, curr_y + 5, f"${amt}")

        row_box = pt_to_norm(36, curr_y, 540, 18)
        boxes["page_1"]["table_rows"].append({"row": r_idx, "box": row_box, "desc": desc, "amt": amt})
        curr_y -= 19

    # Bottom footer notice
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(MUTED_TEXT)
    c.drawRightString(PAGE_W - 36, 36, "Continued on Page 2 — Line items continue...")
    c.showPage()

    # =========================================================================
    # PAGE 2: Child 1 continued (Items 12 to 17 + Summary Totals)
    # =========================================================================
    draw_header(c, "LI-20417", 2, 2)

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(36, PAGE_H - 105, "CHARGES CONTINUED (FOLIO # LI-20417)")

    tbl_y2 = PAGE_H - 120
    c.setFillColor(NAVY)
    c.rect(36, tbl_y2, 540, 20, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(44, tbl_y2 + 6, "#")
    c.drawString(68, tbl_y2 + 6, "DATE")
    c.drawString(140, tbl_y2 + 6, "DESCRIPTION / SERVICE CODE")
    c.drawString(380, tbl_y2 + 6, "ROOM/REF")
    c.drawString(450, tbl_y2 + 6, "QTY")
    c.drawRightString(566, tbl_y2 + 6, "AMOUNT ($)")

    rows_p2 = [
        ("12", "2026-03-05", "Spa Haven — 60 Min Deep Tissue Massage", "SPA-42", "1", "110.00"),
        ("13", "2026-03-05", "In-Room Dining Dinner & Beverage", "ROOM-D", "1", "47.80"),
        ("14", "2026-03-05", "Valet Parking Overnight", "VAL-01", "1", "25.00"),
        ("15", "2026-03-06", "Breakfast Buffet — Harbor Restaurant", "REST-B", "2", "36.00"),
        ("16", "2026-03-06", "Guest Goodwill Credit — HVAC Service Issue", "ADJ-CR", "1", "-50.00"),
        ("17", "2026-03-07", "Late Charge — Minibar Water & Almonds", "MBAR-L", "1", "12.00"),
    ]

    curr_y = tbl_y2 - 20
    boxes["page_2"]["table_rows"] = []
    for r_idx, (num, dt, desc, ref, qty, amt) in enumerate(rows_p2):
        bg = LIGHT_GRAY if r_idx % 2 == 1 else HexColor("#FFFFFF")
        c.setFillColor(bg)
        c.rect(36, curr_y, 540, 18, fill=1, stroke=0)

        c.setFillColor(DARK_GRAY)
        c.setFont("Helvetica", 8)
        c.drawString(44, curr_y + 5, num)
        c.drawString(68, curr_y + 5, dt)
        c.drawString(140, curr_y + 5, desc)
        c.drawString(380, curr_y + 5, ref)
        c.drawString(456, curr_y + 5, qty)
        c.drawRightString(566, curr_y + 5, f"${amt}")

        row_box = pt_to_norm(36, curr_y, 540, 18)
        boxes["page_2"]["table_rows"].append({"row": r_idx + 11, "box": row_box, "desc": desc, "amt": amt})
        curr_y -= 19

    # Totals and Settlement Summary Box
    sum_y = curr_y - 25
    c.setStrokeColor(BORDER_GRAY)
    c.setFillColor(LIGHT_GRAY)
    c.roundRect(290, sum_y - 120, 286, 120, 4, fill=1, stroke=1)

    c.setFillColor(DARK_GRAY)
    c.setFont("Helvetica", 9)

    c.drawString(306, sum_y - 20, "Gross Line Item Subtotal:")
    c.drawRightString(560, sum_y - 20, "$1,116.30")

    c.drawString(306, sum_y - 36, "State & Local Hospitality Tax (9.5%):")
    c.drawRightString(560, sum_y - 36, "$106.05")

    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(306, sum_y - 54, "Total Folio Charges:")
    c.drawRightString(560, sum_y - 54, "$1,222.35")
    boxes["page_2"]["total_charges"] = pt_to_norm(304, sum_y - 57, 260, 16)

    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor("#059669"))
    c.drawString(306, sum_y - 72, "Less Advance Deposit (Bank Wire 02/20):")
    c.drawRightString(560, sum_y - 72, "-$200.00")

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(HexColor("#B91C1C"))
    c.drawString(306, sum_y - 96, "NET BALANCE DUE:")
    c.drawRightString(560, sum_y - 96, "$1,022.35")
    boxes["page_2"]["total_amount_due"] = pt_to_norm(304, sum_y - 100, 260, 20)

    # Payment Notes Panel
    c.setFillColor(HexColor("#EFF6FF"))
    c.setStrokeColor(HexColor("#BFDBFE"))
    c.roundRect(36, sum_y - 120, 240, 120, 4, fill=1, stroke=1)

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(48, sum_y - 20, "SETTLEMENT & PAYMENT METHOD")
    c.setFont("Helvetica", 8)
    c.setFillColor(DARK_GRAY)
    c.drawString(48, sum_y - 40, "• Deposit Paid: $200.00 via Bank Transfer")
    c.drawString(48, sum_y - 56, "• Remaining Balance: Card on file")
    c.drawString(48, sum_y - 72, "• Payment Card: Mastercard ending in 2291")
    boxes["page_2"]["payment_method"] = pt_to_norm(46, sum_y - 76, 210, 16)
    c.drawString(48, sum_y - 94, "Authorized Signature: P. Raman (Digital)")

    # Bottom sign-off
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED_TEXT)
    c.drawString(36, 40, "Thank you for staying with us at Lakeside Inn. For billing inquiries, email billing@lakesideinn.example.")
    c.showPage()

    # =========================================================================
    # PAGE 3: Child 2 - Daniel Okafor (Complete 1-page bill)
    # =========================================================================
    draw_header(c, "LI-20433", 1, 1, is_child_2=True)
    boxes["page_3"]["hotel_name"] = pt_to_norm(36, PAGE_H - 45, 360, 20)
    boxes["page_3"]["folio_number"] = pt_to_norm(PAGE_W - 170, PAGE_H - 45, 134, 18)

    top_y3 = PAGE_H - 105
    c.setFillColor(LIGHT_GRAY)
    c.setStrokeColor(BORDER_GRAY)
    c.roundRect(36, top_y3 - 90, 260, 90, 4, fill=1, stroke=1)
    c.roundRect(316, top_y3 - 90, 260, 90, 4, fill=1, stroke=1)

    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(46, top_y3 - 18, "GUEST & BILLING INFORMATION")
    c.setFont("Helvetica", 9)
    c.setFillColor(DARK_GRAY)

    c.drawString(46, top_y3 - 34, "Guest Name:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(120, top_y3 - 34, "Daniel Okafor")
    boxes["page_3"]["guest_name"] = pt_to_norm(118, top_y3 - 37, 100, 14)

    c.setFont("Helvetica", 8)
    c.drawString(46, top_y3 - 48, "Guest Address:")
    c.drawString(120, top_y3 - 48, "742 Evergreen Terrace, Madison, WI 53705")
    boxes["page_3"]["guest_address"] = pt_to_norm(118, top_y3 - 51, 180, 14)

    c.drawString(46, top_y3 - 62, "Phone / Email:")
    c.drawString(120, top_y3 - 62, "(608) 555-0182  |  d.okafor@example.com")
    boxes["page_3"]["guest_phone"] = pt_to_norm(118, top_y3 - 65, 80, 14)
    boxes["page_3"]["guest_email"] = pt_to_norm(200, top_y3 - 65, 120, 14)

    # Right Panel: Stay Parameters
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(326, top_y3 - 18, "RESERVATION DETAILS")
    c.setFont("Helvetica", 9)
    c.setFillColor(DARK_GRAY)

    c.drawString(326, top_y3 - 34, "Check-in Date:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(410, top_y3 - 34, "2026-03-10")
    boxes["page_3"]["check_in_date"] = pt_to_norm(408, top_y3 - 37, 70, 14)

    c.setFont("Helvetica", 9)
    c.drawString(326, top_y3 - 48, "Check-out Date:")
    c.setFont("Helvetica-Bold", 9)
    c.drawString(410, top_y3 - 48, "2026-03-12")
    boxes["page_3"]["check_out_date"] = pt_to_norm(408, top_y3 - 51, 70, 14)

    c.setFont("Helvetica", 8)
    c.drawString(326, top_y3 - 62, "Room Number:")
    c.setFont("Helvetica-Bold", 8)
    c.drawString(410, top_y3 - 62, "207 (Queen Suite)")
    boxes["page_3"]["room_number"] = pt_to_norm(408, top_y3 - 65, 100, 14)

    # Table on Page 3
    tbl_y3 = top_y3 - 115
    c.setFillColor(NAVY)
    c.rect(36, tbl_y3, 540, 20, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(44, tbl_y3 + 6, "#")
    c.drawString(68, tbl_y3 + 6, "DATE")
    c.drawString(140, tbl_y3 + 6, "DESCRIPTION / SERVICE CODE")
    c.drawString(380, tbl_y3 + 6, "ROOM/REF")
    c.drawString(450, tbl_y3 + 6, "QTY")
    c.drawRightString(566, tbl_y3 + 6, "AMOUNT ($)")

    rows_p3 = [
        ("1", "2026-03-10", "Room Charge — Queen Suite, Room 207", "207", "1", "175.00"),
        ("2", "2026-03-10", "Valet Parking Overnight", "VAL-01", "1", "25.00"),
        ("3", "2026-03-11", "Room Charge — Queen Suite, Room 207", "207", "1", "175.00"),
        ("4", "2026-03-11", "Lakeside Grill Dinner Service", "REST-G", "1", "68.50"),
    ]

    curr_y = tbl_y3 - 20
    boxes["page_3"]["table_rows"] = []
    for r_idx, (num, dt, desc, ref, qty, amt) in enumerate(rows_p3):
        bg = LIGHT_GRAY if r_idx % 2 == 1 else HexColor("#FFFFFF")
        c.setFillColor(bg)
        c.rect(36, curr_y, 540, 18, fill=1, stroke=0)

        c.setFillColor(DARK_GRAY)
        c.setFont("Helvetica", 8)
        c.drawString(44, curr_y + 5, num)
        c.drawString(68, curr_y + 5, dt)
        c.drawString(140, curr_y + 5, desc)
        c.drawString(380, curr_y + 5, ref)
        c.drawString(456, curr_y + 5, qty)
        c.drawRightString(566, curr_y + 5, f"${amt}")

        row_box = pt_to_norm(36, curr_y, 540, 18)
        boxes["page_3"]["table_rows"].append({"row": r_idx, "box": row_box, "desc": desc, "amt": amt})
        curr_y -= 19

    # Page 3 Totals
    sum_y3 = curr_y - 25
    c.setStrokeColor(BORDER_GRAY)
    c.setFillColor(LIGHT_GRAY)
    c.roundRect(290, sum_y3 - 85, 286, 85, 4, fill=1, stroke=1)

    c.setFillColor(DARK_GRAY)
    c.setFont("Helvetica", 9)
    c.drawString(306, sum_y3 - 20, "Subtotal Charges:")
    c.drawRightString(560, sum_y3 - 20, "$443.50")
    c.drawString(306, sum_y3 - 36, "Taxes & Municipal Fees (9.5%):")
    c.drawRightString(560, sum_y3 - 36, "$42.00")

    c.setFont("Helvetica-Bold", 10.5)
    c.setFillColor(NAVY)
    c.drawString(306, sum_y3 - 60, "TOTAL BILLED & PAID:")
    c.drawRightString(560, sum_y3 - 60, "$485.50")
    boxes["page_3"]["total_amount_due"] = pt_to_norm(304, sum_y3 - 64, 260, 18)

    # Add red 'PAID' stamp across check-out date area
    stamp_img = create_paid_stamp()
    stamp_path = pdf_path.parent / "temp_paid.png"
    stamp_img.save(stamp_path)
    c.drawImage(str(stamp_path), 400, top_y3 - 75, width=110, height=45, mask="auto")
    if stamp_path.exists():
        stamp_path.unlink()

    c.showPage()
    c.save()

    return boxes


def render_pdf_to_images(pdf_path: Path, output_dir: Path):
    """Render each PDF page to 150 DPI PNG using PyMuPDF (fitz)."""
    output_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    img_paths = []
    for i, page in enumerate(doc):
        # 150 DPI zoom factor = 150 / 72 ≈ 2.0833
        zoom = 150 / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_file = output_dir / f"page-{i + 1}.png"
        pix.save(str(out_file))
        img_paths.append(out_file)
    return img_paths


if __name__ == "__main__":
    out_dir = Path("/Users/anchitshahare/Documents/IDP/demo/assets/lakeside-inn")
    out_dir.mkdir(parents=True, exist_ok=True)
    pdf_file = out_dir / "lakeside_inn.pdf"

    print(f"Generating synthetic PDF: {pdf_file}")
    boxes = generate_lakeside_folio(pdf_file)

    print("Rendering pages to high-resolution PNGs...")
    img_files = render_pdf_to_images(pdf_file, out_dir)
    print(f"Rendered {len(img_files)} pages to {out_dir}")

    box_file = out_dir / "bounding_boxes.json"
    box_file.write_text(json.dumps(boxes, indent=2), encoding="utf-8")
    print(f"Saved normalized bounding boxes to {box_file}")
