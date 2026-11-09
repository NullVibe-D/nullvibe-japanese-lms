# Phase 2 — UI/UX and accessibility review

Audit date: 2026-11-09
Scope: the Phase 1 demo preview, without live accounts, payments, private video, or a generated AI mentor.

## Screenshots reviewed

The `lms-qa-evidence` artifact from the Phase 1 GitHub Actions browser QA run contains desktop (1440px), tablet (768px), and mobile (360px and 320px) screenshots of Courses and Lessons. Those screenshots, source inspection, and keyboard/a11y regression checks drove this targeted refinement. Automated axe results are not a substitute for human assistive-technology testing.

## Visual and interaction findings addressed

1. **Unexpected blue box around lesson title.** The generic focus-visible selector overrode a weaker heading rule. Retain route-transition heading focus for assistive technology but remove the interactive-control outline from programmatically focused, non-interactive H1 elements. Also skip focus stealing on the first page load.
2. **Small course metadata on narrow screens.** Raise eyebrow, filter, card metadata, progress, search input, secondary links and mentor prompt typography to improve readability without overhauling the premium white/light-blue styling.
3. **Unclear staff-only affordance.** Move the device-local Course Studio entry out of the student header into a clearly labeled instructor preview link at the end of the course catalog; provide a way back to Courses. The Studio remains a public/local demo and does not authorize production staff operations.
4. **Returning student CTA lacks context.** Show *Continue learning* when sample progress exists and *Explore lessons* for an untouched course.
5. **No-results search recovery.** Add a visible *Show all courses* action to clear the query and course filter.
6. **Ambiguous course titles to screen readers.** Include each JLPT level in its course-card heading's accessible name.
7. **Slow font waterfall.** Move external font stylesheet from CSS `@import` into the document head with preconnect hints; retain `display=swap`.
8. **Missing screen-specific browser tab titles.** Update titles on catalog, lesson, practice, studio, unknown route and language changes.
9. **Regression evidence gaps.** Capture and axe-scan practice, results, access dialog, studio and mentor as well as course catalog/lesson. Include Japanese and Sinhala layouts at 320/360/768/1440px.

## Acceptance tests

- Direct URLs and browser back/forward remain functional.
- Initial route does not force focus to the heading; client-side route changes announce the heading without an oversized focus outline.
- Course Studio entry is available and explicitly marked as a local instructor demo, with a return route.
- Course search can recover from an empty result set without a reload.
- Local progress remains unchanged and enables a contextual CTA.
- Browser QA reports no unhandled errors and no serious/critical accessibility violations in the tested flows.
- No horizontal overflow in the tested viewport/language combinations.
- Static production build, route unit tests and worker packaging tests pass.

## Out-of-scope production blockers

Authentication, payment processing, real user entitlement enforcement, protected course videos, production staff access, server-side progress synchronization and live AI replies still require separately approved backend architecture and provider choices. These are not claimed as complete.

## Important limits

The app is an interactive **prototype**. Browser screenshots and automated tools cannot fully verify every real device, screen reader, browser version, text zoom, or network condition. Formal production release QA should additionally include assistive-technology sessions, real-user feedback, media playback, privacy/security review and production monitoring.
