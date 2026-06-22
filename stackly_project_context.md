# Stackly Pending Work Plan

Last updated: 2026-06-19

This is the single planning file for the Stackly frontend/backend project. It replaces the old `implementation_plan.md` and `pending_frontend_tasks.md` files.

## Current Project Status

Stackly is a Next.js website builder frontend with a separate Express/MongoDB backend planned or partially present under `backend/`.

The frontend already has these major features built:

- Marketing pages, auth pages, dashboard pages, builder page, analytics page, settings page.
- Drag-and-drop builder with flow and freeform canvas modes.
- Component palette, property editor, layers panel, export button, SEO panel, global styles panel, templates, responsive preview, zoom controls.
- Local project store using `localStorage`.
- Local asset store using IndexedDB.
- Local/demo analytics using `localStorage`.
- Static export through Next.js `output: "export"`.
- Razorpay client integration and a standalone Razorpay API server script.

## Completed Frontend Tasks

These tasks are already done and should not be planned again unless bugs are found:

- Exported HTML injects SEO meta tags.
- Builder supports responsive breakpoint style overrides.
- All remaining blocks were migrated to the BlockSpec pattern.
- Full starter templates exist for E-commerce, Portfolio, Blog, Business, and Restaurant projects.
- NavBar logout clears local/session state, resets stores, clears local assets, and redirects to login.

## Highest Priority Pending Work

### 1. Backend Foundation

Status: Pending

Build or finish the production backend under `backend/`.

Required work:

- Set up Express app with CORS for the static Next.js frontend.
- Connect to MongoDB.
- Add global error handling.
- Add request validation.
- Add JWT utilities and auth middleware.
- Add `.env.example` with all required variables.
- Add health check endpoint, for example `GET /api/health`.

Important constraint:

- The frontend is a static export and calls the backend from the browser.
- Local frontend URL is usually `http://localhost:3000`.
- Local backend API URL should be `http://localhost:5000/api`.
- CORS must allow the frontend origin.

### 2. Authentication Backend

Status: Pending

Required endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-email`
- `POST /api/auth/verify-mobile`
- `POST /api/auth/reset-password`
- `GET /api/auth/google`

Required behavior:

- Register users with name, email, mobile, and password.
- Hash passwords with bcrypt.
- Return JWT access token after login.
- Generate and verify OTP for email password reset.
- Decide whether mobile OTP is real SMS or mocked until an SMS provider is configured.
- Support Google OAuth using configured Google credentials.

Open decisions:

- Choose email provider: Gmail SMTP, SendGrid, Mailgun, or AWS SES.
- Choose mobile OTP provider: Twilio, MSG91, or mock-only for development.
- Confirm production Google OAuth client ID and redirect URLs.

### 3. Auth Session Persistence in Frontend

Status: Pending, depends on authentication backend

Files likely involved:

- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/dashboard/layout.tsx`
- `components/navBar.tsx`
- `lib/api.ts`
- New `store/authStore.ts` or `lib/authSession.ts`
- New `components/ProtectedRoute.tsx`

Required work:

- Store JWT after login/signup.
- Add Authorization header to authenticated API calls.
- Load the current user on app start.
- Redirect unauthenticated users away from `/dashboard`, `/builder`, `/dashboard/settings`, and `/dashboard/analytics`.
- Redirect logged-in users away from `/login` and `/signup` to `/dashboard`.
- Show the logged-in user's real name and email in the NavBar/dashboard.
- Add token refresh only after the backend supports refresh tokens.

### 4. User Profile and Settings

Status: Pending, depends on authentication backend

Required endpoints:

- `GET /api/user/profile`
- `PUT /api/user/profile`

Files likely involved:

- `app/dashboard/settings/page.tsx`
- `components/dashboard/ProjectSettingsForm.tsx`
- New profile settings component if needed.

Required work:

- Show user name, email, mobile, avatar, and current plan.
- Allow editing name and avatar.
- Save profile changes to the backend.
- Show success and error states.

### 5. Workspace / Project Backend

Status: Pending

Required endpoints:

- `POST /api/workspace/create`
- `GET /api/workspace/list`
- `GET /api/workspace/:id`
- `PUT /api/workspace/:id`
- `DELETE /api/workspace/:id`
- `POST /api/workspace/:id/duplicate`
- `PUT /api/workspace/:id/settings`
- `GET /api/workspace/:id/state`
- `PUT /api/workspace/:id/state`

Required database data:

- Project name.
- Category and style.
- Selected sections.
- Builder components.
- Design tokens.
- SEO settings.
- Thumbnail.
- Status.
- Published URL and deployment data later.

### 6. Replace Project localStorage With Backend Save

