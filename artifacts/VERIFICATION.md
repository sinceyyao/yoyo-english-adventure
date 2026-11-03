# V1.1 foundation and voice checkpoint — 2026-11-03

Branch: feature/sky-ui-v1.1. Not a V1.1 release or production deployment.

## Implemented

- Extracted classic deferred scripts and shared stylesheet without a build tool. Deliberately retained global app handlers so the existing inline events keep working; future conversion to ES Modules must also migrate those events.
- Storage key/shape/order unchanged. Valid V1 records are round-tripped unchanged; malformed originals are backed up before overwrite, backup failure blocks overwrite, save failure is visible/retryable.
- Word artwork area is now a native play button (still emoji pending art approval). Manual sentence audio remains separate.
- New questions attempt automatic reading, with repeat buttons and startup/error fallback. Retry renders do not retrigger questions. Correct answers queue “Great job!” and a sentence; Level 3 uses the full original sentence and adds a clear Tap instruction when asking.
- Wrong choices no longer reveal all word labels. First-try semantics retained. Finish guard avoids duplicate completion; result includes first-try percent.
- Project/version-scoped cache, waiting-worker acceptance outside Quiz, safe-context localhost registration, current-cache lookup, project-only cleanup, offline missing-resource503, PNG/Apple/maskable assets.

## Executed checks

1. Modern Node: `node tests/regression.cjs` —12 groups passed. Includes20-word order,12 answer mappings, all cards tracked,12/12 and11/12, repeat errors, no wrong-answer labels, once-only completion, old progress round-trip, malformed/partial backup, quota failure, denied storage, audio sequence/stale callbacks, SW resource existence/current lookup/waiting/cleanup/subpath and offline failure. DOM/voice/cache are stubs: this is logic evidence, not a real device.
2. `git diff --check` — passed.
3. Frontend premium strict static audit —0 findings; JSON in premium-audit.json. This is static evidence only, not accessibility certification.
4. In-app desktop browser at375×667: baseline old page worked; new page automatic speech showed Listening state; first question wrong choice kept correct answer/word labels hidden; all12 questions completed, giving11/12 and92%. Refresh then opened Progress:1 session, average/best11/12, sun error count1 and original seen word preserved. Console error/warn collection returned empty. A subsequent foundation-worker update was offered in the browser: clicking Update during Quiz preserved the question and showed a finish-first message; returning Home and accepting activated the worker and reloaded with the completed session retained. This proves the local foundation→foundation update flow, not the legacy V1.0 installed-app transition. Browser width check showed no horizontal overflow on the tested retry page.

Screenshots:
- v1-baseline-learn.png — old V1 page before reload.
- v1.1-retry-mobile.png — wrong-answer state; original layout still needs visual-stage compaction/scroll verification.
- v1.1-result-mobile.png —11/12 result.
- v1.1-progress-mobile.png — persisted result after reload.
- v1.1-word-audio-mobile.png — clicking the word artwork button starts speech in the desktop browser; not an iPhone audio test.

## Review checkpoint

sky-style-board.png is a single original six-word picture-book concept board made using built-in imagegen, not production assets. It is not loaded by the app, does not replace twenty cards and is not a licensed third-party image. Prompt/provenance are retained. Approve style before generating separate production illustrations and applying the full visual design, per the confirmed staged plan.

## Remaining acceptance

- Full20-word art set, homepage/word-card visual preview, all six views, compact phone geometry, restrained star animation, final parent result summary and tactile/keyboard layout regression.
- Real iPhone Safari and home-screen installed app: first/next/repeat speech, interrupted audio, silent/volume/network conditions, actual voice output and icon crop. Desktop browser speaking-start state cannot prove these.
- Real offline navigation and V1.0→V1.1 upgrade in a normal browser with old cache. During the first upgrade V1.0 cannot display the new update UI: close all app tabs/standalone windows so a waiting worker can activate, then reopen. Never clear learning data as the upgrade mechanism.
- Real GitHub Pages HTTPS deployment. No push/merge/deployment authorized or performed; local子路径/SW tests do not equal a deployed-site pass.
- DESIGN.md external lint is executed with a temporary tool installation; no runtime package was added. Final result:0 errors,0 warnings; saved in design-lint.json.
