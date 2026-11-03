---
version: alpha
name: "Yoyo Sky Explorer V1.1"
description: "A calm sky picture-book adventure with original gouache illustrations for ages five to six"
colors:
  primary: "#3268B7"
  text: "#263754"
  background: "#EFF7FD"
  surface: "#FFFFFF"
  soft: "#ECE8FB"
  lavender: "#665592"
  muted: "#5D6D85"
  success: "#287756"
  error: "#A75155"
typography:
  sans:
    fontFamily: "ui-rounded, 'Arial Rounded MT Bold', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
rounded:
  button: "17px"
  card: "26px"
spacing:
  page-max: "520px"
  page-padding: "18px"
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
  secondary-button:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.lavender}"
  hint:
    textColor: "{colors.muted}"
  success-feedback:
    textColor: "{colors.success}"
  error-hint:
    textColor: "{colors.error}"
---

# Sky Explorer design context

## Overview

Product register: a family English-learning app for Yoyo, aged5～6; iPhone portrait first, desktop compatible. Source: PRODUCT.md, confirmed V1.1-PLAN.md and the user's explicit approval of artifacts/sky-style-board.png. This is a learning interface, with child-friendly visual actions and a quiet parent summary, not a promotional landing page.

North Star: a fresh sky observation picture book. Original rounded gouache illustrations are the memorable feature; white cards and concise controls give them space. Sky blue leads, pale lavender groups secondary actions, warm yellow rewards discovery. Avoid talking faces on weather objects, busy scenery, ranking, competitive grading, flashing confetti and looping decoration. A recognizable bat's natural eye/mouth is allowed.

English words, sentences and short navigation labels remain English. Icons and audio reduce reading dependence. Do not silently convert navigation to Chinese. Market distribution is currently the user's family; no broader market or curriculum validation is claimed.

## Colors

The frontmatter mirrors current shared runtime colors. `--color-yellow: #FFDA7B` is an illustration/reward accent; it is not a small-text foreground. Success also has a check/star and copy; errors show a retry symbol and neutral encouragement. White-on-primary and muted-on-white contrast are checked separately from illustration colors. Secondary surfaces use soft lavender, not a second competing primary color. No dark theme is introduced. Forced colors preserve system control boundaries; artwork retains original colors.

## Typography

Rounded local/system font stack is owned by `--font`, avoiding network font swaps. Homepage title35px on short phones,38px normally,43px on desktop; page titles23px, word labels25～34px, questions16～21px depending on level/height. Ordinary child actions use14～16px; parent metadata10～13px is secondary, never required to answer a Quiz. Long words may wrap without clipping. Child instructions can always be heard. Inline English titles use sentence case; small uppercase eyebrows only label the theme/level.

## Layout

`--page-max:520px`, `--page-padding:18px`;12px side padding at widths≤340px,26px at desktop≥550px. Natural document scrolling remains available. The four-item bottom navigation includes safe-area padding and root bottom clearance. No application-owned content is trapped in a viewport with hidden overflow.

One word card at a time: large tappable illustration, word, sentence, independent sentence audio, group8/12 and progress, Previous/Next. Image height adapts to short phones so the primary controls fit; extremely short views may scroll. Quiz uses a2×2 answer grid. Media boxes, voice hint and answer feedback reserve geometry so playback and wrong/correct states do not move the Next button.

## Elevation & Depth

White cards use a single light blue shadow `--shadow:0 6px 24px #365d8710`. Hero uses a pale sky oval with composed sun/cloud/rainbow illustrations. Avoid deep stacked shadows or blur over reading content. Navigation has only a subtle separating border/shadow. Parent statistics and review cards reuse the same surface grammar.

## Shapes

Shared primary button radius17px; flashcard26px. Answer cards23px, small audio controls14px and nav cells16px are deliberate size variants. Main actions48～56px high; other standalone controls at least44px. The small speaker circle inside artwork is not a separate undersized target: the whole picture is the button.

## Components

Runtime token owner (Model B): `styles/app.css :root` → shared CSS classes → render helpers in `src/app.js`. DESIGN.md mirrors these values; there is no generated theme package or duplicated framework adapter.

| Contract | Runtime owner | Consumers |
| --- | --- | --- |
| colors primary/text/background/surface/soft/lavender/muted/success/error | corresponding `--color-*` variables | buttons, cards, labels, hints, answer feedback |
| typography.sans | `--font` | app and inherited button typography |
| rounded.button / card | `--radius-button` / `--radius-card` | .button / .flash and empty state |
| spacing.page-max / page-padding | `--page-max` / `--page-padding` | app, navigation, service banners; responsive padding variants are documented above |
| audio state | services/speech.js + showSpeechStatus | word-picture button, sentence, question, feedback and review |
| artwork | art() + assets/illustrations/*.webp | all six views; no screen-local duplicate assets |

Native buttons have pointer/hover, visible keyboard focus, pressed/disabled states and accessible names. Delegated data-action events avoid inline quoted word/sentence handlers. Route headings and Next preserve keyboard continuity after view replacement; pictorial answers have English accessible names while visual text is absent before success. No custom modal, form, table or select is introduced. See UX-CONTRACT.md for behaviors.

Global voice live region is visually hidden; per-view hints reserve a short line and speaker controls show the playing state. Recoverable audio failure offers the existing visible manual button. Storage and update banners remain explicit. An image-error placeholder retains the original emoji and fixed media box; revisiting a card retries the image request.

Motion is brief and interruptible:380ms star pop once per correct answer and500ms completion star. No flashing, timed competition or ongoing background animation. prefers-reduced-motion disables transitions/animations. Global standard and WebKit scrollbar styling stays visible and resets to system in forced colors.

## Do's and Don'ts

- Do use the same original word image in learning, questions, scene compositions and review.
- Do show two clouds for the plural clouds question, without altering the cloud word card or answer index.
- Do distinguish a hot air balloon's basket from the horizontal blimp's gondola and fins.
- Do keep first-try score and explored-word counts honest; neither is a mastery assessment.
- Don't add labels inside generated images, or crop the concept board into production assets.
- Don't force reload during a Quiz or clear progress to make a design update work.
