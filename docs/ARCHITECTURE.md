# NullVibe LMS implementation and production plan

Updated 5 November 2026. The delivered application is a local interactive frontend with sample learning content. Live accounts, purchases, private video delivery and generated AI answers require the integrations below.

## Implemented

- React frontend with course discovery, N5/N4 filtering and search, a lesson workspace, ten sample lessons, two five-question assessments, answer review, local progress and admin configuration.
- English default, Sinhala and Japanese UI choices. Language and progress persist on this device. Teaching content and translations require client/teacher review.
- Guided mentor examples and a free-form prompt interface with an explicit pending-provider response.
- Null price, duration, live-class status and media volume remain undecided. Draft configuration affects the course access summary.
- Keyboard resource tabs, native modal focus containment/Escape, visible focus, reduced motion, mobile lesson selection and mobile navigation.
- Domain validation and a fail-closed entitlement policy reference. That policy is not a deployed authorization service.

## Modules

| Module | Responsibility | Production replacement |
| --- | --- | --- |
| App.jsx | Navigation, locale, local state | Session-aware routes and account persistence |
| Workspace.jsx | Catalog, access information, mentor, staff preview | Catalog API, payment provider, AI service |
| Learning.jsx | Sample lesson content and assessments | Published lesson API and server scoring |
| domain.mjs | Configuration validation and entitlement policy | Shared server policy, independently enforced |
| styles.css, workspace.css, learning.css | Theme, responsive layout and component styling | Same design system |
| worker/index.js | Starter static app routing | Preserve static build and add an independently reviewed API service |

## Production architecture

Use a modular monolith initially. A same-origin API owns identity, catalog administration, entitlements, assessment results, payment events and mentor calls. A relational database stores business state. Private object storage holds media. The browser receives public catalog data and authorized lesson responses.

Authorization denies access unless the request's verified user is entitled to the resource. Apply that check to every request and to media access. IDs and UI visibility are insufficient authorization. Staff permissions come from trusted server state, with MFA and audit logs. [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

