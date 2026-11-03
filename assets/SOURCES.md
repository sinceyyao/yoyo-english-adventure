# Asset provenance

- `../icon.svg`: existing repository-provided V1.0 logo, retained unchanged.
- `icons/icon-192.png`, `icons/icon-512.png`, `icons/apple-touch-icon.png`: raster exports of that SVG at192/512/180px using the environment-provided Sharp library; not a runtime dependency.
- `icons/maskable.svg`: repository logo scaled into a full-bleed sky-blue square for a safe maskable inset; `icons/maskable-512.png` is its512px export.
- `../artifacts/sky-style-board.png`: original concept board generated with the built-in imagegen tool on2026-11-03. Preview only; not loaded by the app or treated as production word assets. Prompt is recorded in `../artifacts/style-board-prompt.txt`.

No external third-party illustrations were copied or added. Production artwork and final device icon rendering remain to be reviewed.