Status: Pending, depends on workspace backend

Files likely involved:

- `store/projectStore.ts`
- `lib/api.ts`
- Dashboard components should mostly stay unchanged.

Required work:

- Replace `loadProjects()` with API fetch.
- Replace create/update/delete/duplicate/rename actions with API calls.
- Keep local UI behavior the same.
- Add loading, empty, and error states where missing.
- Keep a small offline fallback only if needed.

### 7. Builder Auto-Save to Server

Status: Pending, depends on workspace state API

Files likely involved:

- `store/builderStore.ts`
- `store/designStore.ts`
- `components/builder/BuilderLayout.tsx`
- `lib/api.ts`

Required work:

- Auto-save builder components and design tokens to the backend.
- Save every 30 seconds or after a debounced change.
- Save on `Ctrl+S`.
- Load project builder state from backend when opening a project.
- Show save status in the builder toolbar: saving, saved, failed.
- Keep localStorage fallback for offline or failed saves.

### 8. Asset Upload to Cloud Storage

Status: Pending, depends on asset backend and storage setup

Files likely involved:

- `components/assets/AssetManager.tsx`
- `components/assets/ImagePicker.tsx`
- `store/assetStore.ts`
- `lib/assetDb.ts`
- `lib/api.ts`

Required work:

- Upload user images to backend.
- Store files in S3 or another cloud object store.
- Return public or signed asset URLs.
- List, select, and delete cloud assets from the asset manager.
- Use cloud URLs on the canvas and in exported/published sites.
- Migrate or ignore old IndexedDB assets based on product decision.

## Publishing Work

### 9. Publish Backend and Deployment Pipeline

Status: Pending

Required backend/cloud work:

- Add `POST /api/projects/:id/publish` or equivalent workspace publish endpoint.
- Generate static HTML from project JSON.
- Upload published site files to S3.
- Serve published sites through CloudFront.
- Add deployment records in MongoDB.
- Return live URL, status, and deployment ID.
- Add rollback endpoint.
- Add custom subdomain allocation.

Required AWS work:

- S3 bucket for published sites.
- S3 bucket for user assets.
- CloudFront distribution.
- Route 53 hosted zone.
- Wildcard DNS for user subdomains.
- ACM certificate for published domains.
- CloudFront invalidation after publish.

### 10. Frontend Publish Button

Status: Pending, depends on publish backend

Files likely involved:

- `components/builder/BuilderLayout.tsx`
- New `components/builder/PublishButton.tsx`

Required work:

- Add Publish button near Export.
- Confirm before publishing.
- Show publishing loading state.
- Show success state with live site URL.
- Show failure state with retry.
- Disable button while publishing.

### 11. Deployment History

Status: Pending, depends on deployment records backend

Files likely involved:

- New `components/builder/DeploymentHistory.tsx`

Required work:

- Show deployment list with version, date/time, status, and live marker.
- Allow rollback to older deployment.
- Show empty state before first publish.

### 12. Visit Site Link on Dashboard Cards

Status: Pending, depends on publish backend

Files likely involved:

- `components/dashboard/ProjectCard.tsx`

Required work:

- Show Published badge for published projects.
- Show Visit Site link opening the live URL in a new tab.

### 13. Custom Domain UI

Status: Pending, depends on custom domain backend and DNS automation

Files likely involved:

- `app/dashboard/settings/page.tsx`
- New `components/dashboard/CustomDomainPanel.tsx`

Required work:

- Let users enter a custom domain.
- Show required DNS CNAME instructions.
- Add Verify Domain button.
- Show status: pending, verifying, verified, SSL active, failed.
- Gate custom domains by plan if needed.

## Analytics, Templates, and Billing

### 14. Real Analytics Backend

Status: Pending

Required backend/cloud work:

- Add event ingestion endpoint, for example `POST /api/analytics/events`.
- Add query endpoint, for example `GET /api/projects/:id/analytics`.
- Store raw analytics events.
- Aggregate daily/weekly summaries.
- Inject lightweight tracking script into published sites.

### 15. Connect Analytics Dashboard to Real Data

Status: Pending, depends on analytics backend

Files likely involved:

- `app/dashboard/analytics/page.tsx`
- `lib/analytics.ts`
- `components/analytics/*`

Required work:

- Remove demo seeding as the source of truth.
- Fetch real views, visitors, top pages, and activity data from backend.
- Keep date filters for today, 7 days, and 30 days.
- Show empty/error/loading states.

### 16. Template Marketplace

Status: Pending

Files likely involved:

- New `app/templates/page.tsx`
- New `components/templates/*`

Required work:

