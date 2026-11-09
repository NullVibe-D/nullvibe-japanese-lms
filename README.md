# NullVibe Japanese LMS

A responsive local frontend based on the selected white/light-blue lesson workspace. English is the default, with Sinhala and Japanese options.

## Run locally

Use Node.js 20.19+ or a compatible current LTS. Run npm ci, then npm run dev -- --host 127.0.0.1 --port 4173 --strictPort.

Open http://127.0.0.1:4173. The first view is the public course catalog. Click Explore lessons to resume at the last lesson for that level (lesson 1 on the first visit). URLs are shareable: /courses, /courses/n5, /courses/n4, /learn/n5/1 through /learn/n5/5 (similarly for n4), /practice/n5 or /practice/n4, and /studio (a local-only admin preview). Browser back/forward and direct navigation are supported. Use Course studio for **device-local preview settings only** and Mentor for guided examples.

## Verification

Run npm run build, npm test, npm run test:qa and npm audit.

The browser QA script supports a QA_BROWSER environment variable containing a local Chromium executable. Its default targets the existing Windows test browser used during this delivery. Install Chromium through Playwright if needed and set QA_BROWSER to its executable.

## Scope

The prototype includes course discovery, ten sample lessons, two complete assessments, saved local progress, draft settings and a mentor interface with guided examples. Course settings start undecided. Browser storage contains demo progress/settings only.

Live sign-in, payments, private videos, server authorization, cross-device progress and generated AI replies remain integration work. The teacher image is generated and the sample teaching content needs professional review.

See docs/ARCHITECTURE.md for the implementation plan and QA.md for evidence and limitations. The Vercel demo is deployed. The GitHub deployment integration remains to be authorized by the repository owner; direct Vercel API deployments are not automatically updated by pushes.