Supabase is a candidate for managed auth/Postgres. If selected, enable Row Level Security on exposed tables, grant learner rows only to their owner, and restrict published content and staff updates explicitly. Keep service credentials solely on the server. Selection and provisioning require approval and verified plan suitability. [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Data model

| Entity | Key fields and constraints |
| --- | --- |
| profiles | user_id unique, display_name, preferred_locale |
| staff_roles | user_id, role, granted_by, granted_at; server-managed |
| courses | id, level, draft/published, price_minor nullable, currency, access_days nullable, live_classes nullable |
| lessons | id, course_id, position unique within course, content_version, published_at |
| media_assets | id, lesson_id, private_storage_key, duration, processing_state |
| orders | id, user_id, course_id, immutable price/currency snapshot, state |
| payment_events | provider + event_id unique, order_id, payload_hash, processed_at |
| entitlements | user_id + course_id unique, starts_at, expires_at, status, order_id |
| progress | user_id + lesson_id unique, completed_at, content_version |
| assessment_attempts | id, user_id, assessment_version, answers, server_score, submitted_at |
| audit_events | actor, action, target, timestamp, safe metadata |
| mentor_usage | user_id, day, request_count, token_count, estimated_cost |

Money uses integer minor units in production. A course cannot accept purchases until price, currency, access days, payment method and policies are confirmed. Dates use UTC internally.

## API contracts

| Endpoint | Enforcement |
| --- | --- |
| GET /api/courses | Published public catalog only |
| GET /api/session | Verified session, safe profile fields |
| GET /api/courses/:id/lessons | Entitlement or explicitly public preview |
| POST /api/lessons/:id/playback | Verified entitlement, revocation, expiry, rate limit |
| PUT /api/progress/:lessonId | Own account, valid lesson, idempotent upsert |
| POST /api/assessments/:id/attempts | Immutable version, server scoring, rate limit |
| POST /api/orders | Server derives price/currency/course, idempotency key |
| POST /api/payments/webhook | Verify raw-body signature and event uniqueness |
| PATCH /api/admin/courses/:id | Trusted staff role, schema validation, audit event |
| POST /api/mentor | Session, entitlement, prompt limits, budget and rate limits |

Use secure HttpOnly SameSite session cookies, CSRF protection on cookie-authenticated mutations, origin checking and restrictive CORS. Login/reset endpoints need abuse controls, verified email and account recovery. Validate inputs, bound payloads and use parameterized queries.

## Paid lesson slice

1. Configure provider in test mode and create orders from server prices.
2. Verify paid status through a signed webhook/server lookup. Browser redirects never grant access.
3. Process each event once in a database transaction using a unique event ID. Bind the payment amount, currency and account to the order.
4. Create or update the entitlement from the verified order with a fixed expiry.
5. Handle retries, duplicate/out-of-order events, refunds and chargebacks. Revocation must invalidate future playback requests.
6. Confirm bank-transfer workflow separately. Only authorized staff approve proof of payment. Scan any uploaded proof and keep it private.

## Media slice

Store original recordings and transcoded outputs privately. Playback requests obtain a short-lived signed URL/token after server authorization. Authorize manifests and segments consistently, support adaptive bitrate and captions, and avoid embedding permanent media URLs in public bundles. Keep signatures out of logs and caches.

Access controls reduce unauthorized distribution but cannot prevent a learner from recording their screen. Confirm whether DRM, watermarking and concurrent-session limits are required before choosing a media service.

The present generated image is an illustrative asset. Production recordings, rights, captions and transcripts are awaiting the client.

## AI mentor slice

Place model credentials on the server. Ground answers in teacher-approved course content, label generated responses, and provide a teacher escalation route. Limit prompt length, response tokens and conversation history. Treat retrieved material and student text as untrusted data.

Start with a configurable disabled flag and a hard daily/global budget. Add per-user quotas, request timeouts, provider failure states and a kill switch. Review Sinhala and Japanese output with a qualified teacher. Confirm chat retention, consent, learner ages and privacy requirements. Real-time voice and live assessment require separate latency, moderation and spending decisions.

## Free-tier-first operation

The local demo runs without paid service credentials. Static hosting, managed authentication/database and private storage can be evaluated using free allowances. Video processing, storage operations, email, AI tokens and usage growth can create costs. A production zero-cost promise depends on actual media volume and learner usage.

Cloudflare R2 is a storage candidate with documented free allowances and usage-based charges. Object storage still needs a video pipeline and access service. Recheck pricing and implement usage alerts plus application-level quotas before approval. [R2 pricing](https://developers.cloudflare.com/r2/pricing/)

## Prioritized rollout

| Slice | Acceptance gate | Current status |
| --- | --- | --- |
| Responsive learning prototype | Core flows and multilingual layout verified | Local build |
| Authentication and roles | Account lifecycle, session/CSRF tests, staff MFA | Requires provider configuration |
| Entitlements and payments | Signed webhook, replay/refund/expiry tests | Policy reference and design only |
| Private media | Unauthorized and expired playback denied, captions, low-bandwidth tests | Requires real media and provider |
| Persistent assessments | Server grading, ownership tests, reviewed content | Local scoring implemented |
| AI mentor | Grounding, Sinhala evaluation, usage cap, failure tests | Guided demo implemented |
| Production launch | Backups/restore, monitoring, privacy/accessibility review, device QA | Approval and client inputs pending |

## Client confirmation

Confirm course fees, fixed access durations, payment methods and merchant account, launch syllabus, teacher branding, recording hours/file sizes, rights and captions, live class delivery, AI budget/provider, learner age range, refund terms, retention rules, support contact and domain.

The local staff preview and browser storage are outside the production security boundary. Production readiness remains conditional on implementing and verifying the integrations above.
