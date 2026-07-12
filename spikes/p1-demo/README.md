# Phase 1 editor extension demo

Build the repo, then serve its root with any static file server and open
`/spikes/p1-demo/`. The page uses `packages/core/dist/qirtaas.umd.js` and
`qirtaas.css`, mounts inline JSON with autosave disabled, and turns the status
bar green when the custom TipTap extension's `onCreate` hook runs.

The custom extension is imported from esm.sh because the Qirtaas UMD bundle
does not expose TipTap's `Extension` constructor. No application backend or
document ID is used.
