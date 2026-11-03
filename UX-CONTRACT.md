# Sky Explorer UI behavior contract

Sources: PRODUCT.md (V1.0 semantics), user-confirmed V1.1-PLAN.md (changes). No accounts, payments, external writes or destructive data controls.

| Capability | Canonical owner | Contract | Verification |
| --- | --- | --- | --- |
| Navigation | src/app.js | Keep six views and existing entry points; stop voice when leaving a view | Browser flow + regression |
| Voice/status | src/services/speech.js, #speech-status | One active queue, cancellation invalidates old callbacks; bounded startup/error recovery; manual speaker always available on questions | Fake speech callbacks + browser; real iPhone pending |
| Storage/status | src/services/storage.js, #storage-status | Preserve V1 key/shape/word indices; backup malformed original before any overwrite; failed backup/write is visible and retryable | regression.cjs |
| Updates | src/services/pwa.js, #update-status | Explicit update acceptance outside Quiz, reload only after accepting, no localStorage deletion | SW tests + real upgrade pending |
| Feedback | src/app.js and shared CSS | Wrong answer allows retry without revealing correct text; score records first response only; correct answer locks; finish once | regression + 12-question browser completion |
| Scrollbar | styles/app.css | Native system scrollbar remains visible/operable; natural document scroll, no hidden overflow | Narrow browser |

No custom modal, form, select, date picker, table or CRUD interface is introduced. Inline service messages use status regions, not browser alerts. They explain recovery without falsely claiming persistence or offline voice. The visual stage must keep feedback and button geometry stable, provide non-color feedback and respect reduced motion.

Existing behavior for clicking the Quiz navigation restarts the round; adding a restart confirmation is an optional later change, not silently included in the foundation stage. Refresh restarts an incomplete round but preserves saved vocabulary, misses and completed sessions. No data deletion or reset action is added.
