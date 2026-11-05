# NullVibe Japanese LMS

A responsive local frontend based on the selected white/light-blue lesson workspace. English is the default, with Sinhala and Japanese options.

## Run locally

Use Node.js 20.19+ or a compatible current LTS. Run npm ci, then npm run dev -- --host 127.0.0.1 --port 4173 --strictPort.

Open http://127.0.0.1:4173. The first view is the selected N5 lesson design. Use Courses to explore N5/N4, the settings icon for Course studio, and Mentor for guided examples.

## Verification

Run npm run build, npm test, npm run test:qa and npm audit.

The browser QA script supports a QA_BROWSER environment variable containing a local Chromium executable. Its default targets the existing Windows test browser used during this delivery. Install Chromium through Playwright if needed and set QA_BROWSER to its executable.

## Scope

The prototype includes course discovery, ten sample lessons, two complete assessments, saved local progress, draft settings and a mentor interface with guided examples. Course settings start undecided. Browser storage contains demo progress/settings only.

Live sign-in, payments, private videos, server authorization, cross-device progress and generated AI replies remain integration work. The teacher image is generated and the sample teaching content needs professional review.

See docs/ARCHITECTURE.md for the implementation plan and QA.md for evidence and limitations. The application has not been deployed.
