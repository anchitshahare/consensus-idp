"""
Script to assemble the complete, high-fidelity mockData.js for the ConsensusIDP web demo.
Reads bounding boxes from the generated JSON assets and pairs them with:
- Model A: Claude Sonnet 4.5
- Model B: GPT-4o
- Confidence tiers (High, Medium, Low)
- Discrepancy flags, critical field tags, and complete audit lineage metadata.
"""

import json
from pathlib import Path

BASE_DIR = Path("/Users/anchitshahare/Documents/IDP")
LAKESIDE_BOXES = json.loads((BASE_DIR / "demo/assets/lakeside-inn/bounding_boxes.json").read_text())
APEX_BOXES = json.loads((BASE_DIR / "demo/assets/apex-invoice/bounding_boxes.json").read_text())


def build_mock_data():
    # =========================================================================
    # SCENARIO 1: Lakeside Inn Guest Folios
    # =========================================================================
    p1_boxes = LAKESIDE_BOXES["page_1"]
    p2_boxes = LAKESIDE_BOXES["page_2"]
    p3_boxes = LAKESIDE_BOXES["page_3"]

    # Child 1: Priya Raman (Pages 1 & 2)
    child_1_components = [
        {
            "componentId": "c1-header",
            "name": "Header & Reservation",
            "type": "FIELD",
            "description": "Core folio identifiers and reservation parameters",
            "cells": [
                {
                    "cellId": "c1-hotel-name",
                    "fieldName": "hotel_name",
                    "label": "Hotel Name",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Lakeside Inn & Conference Center",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Lakeside Inn & Conference Center", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Lakeside Inn & Conference Center", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["hotel_name"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Banner",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-folio-num",
                    "fieldName": "folio_number",
                    "label": "Folio Number",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "LI-20417",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "LI-20417", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "LI-20417", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["folio_number"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Header Right",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-check-in",
                    "fieldName": "check_in_date",
                    "label": "Check-in Date",
                    "dataType": "DATE",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "2026-03-02",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "2026-03-02", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "2026-03-02", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["check_in_date"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Stay Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-check-out",
                    "fieldName": "check_out_date",
                    "label": "Check-out Date",
                    "dataType": "DATE",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "2026-03-06",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "2026-03-06", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "2026-03-06", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["check_out_date"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Stay Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-room-num",
                    "fieldName": "room_number",
                    "label": "Room Number",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "needs_review",
                    "reviewReason": "mismatch",
                    "selectedValue": "412 / 518",
                    "discrepancyNote": "Guest changed rooms mid-stay. Model A extracted initial room 412; Model B extracted second room 518.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "412", "confidence": "Medium"},
                        {"modelId": "GPT-4o", "value": "518", "confidence": "Medium"}
                    ],
                    "boundingBox": {**p1_boxes["room_number"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Stay Panel",
                        "modelAgreement": "mismatch",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "c1-late-checkout",
                    "fieldName": "late_checkout_time",
                    "label": "Late Checkout Time",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "missing",
                    "selectedValue": None,
                    "discrepancyNote": "Field not present in document. Both models correctly agree on null.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": None, "confidence": "High"},
                        {"modelId": "GPT-4o", "value": None, "confidence": "High"}
                    ],
                    "boundingBox": None,
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "N/A (Absent from source)",
                        "modelAgreement": "match_null",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-total-due",
                    "fieldName": "total_amount_due",
                    "label": "Net Balance Due",
                    "dataType": "DECIMAL",
                    "critical": True,
                    "reviewStatus": "needs_review",
                    "reviewReason": "mismatch",
                    "selectedValue": "1022.35",
                    "discrepancyNote": "CRITICAL FIELD: Model A captured gross charges ($1,222.35) omitting advance deposit. Model B captured net payable balance ($1,022.35).",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "1222.35", "confidence": "Medium"},
                        {"modelId": "GPT-4o", "value": "1022.35", "confidence": "High"}
                    ],
                    "boundingBox": {**p2_boxes["total_amount_due"], "page": 2},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Summary Box",
                        "modelAgreement": "mismatch",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "c1-payment-method",
                    "fieldName": "payment_method",
                    "label": "Payment Method",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Deposit: Bank Wire; Balance: Mastercard ending 2291",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Deposit: Bank Wire; Balance: Mastercard ending 2291", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Deposit: Bank Wire; Balance: Mastercard ending 2291", "confidence": "High"}
                    ],
                    "boundingBox": {**p2_boxes["payment_method"], "page": 2},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Settlement Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                }
            ]
        },
        {
            "componentId": "c1-guest-info",
            "name": "Guest Details",
            "type": "FIELD",
            "description": "Guest contact identity and billing entity",
            "cells": [
                {
                    "cellId": "c1-guest-name",
                    "fieldName": "guest_name",
                    "label": "Guest Name",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Priya Raman",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Priya Raman", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Priya Raman", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["guest_name"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Guest Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-guest-addr",
                    "fieldName": "guest_address",
                    "label": "Guest Residential Address",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "88 Maple Street, Springfield, IL 62704",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "88 Maple Street, Springfield, IL 62704", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "88 Maple Street, Springfield, IL 62704", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["guest_address"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Guest Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                },
                {
                    "cellId": "c1-guest-phone",
                    "fieldName": "guest_phone",
                    "label": "Guest Phone Number",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "needs_review",
                    "reviewReason": "low_confidence",
                    "selectedValue": "(217) 555-0198",
                    "discrepancyNote": "Low-confidence visual extraction due to coffee stain overlaying phone digits. Both models extracted correctly, but flagged below confidence threshold.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "(217) 555-0198", "confidence": "Low"},
                        {"modelId": "GPT-4o", "value": "(217) 555-0198", "confidence": "Low"}
                    ],
                    "boundingBox": {**p1_boxes["guest_phone"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Guest Panel",
                        "modelAgreement": "match",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "c1-guest-email",
                    "fieldName": "guest_email",
                    "label": "Guest Email",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "priya.raman@example.com",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "priya.raman@example.com", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "priya.raman@example.com", "confidence": "High"}
                    ],
                    "boundingBox": {**p1_boxes["guest_email"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Guest Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                    }
                }
            ]
        },
        {
            "componentId": "c1-charges-table",
            "name": "Folio Itemized Charges",
            "type": "TABLE",
            "description": "Multi-page itemized charges (17 records across pages 1 and 2)",
            "cells": []
        }
    ]

    # Populate 17 charges
    charges_raw = [
        # Page 1 (1 to 11)
        ("1", "2026-03-02", "Room Charge — Deluxe King, Room 412", "1", "189.00", 1, 0),
        ("2", "2026-03-02", "Valet Parking Overnight", "1", "25.00", 1, 1),
        ("3", "2026-03-03", "Breakfast Buffet — Harbor Restaurant", "2", "36.00", 1, 2),
        ("4", "2026-03-03", "Room Charge — Deluxe King, Room 412", "1", "189.00", 1, 3),
        ("5", "2026-03-03", "Valet Parking Overnight", "1", "25.00", 1, 4),
        ("6", "2026-03-03", "Minibar Refreshment Restock", "3", "14.00", 1, 5),  # DISCREPANCY!
        ("7", "2026-03-04", "Room Charge — Deluxe King, Room 518", "1", "189.00", 1, 6),
        ("8", "2026-03-04", "Breakfast Buffet — Harbor Restaurant", "2", "36.00", 1, 7),
        ("9", "2026-03-04", "Valet Parking Overnight", "1", "25.00", 1, 8),
        ("10", "2026-03-04", "Express Laundry & Dry Cleaning", "1", "18.50", 1, 9),
        ("11", "2026-03-05", "Room Charge — Deluxe King, Room 518", "1", "189.00", 1, 10),
        # Page 2 (12 to 17)
        ("12", "2026-03-05", "Spa Haven — 60 Min Deep Tissue Massage", "1", "110.00", 2, 0),
        ("13", "2026-03-05", "In-Room Dining Dinner & Beverage", "1", "47.80", 2, 1),
        ("14", "2026-03-05", "Valet Parking Overnight", "1", "25.00", 2, 2),
        ("15", "2026-03-06", "Breakfast Buffet — Harbor Restaurant", "2", "36.00", 2, 3),
        ("16", "2026-03-06", "Guest Goodwill Credit — HVAC Service Issue", "1", "-50.00", 2, 4),
        ("17", "2026-03-07", "Late Charge — Minibar Water & Almonds", "1", "12.00", 2, 5),
    ]

    for item_num, dt, desc, qty, amt, pg, box_idx in charges_raw:
        box = p1_boxes["table_rows"][box_idx]["box"] if pg == 1 else p2_boxes["table_rows"][box_idx]["box"]
        row_idx = int(item_num) - 1

        is_minibar_trap = (item_num == "6")
        status = "needs_review" if is_minibar_trap else "approved"
        reason = "mismatch" if is_minibar_trap else "match"
        note = "HANDWRITTEN OVERRIDE: Model A extracted struck-out printed rate ($21.00); Model B extracted handwritten correction ($14.00)." if is_minibar_trap else None

        extractions = [
            {"modelId": "Claude Sonnet 4.5", "value": "21.00" if is_minibar_trap else amt, "confidence": "Low" if is_minibar_trap else "High"},
            {"modelId": "GPT-4o", "value": "14.00" if is_minibar_trap else amt, "confidence": "High"}
        ]

        # Add row description cell
        child_1_components[2]["cells"].append({
            "cellId": f"c1-charge-{item_num}-desc",
            "fieldName": "charge_description",
            "rowIndex": row_idx,
            "colName": "description",
            "label": f"#{item_num} Description",
            "dataType": "VARCHAR",
            "critical": False,
            "reviewStatus": "approved",
            "reviewReason": "match",
            "selectedValue": desc,
            "extractions": [
                {"modelId": "Claude Sonnet 4.5", "value": desc, "confidence": "High"},
                {"modelId": "GPT-4o", "value": desc, "confidence": "High"}
            ],
            "boundingBox": {**box, "page": pg},
            "lineage": {
                "documentId": f"DOC-FOLIO-20417-P{pg}",
                "pageRef": f"Page {pg}, Row {item_num}",
                "modelAgreement": "match",
                "reviewerId": "SYSTEM_CONSENSUS",
                "reviewedAt": "2026-03-07T08:14:22Z"
            }
        })

        # Add row amount cell
        child_1_components[2]["cells"].append({
            "cellId": f"c1-charge-{item_num}-amt",
            "fieldName": "charge_amount",
            "rowIndex": row_idx,
            "colName": "amount",
            "label": f"#{item_num} Amount",
            "dataType": "DECIMAL",
            "critical": is_minibar_trap,
            "reviewStatus": status,
            "reviewReason": reason,
            "selectedValue": amt,
            "discrepancyNote": note,
            "extractions": extractions,
            "boundingBox": {**box, "page": pg},
            "lineage": {
                "documentId": f"DOC-FOLIO-20417-P{pg}",
                "pageRef": f"Page {pg}, Row {item_num}",
                "modelAgreement": "mismatch" if is_minibar_trap else "match",
                "reviewerId": None if is_minibar_trap else "SYSTEM_CONSENSUS",
                "reviewedAt": None if is_minibar_trap else "2026-03-07T08:14:22Z"
            }
        })

    # Child 2: Daniel Okafor (Page 3)
    child_2_components = [
        {
            "componentId": "c2-header",
            "name": "Header & Reservation",
            "type": "FIELD",
            "description": "Single-page guest stay identifiers",
            "cells": [
                {
                    "cellId": "c2-hotel-name",
                    "fieldName": "hotel_name",
                    "label": "Hotel Name",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Lakeside Inn & Conference Center",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Lakeside Inn & Conference Center", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Lakeside Inn & Conference Center", "confidence": "High"}
                    ],
                    "boundingBox": {**p3_boxes["hotel_name"], "page": 3},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Banner",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-13T09:20:10Z"
                    }
                },
                {
                    "cellId": "c2-folio-num",
                    "fieldName": "folio_number",
                    "label": "Folio Number",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "needs_review",
                    "reviewReason": "mismatch",
                    "selectedValue": "LI-20433",
                    "discrepancyNote": "Smudged digit in folio header. Model A extracted 'LI-20483'; Model B correctly extracted 'LI-20433'.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "LI-20483", "confidence": "Medium"},
                        {"modelId": "GPT-4o", "value": "LI-20433", "confidence": "Medium"}
                    ],
                    "boundingBox": {**p3_boxes["folio_number"], "page": 3},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Header Right",
                        "modelAgreement": "mismatch",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "c2-check-in",
                    "fieldName": "check_in_date",
                    "label": "Check-in Date",
                    "dataType": "DATE",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "2026-03-10",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "2026-03-10", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "2026-03-10", "confidence": "High"}
                    ],
                    "boundingBox": {**p3_boxes["check_in_date"], "page": 3},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Stay Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-13T09:20:10Z"
                    }
                },
                {
                    "cellId": "c2-check-out",
                    "fieldName": "check_out_date",
                    "label": "Check-out Date",
                    "dataType": "DATE",
                    "critical": False,
                    "reviewStatus": "needs_review",
                    "reviewReason": "low_confidence",
                    "selectedValue": "2026-03-12",
                    "discrepancyNote": "Low-confidence extraction caused by red 'PAID' stamp occluding the checkout date text. Both models read 2026-03-12 correctly.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "2026-03-12", "confidence": "Low"},
                        {"modelId": "GPT-4o", "value": "2026-03-12", "confidence": "Low"}
                    ],
                    "boundingBox": {**p3_boxes["check_out_date"], "page": 3},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Stay Panel (under stamp)",
                        "modelAgreement": "match",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "c2-total-due",
                    "fieldName": "total_amount_due",
                    "label": "Total Settled Amount",
                    "dataType": "DECIMAL",
                    "critical": True,
                    "reviewStatus": "needs_review",
                    "reviewReason": "critical",
                    "selectedValue": "485.50",
                    "discrepancyNote": "CRITICAL FIELD: Both models match on $485.50 (High confidence). Flagged for mandatory reviewer verification before warehouse publishing.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "485.50", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "485.50", "confidence": "High"}
                    ],
                    "boundingBox": {**p3_boxes["total_amount_due"], "page": 3},
                    "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Summary Box",
                        "modelAgreement": "match",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                }
            ]
        }
    ]

    # =========================================================================
    # SCENARIO 2: Apex Global Solutions Commercial B2B Invoice
    # =========================================================================
    ap_boxes = APEX_BOXES["page_1"]

    apex_components = [
        {
            "componentId": "ap-header",
            "name": "Invoice Header & Parties",
            "type": "FIELD",
            "description": "Commercial entities and billing metadata",
            "cells": [
                {
                    "cellId": "ap-vendor-name",
                    "fieldName": "vendor_name",
                    "label": "Vendor Name",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Apex Global Solutions Inc.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Apex Global Solutions Inc.", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Apex Global Solutions Inc.", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["vendor_name"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Header Top",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                    }
                },
                {
                    "cellId": "ap-invoice-num",
                    "fieldName": "invoice_number",
                    "label": "Invoice Number",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "INV-2026-0847",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "INV-2026-0847", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "INV-2026-0847", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["invoice_number"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Header Right",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                    }
                },
                {
                    "cellId": "ap-customer-name",
                    "fieldName": "customer_name",
                    "label": "Customer Name",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "Meridian Logistics Corporation",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "Meridian Logistics Corporation", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "Meridian Logistics Corporation", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["customer_name"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Bill-To Panel",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                    }
                },
                {
                    "cellId": "ap-invoice-date",
                    "fieldName": "invoice_date",
                    "label": "Invoice Issue Date",
                    "dataType": "DATE",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "match",
                    "selectedValue": "2026-03-15",
                    "discrepancyNote": "Normalized Match: Model A extracted ISO format '2026-03-15'; Model B extracted EU format '15/03/2026'. Calendar date parsed identically.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "2026-03-15", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "15/03/2026", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["invoice_date"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Attributes Panel",
                        "modelAgreement": "normalized_match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                    }
                },
                {
                    "cellId": "ap-po-number",
                    "fieldName": "purchase_order",
                    "label": "Purchase Order (PO)",
                    "dataType": "VARCHAR",
                    "critical": False,
                    "reviewStatus": "approved",
                    "reviewReason": "missing",
                    "selectedValue": None,
                    "discrepancyNote": "Document omitted customer PO number ('— None Provided'). Both models agree on null.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": None, "confidence": "High"},
                        {"modelId": "GPT-4o", "value": None, "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["purchase_order"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Attributes Panel",
                        "modelAgreement": "match_null",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                    }
                },
                {
                    "cellId": "ap-total-due",
                    "fieldName": "total_amount_due",
                    "label": "Total Amount Due",
                    "dataType": "DECIMAL",
                    "critical": True,
                    "reviewStatus": "needs_review",
                    "reviewReason": "critical",
                    "selectedValue": "14850.00",
                    "discrepancyNote": "CRITICAL FIELD: Both models match on $14,850.00 (High confidence). Flagged for mandatory human authorization before general ledger export.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "14850.00", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "14850.00", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["total_amount_due"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Summary Box",
                        "modelAgreement": "match",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                },
                {
                    "cellId": "ap-bank-iban",
                    "fieldName": "bank_iban",
                    "label": "Remittance Account / IBAN",
                    "dataType": "VARCHAR",
                    "critical": True,
                    "reviewStatus": "needs_review",
                    "reviewReason": "critical",
                    "selectedValue": "US89-FCBT-0111-0000-2591-84",
                    "discrepancyNote": "CRITICAL COMPLIANCE GUARD: Wire bank account number requires human sign-off to prevent invoice payment diversion attacks.",
                    "extractions": [
                        {"modelId": "Claude Sonnet 4.5", "value": "US89-FCBT-0111-0000-2591-84", "confidence": "High"},
                        {"modelId": "GPT-4o", "value": "US89-FCBT-0111-0000-2591-84", "confidence": "High"}
                    ],
                    "boundingBox": {**ap_boxes["bank_iban"], "page": 1},
                    "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Wire Instructions Box",
                        "modelAgreement": "match",
                        "reviewerId": None,
                        "reviewedAt": None
                    }
                }
            ]
        },
        {
            "componentId": "ap-line-items",
            "name": "Invoice Line Items",
            "type": "TABLE",
            "description": "Services billed and fee schedule",
            "cells": [
                # Row 0
                {"cellId": "ap-li-0-desc", "fieldName": "description", "rowIndex": 0, "colName": "description", "label": "Item 1 Description", "dataType": "VARCHAR", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "Enterprise Cloud Infrastructure — Managed Tier", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "Enterprise Cloud Infrastructure — Managed Tier", "confidence": "High"}, {"modelId": "GPT-4o", "value": "Enterprise Cloud Infrastructure — Managed Tier", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][0]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 1", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                {"cellId": "ap-li-0-amt", "fieldName": "amount", "rowIndex": 0, "colName": "amount", "label": "Item 1 Amount", "dataType": "DECIMAL", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "4500.00", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "4500.00", "confidence": "High"}, {"modelId": "GPT-4o", "value": "4500.00", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][0]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 1", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                # Row 1
                {"cellId": "ap-li-1-desc", "fieldName": "description", "rowIndex": 1, "colName": "description", "label": "Item 2 Description", "dataType": "VARCHAR", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "Data Pipeline Engineering & Integration Architecture", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "Data Pipeline Engineering & Integration Architecture", "confidence": "High"}, {"modelId": "GPT-4o", "value": "Data Pipeline Engineering & Integration Architecture", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][1]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 2", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                {"cellId": "ap-li-1-amt", "fieldName": "amount", "rowIndex": 1, "colName": "amount", "label": "Item 2 Amount", "dataType": "DECIMAL", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "5250.00", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "5250.00", "confidence": "High"}, {"modelId": "GPT-4o", "value": "5250.00", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][1]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 2", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                # Row 2 (DISCREPANCY ON QUANTITY!)
                {"cellId": "ap-li-2-desc", "fieldName": "description", "rowIndex": 2, "colName": "description", "label": "Item 3 Description", "dataType": "VARCHAR", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "Tier-3 Enterprise API Gateway Access License", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "Tier-3 Enterprise API Gateway Access License", "confidence": "High"}, {"modelId": "GPT-4o", "value": "Tier-3 Enterprise API Gateway Access License", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][2]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 3", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                {"cellId": "ap-li-2-qty", "fieldName": "quantity", "rowIndex": 2, "colName": "quantity", "label": "Item 3 Quantity", "dataType": "INTEGER", "critical": False, "reviewStatus": "needs_review", "reviewReason": "mismatch", "selectedValue": "2", "discrepancyNote": "Model A extracted quantity '2 units'; Model B hallucinated '3 units'. Extracted unit rate is $1,200.00 (Total = $2,400.00 confirms 2 units).", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "2", "confidence": "High"}, {"modelId": "GPT-4o", "value": "3", "confidence": "Medium"}], "boundingBox": {**ap_boxes["table_rows"][2]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 3 Qty", "modelAgreement": "mismatch", "reviewerId": None, "reviewedAt": None}},
                {"cellId": "ap-li-2-amt", "fieldName": "amount", "rowIndex": 2, "colName": "amount", "label": "Item 3 Amount", "dataType": "DECIMAL", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "2400.00", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "2400.00", "confidence": "High"}, {"modelId": "GPT-4o", "value": "2400.00", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][2]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 3 Total", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                # Row 3
                {"cellId": "ap-li-3-desc", "fieldName": "description", "rowIndex": 3, "colName": "description", "label": "Item 4 Description", "dataType": "VARCHAR", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "Automated Security Audit & SOC-2 Continuous Monitoring", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "Automated Security Audit & SOC-2 Continuous Monitoring", "confidence": "High"}, {"modelId": "GPT-4o", "value": "Automated Security Audit & SOC-2 Continuous Monitoring", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][3]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 4", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                {"cellId": "ap-li-3-amt", "fieldName": "amount", "rowIndex": 3, "colName": "amount", "label": "Item 4 Amount", "dataType": "DECIMAL", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "1500.00", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "1500.00", "confidence": "High"}, {"modelId": "GPT-4o", "value": "1500.00", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][3]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 4", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                # Row 4
                {"cellId": "ap-li-4-desc", "fieldName": "description", "rowIndex": 4, "colName": "description", "label": "Item 5 Description", "dataType": "VARCHAR", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "Priority 24/7 Production Support Retainer", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "Priority 24/7 Production Support Retainer", "confidence": "High"}, {"modelId": "GPT-4o", "value": "Priority 24/7 Production Support Retainer", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][4]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 5", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
                {"cellId": "ap-li-4-amt", "fieldName": "amount", "rowIndex": 4, "colName": "amount", "label": "Item 5 Amount", "dataType": "DECIMAL", "critical": False, "reviewStatus": "approved", "reviewReason": "match", "selectedValue": "1200.00", "extractions": [{"modelId": "Claude Sonnet 4.5", "value": "1200.00", "confidence": "High"}, {"modelId": "GPT-4o", "value": "1200.00", "confidence": "High"}], "boundingBox": {**ap_boxes["table_rows"][4]["box"], "page": 1}, "lineage": {"documentId": "DOC-APEX-0847-P1", "pageRef": "Page 1, Line Item 5", "modelAgreement": "match", "reviewerId": "SYSTEM_CONSENSUS", "reviewedAt": "2026-03-16T11:05:40Z"}},
            ]
        }
    ]

    # Combine into top-level dataset
    data = {
        "scenarios": [
            {
                "id": "lakeside-inn",
                "name": "Lakeside Inn Guest Folios",
                "category": "Hospitality & Multi-Guest Folios",
                "documentType": "Guest Statement / Hotel Folio",
                "description": "3-page bundled PDF with 2 guest stays, document splitting, 17 multi-page line items, coffee stain, handwritten minibar strike-through ($21.00 -> $14.00), and address traps.",
                "totalFiles": 1,
                "splitChildrenCount": 2,
                "files": [
                    {
                        "fileId": "file-lakeside-folio-20417",
                        "fileName": "Lakeside_Inn_Guest_Folios.pdf",
                        "fileDisplayName": "Lakeside_Inn_Guest_Folios.pdf (3 Pages)",
                        "pageCount": 3,
                        "status": "needs_review",
                        "publishStatus": "not_published",
                        "lastPublishedOn": None,
                        "assetBasePath": "assets/lakeside-inn/",
                        "children": [
                            {
                                "childId": "child-folio-priya-raman",
                                "childDisplayName": "Folio LI-20417 — Priya Raman (Pages 1–2)",
                                "pages": [1, 2],
                                "status": "needs_review",
                                "publishStatus": "not_published",
                                "components": child_1_components
                            },
                            {
                                "childId": "child-folio-daniel-okafor",
                                "childDisplayName": "Folio LI-20433 — Daniel Okafor (Page 3)",
                                "pages": [3],
                                "status": "needs_review",
                                "publishStatus": "not_published",
                                "components": child_2_components
                            }
                        ]
                    }
                ]
            },
            {
                "id": "apex-invoice",
                "name": "Apex Global Solutions B2B Invoice",
                "category": "Commercial Invoicing & Accounts Payable",
                "documentType": "Commercial Tax Invoice",
                "description": "Clean 1-page B2B digital invoice demonstrating critical field compliance guardrails ($14,850.00 total & bank IBAN), format date normalization, missing purchase order, and line-item quantity mismatch.",
                "totalFiles": 1,
                "splitChildrenCount": 1,
                "files": [
                    {
                        "fileId": "file-apex-inv-0847",
                        "fileName": "Apex_Invoice_INV-2026-0847.pdf",
                        "fileDisplayName": "Apex_Invoice_INV-2026-0847.pdf (1 Page)",
                        "pageCount": 1,
                        "status": "needs_review",
                        "publishStatus": "not_published",
                        "lastPublishedOn": None,
                        "assetBasePath": "assets/apex-invoice/",
                        "children": [
                            {
                                "childId": "child-apex-inv-0847",
                                "childDisplayName": "Invoice INV-2026-0847 — Meridian Logistics",
                                "pages": [1],
                                "status": "needs_review",
                                "publishStatus": "not_published",
                                "components": apex_components
                            }
                        ]
                    }
                ]
            }
        ]
    }

    output_path = BASE_DIR / "demo/js/mockData.js"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    js_content = f"// Automatically generated mock data for ConsensusIDP Interactive Demo\n// Contains recorded illustrative model extractions from Claude Sonnet 4.5 and GPT-4o\n\nwindow.DEMO_DATA = {json.dumps(data, indent=2)};\n"
    output_path.write_text(js_content, encoding="utf-8")
    print(f"Successfully generated {output_path} ({len(js_content)} bytes)")


if __name__ == "__main__":
    build_mock_data()
