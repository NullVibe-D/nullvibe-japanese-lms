# Prototype Instructions

## Accepted product decisions

- Use option 2 lesson workspace with a simplified white/light-blue design.
- English is the default UI language. Sinhala and Japanese are selectable.
- Local prototype and architecture are the delivery scope. Production identity, payments, media and AI require credentials and approval.
- Keep pricing, fixed access duration, live classes and media volume nullable/configurable.
- Use feature/nullvibe-prototype. Do not change production or main branches.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
