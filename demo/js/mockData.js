// Automatically generated mock data for ConsensusIDP Interactive Demo
// Contains recorded illustrative model extractions from Claude Sonnet 4.5 and GPT-4o

window.DEMO_DATA = {
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
          "lastPublishedOn": null,
          "assetBasePath": "assets/lakeside-inn/",
          "children": [
            {
              "childId": "child-folio-priya-raman",
              "childDisplayName": "Folio LI-20417 \u2014 Priya Raman (Pages 1\u20132)",
              "pages": [
                1,
                2
              ],
              "status": "needs_review",
              "publishStatus": "not_published",
              "components": [
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Lakeside Inn & Conference Center",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Lakeside Inn & Conference Center",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Lakeside Inn & Conference Center",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.0316,
                        "w": 0.5882,
                        "h": 0.0253,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "LI-20417",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "LI-20417",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "LI-20417",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.7222,
                        "y": 0.0341,
                        "w": 0.219,
                        "h": 0.0227,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "2026-03-02",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2026-03-02",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "2026-03-02",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.1616,
                        "w": 0.1144,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "2026-03-06",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2026-03-06",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "2026-03-06",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.1793,
                        "w": 0.1144,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "needs_review",
                      "reviewReason": "mismatch",
                      "selectedValue": "412 / 518",
                      "discrepancyNote": "Guest changed rooms mid-stay. Model A extracted initial room 412; Model B extracted second room 518.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "412",
                          "confidence": "Medium"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "518",
                          "confidence": "Medium"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.197,
                        "w": 0.2288,
                        "h": 0.0177,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Stay Panel",
                        "modelAgreement": "mismatch",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c1-late-checkout",
                      "fieldName": "late_checkout_time",
                      "label": "Late Checkout Time",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "missing",
                      "selectedValue": null,
                      "discrepancyNote": "Field not present in document. Both models correctly agree on null.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": null,
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": null,
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": null,
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
                      "critical": true,
                      "reviewStatus": "needs_review",
                      "reviewReason": "mismatch",
                      "selectedValue": "1022.35",
                      "discrepancyNote": "CRITICAL FIELD: Model A captured gross charges ($1,222.35) omitting advance deposit. Model B captured net payable balance ($1,022.35).",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "1222.35",
                          "confidence": "Medium"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "1022.35",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.4967,
                        "y": 0.4533,
                        "w": 0.4248,
                        "h": 0.0253,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Summary Box",
                        "modelAgreement": "mismatch",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c1-payment-method",
                      "fieldName": "payment_method",
                      "label": "Payment Method",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Deposit: Bank Wire; Balance: Mastercard ending 2291",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Deposit: Bank Wire; Balance: Mastercard ending 2291",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Deposit: Bank Wire; Balance: Mastercard ending 2291",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0752,
                        "y": 0.428,
                        "w": 0.3431,
                        "h": 0.0202,
                        "page": 2
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Priya Raman",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Priya Raman",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Priya Raman",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.1928,
                        "y": 0.1616,
                        "w": 0.1634,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "88 Maple Street, Springfield, IL 62704",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "88 Maple Street, Springfield, IL 62704",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "88 Maple Street, Springfield, IL 62704",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.1928,
                        "y": 0.1793,
                        "w": 0.2778,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "needs_review",
                      "reviewReason": "low_confidence",
                      "selectedValue": "(217) 555-0198",
                      "discrepancyNote": "Low-confidence visual extraction due to coffee stain overlaying phone digits. Both models extracted correctly, but flagged below confidence threshold.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "(217) 555-0198",
                          "confidence": "Low"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "(217) 555-0198",
                          "confidence": "Low"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.1928,
                        "y": 0.2134,
                        "w": 0.1389,
                        "h": 0.0177,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Guest Panel",
                        "modelAgreement": "match",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c1-guest-email",
                      "fieldName": "guest_email",
                      "label": "Guest Email",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "priya.raman@example.com",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "priya.raman@example.com",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "priya.raman@example.com",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.335,
                        "y": 0.2134,
                        "w": 0.2042,
                        "h": 0.0177,
                        "page": 1
                      },
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
                  "cells": [
                    {
                      "cellId": "c1-charge-1-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 0,
                      "colName": "description",
                      "label": "#1 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Room Charge \u2014 Deluxe King, Room 412",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Room Charge \u2014 Deluxe King, Room 412",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Room Charge \u2014 Deluxe King, Room 412",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.2866,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 1",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-1-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 0,
                      "colName": "amount",
                      "label": "#1 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "189.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "189.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "189.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.2866,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 1",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-2-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 1,
                      "colName": "description",
                      "label": "#2 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Valet Parking Overnight",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3106,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 2",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-2-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 1,
                      "colName": "amount",
                      "label": "#2 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "25.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "25.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "25.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3106,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 2",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-3-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 2,
                      "colName": "description",
                      "label": "#3 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Breakfast Buffet \u2014 Harbor Restaurant",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3346,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 3",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-3-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 2,
                      "colName": "amount",
                      "label": "#3 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "36.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "36.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "36.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3346,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 3",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-4-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 3,
                      "colName": "description",
                      "label": "#4 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Room Charge \u2014 Deluxe King, Room 412",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Room Charge \u2014 Deluxe King, Room 412",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Room Charge \u2014 Deluxe King, Room 412",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3586,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 4",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-4-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 3,
                      "colName": "amount",
                      "label": "#4 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "189.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "189.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "189.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3586,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 4",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-5-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 4,
                      "colName": "description",
                      "label": "#5 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Valet Parking Overnight",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3826,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 5",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-5-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 4,
                      "colName": "amount",
                      "label": "#5 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "25.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "25.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "25.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.3826,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 5",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-6-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 5,
                      "colName": "description",
                      "label": "#6 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Minibar Refreshment Restock",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Minibar Refreshment Restock",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Minibar Refreshment Restock",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4066,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 6",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-6-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 5,
                      "colName": "amount",
                      "label": "#6 Amount",
                      "dataType": "DECIMAL",
                      "critical": true,
                      "reviewStatus": "needs_review",
                      "reviewReason": "mismatch",
                      "selectedValue": "14.00",
                      "discrepancyNote": "HANDWRITTEN OVERRIDE: Model A extracted struck-out printed rate ($21.00); Model B extracted handwritten correction ($14.00).",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "21.00",
                          "confidence": "Low"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "14.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4066,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 6",
                        "modelAgreement": "mismatch",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c1-charge-7-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 6,
                      "colName": "description",
                      "label": "#7 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Room Charge \u2014 Deluxe King, Room 518",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Room Charge \u2014 Deluxe King, Room 518",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Room Charge \u2014 Deluxe King, Room 518",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4306,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 7",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-7-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 6,
                      "colName": "amount",
                      "label": "#7 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "189.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "189.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "189.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4306,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 7",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-8-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 7,
                      "colName": "description",
                      "label": "#8 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Breakfast Buffet \u2014 Harbor Restaurant",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4545,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 8",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-8-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 7,
                      "colName": "amount",
                      "label": "#8 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "36.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "36.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "36.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4545,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 8",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-9-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 8,
                      "colName": "description",
                      "label": "#9 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Valet Parking Overnight",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4785,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 9",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-9-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 8,
                      "colName": "amount",
                      "label": "#9 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "25.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "25.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "25.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.4785,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 9",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-10-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 9,
                      "colName": "description",
                      "label": "#10 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Express Laundry & Dry Cleaning",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Express Laundry & Dry Cleaning",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Express Laundry & Dry Cleaning",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.5025,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 10",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-10-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 9,
                      "colName": "amount",
                      "label": "#10 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "18.50",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "18.50",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "18.50",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.5025,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 10",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-11-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 10,
                      "colName": "description",
                      "label": "#11 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Room Charge \u2014 Deluxe King, Room 518",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Room Charge \u2014 Deluxe King, Room 518",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Room Charge \u2014 Deluxe King, Room 518",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.5265,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 11",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-11-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 10,
                      "colName": "amount",
                      "label": "#11 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "189.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "189.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "189.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.5265,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P1",
                        "pageRef": "Page 1, Row 11",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-12-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 11,
                      "colName": "description",
                      "label": "#12 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Spa Haven \u2014 60 Min Deep Tissue Massage",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Spa Haven \u2014 60 Min Deep Tissue Massage",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Spa Haven \u2014 60 Min Deep Tissue Massage",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.154,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 12",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-12-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 11,
                      "colName": "amount",
                      "label": "#12 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "110.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "110.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "110.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.154,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 12",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-13-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 12,
                      "colName": "description",
                      "label": "#13 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "In-Room Dining Dinner & Beverage",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "In-Room Dining Dinner & Beverage",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "In-Room Dining Dinner & Beverage",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.178,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 13",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-13-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 12,
                      "colName": "amount",
                      "label": "#13 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "47.80",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "47.80",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "47.80",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.178,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 13",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-14-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 13,
                      "colName": "description",
                      "label": "#14 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Valet Parking Overnight",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Valet Parking Overnight",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.202,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 14",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-14-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 13,
                      "colName": "amount",
                      "label": "#14 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "25.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "25.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "25.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.202,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 14",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-15-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 14,
                      "colName": "description",
                      "label": "#15 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Breakfast Buffet \u2014 Harbor Restaurant",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Breakfast Buffet \u2014 Harbor Restaurant",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.226,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 15",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-15-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 14,
                      "colName": "amount",
                      "label": "#15 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "36.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "36.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "36.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.226,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 15",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-16-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 15,
                      "colName": "description",
                      "label": "#16 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Guest Goodwill Credit \u2014 HVAC Service Issue",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Guest Goodwill Credit \u2014 HVAC Service Issue",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Guest Goodwill Credit \u2014 HVAC Service Issue",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.25,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 16",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-16-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 15,
                      "colName": "amount",
                      "label": "#16 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "-50.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "-50.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "-50.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.25,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 16",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-17-desc",
                      "fieldName": "charge_description",
                      "rowIndex": 16,
                      "colName": "description",
                      "label": "#17 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Late Charge \u2014 Minibar Water & Almonds",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Late Charge \u2014 Minibar Water & Almonds",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Late Charge \u2014 Minibar Water & Almonds",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.274,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 17",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    },
                    {
                      "cellId": "c1-charge-17-amt",
                      "fieldName": "charge_amount",
                      "rowIndex": 16,
                      "colName": "amount",
                      "label": "#17 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "12.00",
                      "discrepancyNote": null,
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "12.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "12.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.274,
                        "w": 0.8824,
                        "h": 0.0227,
                        "page": 2
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20417-P2",
                        "pageRef": "Page 2, Row 17",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-07T08:14:22Z"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "childId": "child-folio-daniel-okafor",
              "childDisplayName": "Folio LI-20433 \u2014 Daniel Okafor (Page 3)",
              "pages": [
                3
              ],
              "status": "needs_review",
              "publishStatus": "not_published",
              "components": [
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Lakeside Inn & Conference Center",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Lakeside Inn & Conference Center",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Lakeside Inn & Conference Center",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0588,
                        "y": 0.0316,
                        "w": 0.5882,
                        "h": 0.0253,
                        "page": 3
                      },
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
                      "critical": false,
                      "reviewStatus": "needs_review",
                      "reviewReason": "mismatch",
                      "selectedValue": "LI-20433",
                      "discrepancyNote": "Smudged digit in folio header. Model A extracted 'LI-20483'; Model B correctly extracted 'LI-20433'.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "LI-20483",
                          "confidence": "Medium"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "LI-20433",
                          "confidence": "Medium"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.7222,
                        "y": 0.0341,
                        "w": 0.219,
                        "h": 0.0227,
                        "page": 3
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Header Right",
                        "modelAgreement": "mismatch",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c2-check-in",
                      "fieldName": "check_in_date",
                      "label": "Check-in Date",
                      "dataType": "DATE",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "2026-03-10",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2026-03-10",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "2026-03-10",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.1616,
                        "w": 0.1144,
                        "h": 0.0177,
                        "page": 3
                      },
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
                      "critical": false,
                      "reviewStatus": "needs_review",
                      "reviewReason": "low_confidence",
                      "selectedValue": "2026-03-12",
                      "discrepancyNote": "Low-confidence extraction caused by red 'PAID' stamp occluding the checkout date text. Both models read 2026-03-12 correctly.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2026-03-12",
                          "confidence": "Low"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "2026-03-12",
                          "confidence": "Low"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.1793,
                        "w": 0.1144,
                        "h": 0.0177,
                        "page": 3
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Stay Panel (under stamp)",
                        "modelAgreement": "match",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "c2-total-due",
                      "fieldName": "total_amount_due",
                      "label": "Total Settled Amount",
                      "dataType": "DECIMAL",
                      "critical": true,
                      "reviewStatus": "needs_review",
                      "reviewReason": "critical",
                      "selectedValue": "485.50",
                      "discrepancyNote": "CRITICAL FIELD: Both models match on $485.50 (High confidence). Flagged for mandatory reviewer verification before warehouse publishing.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "485.50",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "485.50",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.4967,
                        "y": 0.4886,
                        "w": 0.4248,
                        "h": 0.0227,
                        "page": 3
                      },
                      "lineage": {
                        "documentId": "DOC-FOLIO-20433-P3",
                        "pageRef": "Page 3, Summary Box",
                        "modelAgreement": "match",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    }
                  ]
                }
              ]
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
          "lastPublishedOn": null,
          "assetBasePath": "assets/apex-invoice/",
          "children": [
            {
              "childId": "child-apex-inv-0847",
              "childDisplayName": "Invoice INV-2026-0847 \u2014 Meridian Logistics",
              "pages": [
                1
              ],
              "status": "needs_review",
              "publishStatus": "not_published",
              "components": [
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Apex Global Solutions Inc.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Apex Global Solutions Inc.",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Apex Global Solutions Inc.",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.0278,
                        "w": 0.5229,
                        "h": 0.0303,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "INV-2026-0847",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "INV-2026-0847",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "INV-2026-0847",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6732,
                        "y": 0.0606,
                        "w": 0.2614,
                        "h": 0.0202,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Meridian Logistics Corporation",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Meridian Logistics Corporation",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Meridian Logistics Corporation",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0817,
                        "y": 0.1806,
                        "w": 0.2941,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "2026-03-15",
                      "discrepancyNote": "Normalized Match: Model A extracted ISO format '2026-03-15'; Model B extracted EU format '15/03/2026'. Calendar date parsed identically.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2026-03-15",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "15/03/2026",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.1806,
                        "w": 0.2124,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "missing",
                      "selectedValue": null,
                      "discrepancyNote": "Document omitted customer PO number ('\u2014 None Provided'). Both models agree on null.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": null,
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": null,
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.6667,
                        "y": 0.2159,
                        "w": 0.1797,
                        "h": 0.0177,
                        "page": 1
                      },
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
                      "critical": true,
                      "reviewStatus": "needs_review",
                      "reviewReason": "critical",
                      "selectedValue": "14850.00",
                      "discrepancyNote": "CRITICAL FIELD: Both models match on $14,850.00 (High confidence). Flagged for mandatory human authorization before general ledger export.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "14850.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "14850.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.5359,
                        "y": 0.5821,
                        "w": 0.384,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Summary Box",
                        "modelAgreement": "match",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "ap-bank-iban",
                      "fieldName": "bank_iban",
                      "label": "Remittance Account / IBAN",
                      "dataType": "VARCHAR",
                      "critical": true,
                      "reviewStatus": "needs_review",
                      "reviewReason": "critical",
                      "selectedValue": "US89-FCBT-0111-0000-2591-84",
                      "discrepancyNote": "CRITICAL COMPLIANCE GUARD: Wire bank account number requires human sign-off to prevent invoice payment diversion attacks.",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "US89-FCBT-0111-0000-2591-84",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "US89-FCBT-0111-0000-2591-84",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0817,
                        "y": 0.5997,
                        "w": 0.384,
                        "h": 0.0202,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Wire Instructions Box",
                        "modelAgreement": "match",
                        "reviewerId": null,
                        "reviewedAt": null
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
                    {
                      "cellId": "ap-li-0-desc",
                      "fieldName": "description",
                      "rowIndex": 0,
                      "colName": "description",
                      "label": "Item 1 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Enterprise Cloud Infrastructure \u2014 Managed Tier",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Enterprise Cloud Infrastructure \u2014 Managed Tier",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Enterprise Cloud Infrastructure \u2014 Managed Tier",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3056,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 1",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-0-amt",
                      "fieldName": "amount",
                      "rowIndex": 0,
                      "colName": "amount",
                      "label": "Item 1 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "4500.00",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "4500.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "4500.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3056,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 1",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-1-desc",
                      "fieldName": "description",
                      "rowIndex": 1,
                      "colName": "description",
                      "label": "Item 2 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Data Pipeline Engineering & Integration Architecture",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Data Pipeline Engineering & Integration Architecture",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Data Pipeline Engineering & Integration Architecture",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3346,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 2",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-1-amt",
                      "fieldName": "amount",
                      "rowIndex": 1,
                      "colName": "amount",
                      "label": "Item 2 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "5250.00",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "5250.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "5250.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3346,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 2",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-2-desc",
                      "fieldName": "description",
                      "rowIndex": 2,
                      "colName": "description",
                      "label": "Item 3 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Tier-3 Enterprise API Gateway Access License",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Tier-3 Enterprise API Gateway Access License",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Tier-3 Enterprise API Gateway Access License",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3636,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 3",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-2-qty",
                      "fieldName": "quantity",
                      "rowIndex": 2,
                      "colName": "quantity",
                      "label": "Item 3 Quantity",
                      "dataType": "INTEGER",
                      "critical": false,
                      "reviewStatus": "needs_review",
                      "reviewReason": "mismatch",
                      "selectedValue": "2",
                      "discrepancyNote": "Model A extracted quantity '2 units'; Model B hallucinated '3 units'. Extracted unit rate is $1,200.00 (Total = $2,400.00 confirms 2 units).",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "3",
                          "confidence": "Medium"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3636,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 3 Qty",
                        "modelAgreement": "mismatch",
                        "reviewerId": null,
                        "reviewedAt": null
                      }
                    },
                    {
                      "cellId": "ap-li-2-amt",
                      "fieldName": "amount",
                      "rowIndex": 2,
                      "colName": "amount",
                      "label": "Item 3 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "2400.00",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "2400.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "2400.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3636,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 3 Total",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-3-desc",
                      "fieldName": "description",
                      "rowIndex": 3,
                      "colName": "description",
                      "label": "Item 4 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Automated Security Audit & SOC-2 Continuous Monitoring",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Automated Security Audit & SOC-2 Continuous Monitoring",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Automated Security Audit & SOC-2 Continuous Monitoring",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3927,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 4",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-3-amt",
                      "fieldName": "amount",
                      "rowIndex": 3,
                      "colName": "amount",
                      "label": "Item 4 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "1500.00",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "1500.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "1500.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.3927,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 4",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-4-desc",
                      "fieldName": "description",
                      "rowIndex": 4,
                      "colName": "description",
                      "label": "Item 5 Description",
                      "dataType": "VARCHAR",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "Priority 24/7 Production Support Retainer",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "Priority 24/7 Production Support Retainer",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "Priority 24/7 Production Support Retainer",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.4217,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 5",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    },
                    {
                      "cellId": "ap-li-4-amt",
                      "fieldName": "amount",
                      "rowIndex": 4,
                      "colName": "amount",
                      "label": "Item 5 Amount",
                      "dataType": "DECIMAL",
                      "critical": false,
                      "reviewStatus": "approved",
                      "reviewReason": "match",
                      "selectedValue": "1200.00",
                      "extractions": [
                        {
                          "modelId": "Claude Sonnet 4.5",
                          "value": "1200.00",
                          "confidence": "High"
                        },
                        {
                          "modelId": "GPT-4o",
                          "value": "1200.00",
                          "confidence": "High"
                        }
                      ],
                      "boundingBox": {
                        "x": 0.0654,
                        "y": 0.4217,
                        "w": 0.8693,
                        "h": 0.0278,
                        "page": 1
                      },
                      "lineage": {
                        "documentId": "DOC-APEX-0847-P1",
                        "pageRef": "Page 1, Line Item 5",
                        "modelAgreement": "match",
                        "reviewerId": "SYSTEM_CONSENSUS",
                        "reviewedAt": "2026-03-16T11:05:40Z"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