- Show template cards with thumbnail, name, category, and free/premium badge.
- Add category and style filters.
- Add search.
- Add preview modal.
- Add Use This Template action that creates a project and opens builder.
- Connect to backend template API when available.

### 17. Premium Feature Locks

Status: Pending, depends on user plan/subscription data

Required work:

- Add lock/upgrade UI for premium templates.
- Add lock/upgrade UI for custom domains.
- Add lock/upgrade UI for AI features.
- Add lock/upgrade UI for analytics export if added.
- Enforce project limits by plan.
- Make backend enforce the same limits, not only frontend UI.

### 18. Subscription Management

Status: Pending, depends on payment backend

Files likely involved:

- `app/dashboard/settings/page.tsx`
- Or new `app/dashboard/subscription/page.tsx`
- `lib/razorpayClient.ts`
- `lib/api.ts`

Required work:

- Show current plan, price, renewal date, and payment status.
- Add upgrade flow.
- Add downgrade flow.
- Add cancel subscription flow.
- Update plan badges after changes.

### 19. Payment Backend

Status: Pending

Required work:

- Consolidate standalone Razorpay API into the main backend.
- Keep Razorpay as the likely primary provider for India-focused production.
- Optional: add Stripe checkout only if international payments are required.
- Add webhook verification.
- Store subscription and payment records.
- Protect paid features with backend middleware.

## Future Product Work

### 20. Blog Editor

Status: Future

Required work:

- Add dashboard blog post list.
- Add rich text editor page.
- Add title, slug, category, featured image, draft/publish status.
- Add preview.
- Add backend blog CRUD API.

### 21. Blog SEO URLs and Sitemap

Status: Future

Required work:

- Generate clean blog URLs like `/blog/my-first-post`.
- Generate HTML pages for each post during publish/export.
- Generate `sitemap.xml`.

### 22. E-commerce Product Management

Status: Future

Required work:

- Add product manager panel.
- Add add/edit/delete product forms.
- Support images, variants, inventory, sale price, and status.
- Add backend product CRUD API.

### 23. Cart and Checkout Builder Components

Status: Future

Required work:

- Add cart block.
- Add checkout block.
- Add product/listing blocks if needed.
- Wire checkout to Razorpay.

### 24. AI Text Generation

Status: Future

Required work:

- Add Generate with AI action for text fields in the property editor.
- Add prompt input, loading state, accept, and retry.
- Add backend AI proxy endpoint.
- Add usage limits by plan.

### 25. AI Image Generation

Status: Future

Required work:

- Add AI Generate tab in Asset Manager.
- Generate image from prompt.
- Add generated image to asset library.
- Store generated image in cloud storage.

### 26. AI Layout Suggestions

Status: Future

Required work:

- Add Suggest Layout action in builder.
- Ask user for page purpose.
- Generate layout components.
- Preview suggested layout.
- Apply or cancel.

## Backend Models Needed

Minimum models:

- `User`
- `Otp`
- `Workspace`
- `WorkspaceState`
- `Subscription`
- `Deployment`
- `Asset`
- `AnalyticsEvent`
- `AnalyticsDailySummary`

Future models:

- `Template`
- `BlogPost`
- `Product`
- `Order`
- `Team`

## Environment Variables Needed

Backend:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/stackly?retryWrites=true&w=majority
JWT_SECRET=replace-me
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=replace-me
JWT_REFRESH_EXPIRES_IN=30d
```

Email and OTP:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
SMS_PROVIDER=mock
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

OAuth:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Payments:

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

AWS:

```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_SITES_BUCKET=
S3_ASSETS_BUCKET=
CLOUDFRONT_DISTRIBUTION_ID=
PUBLISHED_SITE_DOMAIN=stackly.studio
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

## Suggested Build Order

1. Backend foundation and health check.
2. Auth backend.
3. Frontend auth session persistence and route guards.
4. User profile settings.
5. Workspace/project backend.
6. Replace project localStorage with backend API.
7. Builder auto-save to server.
8. Cloud asset upload.
9. Payment/subscription backend.
10. Publish backend and AWS hosting.
11. Frontend publish, deployment history, visit-site links, and custom domains.
12. Real analytics.
13. Template marketplace.
14. Premium feature gates.
15. Blog, e-commerce, and AI features.

## Open Decisions

- Use Razorpay only, or support both Razorpay and Stripe?
- Use Gmail SMTP, SendGrid, Mailgun, or AWS SES for email?
- Use real SMS OTP now, or mock mobile OTP during development?
- Confirm production domain: `thestackly.com`, `stackly.studio`, or both.
- GitHub OAuth is not required for sign in or sign up.
- Decide if local IndexedDB assets should be migrated to cloud or left as local-only development data.
