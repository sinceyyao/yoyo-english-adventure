---
version: alpha
name: "Yoyo Sky Explorer"
description: "A calm sky picture-book learning experience for ages five to six"
colors:
  primary: "#7568D9"
  text: "#263354"
  background: "#F4F8FF"
  surface: "#FFFFFF"
  soft: "#E9E8FF"
  error: "#FF9A9A"
typography:
  sans:
    fontFamily: "ui-rounded, 'Arial Rounded MT Bold', system-ui, -apple-system, sans-serif"
rounded:
  button: "17px"
  card: "30px"
spacing:
  page-max: "520px"
  page-padding: "18px"
components:
  button:
    backgroundColor: "{colors.primary}"
  card:
    textColor: "{colors.text}"
  secondary-button:
    backgroundColor: "{colors.soft}"
---

# Sky Explorer design context

## Overview

Product UI for Yoyo, aged5～6, iPhone portrait first, desktop compatible. Source: PRODUCT.md and the confirmed V1.1-PLAN.md. The current implementation retains V1.0 appearance during foundation/voice work. The six-word concept board is a review artifact, not production imagery.

Approved direction: fresh sky blue with pale lavender and warm yellow, soft light surfaces, large round cards and subtle shadows, recognizable cartoon illustrations, restrained feedback. Avoid noisy animation, competition and unnecessary decoration. English learning content remains English; a full Chinese navigation conversion is not approved.

Runtime token owner: `styles/app.css :root`. The frontmatter mirrors the current baseline, not the future palette. `primary→--color-primary`, `text→--color-text`, `background→--color-background`, `surface→--color-surface`, `soft→--color-soft`, `success→--color-success`, `error→--color-error`. Surface white remains legacy CSS in some consumers; unify consumers with the visual stage. Future palette changes must update this document and the shared CSS together.

## Colors

Current values above preserve the V1.0 baseline. The legacy success border is `--color-success: #42C49C`; it is an outline-only role recorded here, not a component text/background token. Feedback uses text and shape as well as color. Approved target palette and contrast measurements will be finalized with the visual preview, not inferred from the generated board.

## Typography

Current rounded system stack avoids downloaded-font dependencies. Maintain legible long words and system Chinese fallback when needed. Existing title25px, card word35px, buttons16px are baseline values, not final mobile accessibility evidence.

## Layout

Current max width520px, padding18px, two-column Quiz choices and safe-area-aware fixed bottom navigation. Reserve the speech status region to avoid shifting answer positions as audio starts/stops. Preserve document scrolling on short screens; no horizontal page overflow. Larger artwork and compact phone geometry remain the next visual stage.

## Elevation & Depth

White cards with light blue-tinted shadows; avoid heavy layers and glass effects beyond the existing navigation surface. Learning objects carry the visual hierarchy.

## Shapes

Current button17px, flashcard30px and choice22px radii mirror the baseline. Do not invent a separate style for service feedback.

## Components

Shared owners: CSS for controls; `speech.js` for all audio state; `storage.js` for progress persistence; `pwa.js` for updates. See UX-CONTRACT.md. Native buttons remain keyboard-operable with visible focus; voice status uses a live region; inline retry and update actions replace blocking browser dialogs. Motion respects prefers-reduced-motion. New illustration buttons must have accessible names and should not cause feedback geometry jumps.

## Do's and Don'ts

- Do share each word illustration across learning, Quiz and review once approved.
- Do preserve the existing word order and historical score semantics.
- Do distinguish the hot air balloon basket from the blimp gondola.
- Don't describe explored words as mastered words or follow-along as speech assessment.
- Don't replace all production images with unapproved concept-board crops.
