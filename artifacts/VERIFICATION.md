# Sky Explorer V1.1 final local verification — 2026-11-03

Branch: feature/sky-ui-v1.1. Local implementation, not an online release. User approved the style board and authorized continuation.

## Delivered

20 original separate transparent512px WebP illustrations,691,200 bytes total, shared across all six views. Prompts/source mapping: illustration-generation.json. No third-party images were copied. Unified blue/lavender/yellow design; separate word/sentence playback, picture Quiz, star feedback and an honest parent summary. Storage key/shape/order and cumulative mistakes preserved. Delegated events replace inline handlers.33 resources are precached, including all20 pictures; pending update prompts are deferred during Quiz.

## Executed checks

- Modern Node: node tests/regression.cjs —14 groups passed. Covers V1 word order and12 answers,20 cards,12/12 and11/12, retries, once-only completion, old-record round-trip, malformed backup/quota/denied storage, timestamp bounds, audio queue/cancellation, illustration existence/mapping/size, update deferral, scoped SW cleanup/current-cache/offline behavior and icons.
- Official designmd lint:0 errors/0 warnings. Premium strict static audit reports2 actionless-button errors at the navigation/answer template lines: false positives because the static scanner recognizes inline onclick but not the root delegated data-action handler. Both navigation and all12 answer flows were exercised in the browser, and the handler exists in src/app.js. No no-op inline handlers were added to silence the scanner. The raw audit is preserved; no claim of a clean static audit or accessibility certification is made.
- Browser on a real local project path /yoyo-english-adventure/ at127.0.0.1:8002:20 word pictures loaded and word/sentence controls invoked;375×667 had no horizontal overflow and word Next controls above the navigation. browser-word-checks.json records every word.
- Two complete12-question browser rounds: first wrong then retry gives11/12 and92%; all first correct gives12/12 and100%. Wrong choice revealed no word label/correct marker and Next stayed disabled.
- Screenshot QA found feedback-height differences and image overflow. Fixed and reran all12 questions: all media boxes contained, no horizontal overflow, Next above navigation even on Level3. See browser-quiz-final-checks.json. One viewport Y difference on Q11 reflects scrolling; use document coordinates rather than viewport coordinates to assess layout movement.
-320×568 long aurora card: no horizontal overflow, sentence control operable, Next above navigation.390×844: home, stats, counts and review checked. Keyboard Tab had solid visible focus; computed root background and scrollbar matched tokens.
- Refresh retained20 explored words, completed11/12 and12/12 sessions, rounded average12/12 (unchanged V1 rule), and sun mistake count1. Review playback controls worked.
- Browser accepted a waiting visual worker outside Quiz and reloaded without losing records. Quiz prompt deferral also has a focused service test.
- Real local offline smoke: stopped only the dedicated8002 test server with Ctrl+C, then successfully reloaded the project-path app. Home, all12 expansion pictures and Progress remained available; both sessions and20 explored words persisted. See browser-offline-checks.json and v1.1-offline-final.png. This proves local app/image offline caching, not offline device TTS.
- git diff --check passed. No runtime dependencies or build pipeline introduced.

## Evidence

Final images: v1.1-home-final.png, v1.1-word-final.png, v1.1-level3-final.png, v1.1-result-final.png, v1.1-progress-final.png, v1.1-review-final.png. Earlier foundation screenshots and browser-quiz-checks.json remain as baseline evidence and can show issues fixed in the final checks.

## Still pending

Real iPhone Safari voice output, autoplay recovery, background/foreground and volume/voice conditions; home-screen installation, device safe areas and icon masking; legacy V1.0 installed-app upgrade; actual GitHub Pages HTTPS publication. Do not infer these from desktop status events or local tests. V1.0 has no update UI: close all project tabs/standalone windows to let a waiting worker activate, without clearing progress. No merge, push, Pages settings or publication was performed.

Normal user preview remains on8000. Dedicated8002 was deliberately stopped for offline verification and is not the user-facing preview address.
