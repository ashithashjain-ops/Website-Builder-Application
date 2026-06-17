# Stackly — Pending Frontend Tasks (For Frontend Team)

> **Last Updated**: 2026-06-17  
> Tasks are grouped by **page / component / block** with clear descriptions of what needs to be built.

---

## ✅ Execution Order

| Order | Label | What | Can Start Now? |
|-------|-------|------|----------------|
| 1st | **Do First** | Tasks with no dependency — team can pick these up right away | ✅ Yes |
| 2nd | **Do After Backend Auth is Ready** | Need login/signup backend to be live first | ⏳ Wait |
| 3rd | **Do After Backend Project APIs are Ready** | Need project save/load backend to be live first | ⏳ Wait |
| 4th | **Do After Publish System is Ready** | Need publishing backend + AWS setup first | ⏳ Wait |
| 5th | **Future Features** | Blog editor, e-commerce, AI — plan for later | 🔮 Later |

---

## 🟢 DO FIRST — No Dependency (Start Immediately)

---

### Task 1: Export HTML — Inject SEO Meta Tags

**Where**: [lib/exportHtml.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/exportHtml.ts)

**What to do**:  
When a user clicks "Export" or when we publish a site, the generated HTML file should include the SEO data (title, description, Open Graph tags) that the user entered in the **SEO Panel** inside the builder.

**How it should work**:
- Read the SEO data from the design store (`store/designStore.ts` → `seo` field)
- In the exported HTML `<head>`, add:
  - `<title>` tag with the user's title
  - `<meta name="description">` with user's description
  - `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">` for social sharing
- Currently the SEO Panel UI is built but the data is **not injected** into the exported HTML

**Files to touch**:
- [lib/exportHtml.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/exportHtml.ts) — update the `exportHtml()` function
- [store/designStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/designStore.ts) — read `seo` values from here

---

### Task 2: Builder — Responsive Breakpoint Style Overrides — COMPLETED

**Status**: Completed on 2026-06-17. Responsive styles are stored in `responsiveStyles.tablet/mobile`, the builder toolbar switches viewport widths, Style/Effects tabs write breakpoint overrides, flow/freeform canvas previews merge active overrides, and exported HTML emits per-component `@media` rules.

**Where**: Builder → Style Panel → all component types

**What to do**:  
Right now, when a user switches viewport (Desktop / Tablet / Mobile) in the builder, they can see the preview at different sizes — but they **cannot save different styles per breakpoint**. For example, a user should be able to set font-size `48px` on desktop but `24px` on mobile for the same heading.

**How it should work**:
- When user switches to Tablet or Mobile viewport and changes a style (padding, font-size, etc.), save that as a **breakpoint-specific override**
- The component's `styles` should support an optional `responsive` field like:
  ```
  styles: { fontSize: "48px" }
  responsive: {
    tablet: { fontSize: "32px" },
    mobile: { fontSize: "24px", padding: "8px" }
  }
  ```
- When exporting HTML, generate proper `@media` queries for tablet (768px) and mobile (390px) breakpoints
- The Style Tab should show which values are "overridden" for the current viewport

**Files to touch**:
- [types/builder.ts](file:///d:/stackly/Workplace/Website-Builder-Application/types/builder.ts) — add `ResponsiveStyles` to `BuilderComponent`
- [store/builderStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/builderStore.ts) — update `updateComponent()` to save per-viewport
- [components/builder/panel/StyleTab.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/builder/panel/StyleTab.tsx) — show viewport-specific values
- [lib/exportHtml.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/exportHtml.ts) — generate `@media` queries in exported HTML

---

### Task 3: Migrate All Remaining Blocks to BlockSpec Pattern — COMPLETED

**Status**: Completed on 2026-06-17. The remaining 20 blocks now have per-block `spec.ts` entries, are registered in `blockRegistry`, include readers/defaults/renderers/panels/export handlers, and legacy `content` blocks keep editing through a transitional `setContent` panel bridge.

**Where**: [components/blocks/](file:///d:/stackly/Workplace/Website-Builder-Application/components/blocks/) + [lib/blockRegistry.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/blockRegistry.ts)

**What to do**:  
We have a `BlockSpec` pattern (used by `hero`, `navigation`, `features`, `contact`, `feature-item`, `video`) where each block has a clean `spec.ts` file with defaults, reader, renderer, panel, and export logic. **20 blocks are NOT migrated yet**:

**Group A — Old blocks using `content` string (need full migration)**:
1. `heading`
2. `text`
3. `button`
4. `image`
5. `icon`
6. `columns`
7. `input`
8. `divider`
9. `gallery`
10. `container`

**Group B — New blocks with typed `props` but no full `spec.ts` file yet**:
1. `map`
2. `accordion`
3. `tabs`
4. `spacer`
5. `social-links`
6. `countdown`
7. `pricing-table`
8. `testimonial`
9. `footer`
10. `form`

**For each block**, create:
- `components/blocks/{block-name}/spec.ts` — with `type`, `label`, `group`, `icon`, `defaults`, `read()`, `Renderer`, `Panel`, `exportHtml()`
- Register it in [lib/blockRegistry.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/blockRegistry.ts)

**Reference**: Look at how [components/blocks/hero/spec.ts](file:///d:/stackly/Workplace/Website-Builder-Application/components/blocks/hero) is done — follow the same pattern.

---

### Task 4: Create Full Template Designs for All 5 Categories

**Where**: [store/builderStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/builderStore.ts) (`categoryCopy` + `loadWebsiteFromRequirements`)

**What to do**:  
When a user creates a project and picks a category (E-commerce, Portfolio, Blog, Business, Restaurant), we load a starter website. Currently, the categories have **text copy defined** but no **full multi-section template JSON**. Each category needs a complete `BuilderComponent[]` array that loads a fully designed, professional-looking multi-section page.

**What each template should include** (as pre-built components):
- Navigation bar with relevant links
- Hero section with category-appropriate text and layout
- Features / services section
- Testimonials or reviews
- Pricing (for business/e-commerce)
- Contact section or form
- Footer with social links

**Categories to build**:
1. **E-commerce** — product-focused hero, feature grid, pricing table, testimonials, footer
2. **Portfolio** — creative hero, gallery/project grid, about section, contact form, footer
3. **Blog** — article-focused hero, featured posts section, categories, newsletter CTA, footer
4. **Business** — corporate hero, services/features, team section, testimonials, CTA, footer
5. **Restaurant** — food-themed hero, menu highlights, gallery, reservation CTA, map + contact, footer

---

### Task 5: NavBar — Wire Logout Button

**Where**: [components/navBar.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/navBar.tsx)

**What to do**:  
Add a working "Logout" button in the navigation bar (when user is logged in). On click:
- Clear all local data (localStorage keys for projects, tokens, analytics, etc.)
- Reset all Zustand stores (builder, project, design, asset)
- Redirect to the login page

> [!NOTE]
> For now, just clear local state and redirect. When the backend logout endpoint is ready later, we'll add the server call.

---

## 🟡 DO AFTER — Backend Auth is Ready

> Wait for the backend team to finish: login/signup server, JWT tokens, Google OAuth callback, user profile endpoint

---

### Task 6: All Auth Pages — Session Persistence

**Where**: [app/login/page.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/app/login/page.tsx), [app/signup/page.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/app/signup/page.tsx), all protected pages

**What to do**:  
After login/signup, the backend returns a JWT token. Currently we receive it but **don't persist it or use it for protected routes**.

**Features to add**:
- Store the token securely after login (in memory + localStorage or cookie)
- Create an **auth guard** — if user is not logged in, redirect them to `/login` when they try to access `/dashboard`, `/builder`, `/dashboard/settings`, `/dashboard/analytics`
- If user IS logged in, redirect them away from `/login` and `/signup` to `/dashboard`
- Add a **token refresh flow** — when a request fails because the token expired, automatically refresh it and retry (instead of logging user out)
- Show the logged-in user's name in the NavBar

**New file to create**: `lib/authSession.ts` or `hooks/useAuth.ts`

---

### Task 7: Dashboard Settings — Profile Editing

**Where**: [app/dashboard/settings/page.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/app/dashboard/settings/page.tsx)

**What to do**:  
The settings page currently only has project settings. Add a **user profile section**:

- Display user's name, email, mobile, avatar
- Allow editing name and uploading a new avatar image
- Show the user's current plan (Free / Starter / Pro / Enterprise)
- Save changes to the backend
- Show success/error toast after saving

---

## 🟠 DO AFTER — Backend Project Save/Load is Ready

> Wait for the backend team to finish: project create, list, get, update, delete, duplicate, auto-save endpoints

---

### Task 8: Dashboard — Replace localStorage with Backend Save

**Where**: [store/projectStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/projectStore.ts)

**What to do**:  
Currently all project data (create, list, edit, delete, duplicate) is saved to **localStorage only**. This means data is lost if the user clears their browser or uses a different device.

**Replace each action**:
- `loadProjects()` → fetch projects from the server instead of localStorage
- `createProject()` → send new project data to the server, get back the saved project
- `updateProject()` → send updated data to the server
- `deleteProject()` → tell the server to delete, then remove from local list
- `duplicateProject()` → tell the server to clone, get back the new project
- `renameProject()` → same as update, send new name to server

**Keep the same UI** — `ProjectGrid`, `ProjectCard`, `CreateProjectModal` all stay the same. Only the data layer changes.

---

### Task 9: Builder — Auto-Save to Server

**Where**: [store/builderStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/builderStore.ts), [store/designStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/designStore.ts)

**What to do**:  
Currently, the builder saves to localStorage via `saveToLocalStorage()`. Replace this with **auto-save to the server**.

**How it should work**:
- Every 30 seconds (debounced), if there are unsaved changes, save the current `components[]` array and `designTokens` to the server
- Show a **save indicator** in the builder toolbar: "Saving..." → "Saved ✓" → "Save failed ✗"
- Also save on `Ctrl+S` keyboard shortcut
- The `loadFromLocalStorage()` should be replaced with loading from the server when opening a project
- Keep localStorage as a **fallback** in case the server is unreachable (offline mode)

---

### Task 10: Asset Manager — Replace IndexedDB with Cloud Upload

**Where**: [components/assets/AssetManager.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/assets/AssetManager.tsx), [store/assetStore.ts](file:///d:/stackly/Workplace/Website-Builder-Application/store/assetStore.ts), [lib/assetDb.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/assetDb.ts)

**What to do**:  
Currently images uploaded by users are stored in the browser's **IndexedDB** (local to that browser). Replace with cloud storage.

**Changes**:
- When user uploads an image → send it to the server (which stores it in S3) → get back a URL
- When listing assets → fetch from server instead of IndexedDB
- When deleting an asset → tell server to delete
- When displaying images on canvas → use the cloud URL instead of blob URLs
- Keep the same drag-and-drop upload UI in `AssetManager.tsx`

---

## 🔴 DO AFTER — Publish System is Ready

> Wait for backend publish endpoint + AWS S3/CloudFront setup

---

### Task 11: Builder Toolbar — Add "Publish" Button

**Where**: [components/builder/BuilderLayout.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/builder/BuilderLayout.tsx) or new `components/builder/PublishButton.tsx`

**What to do**:  
Add a prominent "Publish" button next to the existing "Export" button in the builder toolbar.

**How it should work**:
- Click "Publish" → show confirmation dialog ("Publish your site live?")
- On confirm → show loading spinner with text "Publishing..."
- On success → show success state with the **live site URL** (e.g., `mysite.stackly.studio`) and a "Visit Site" button that opens it in a new tab
- On failure → show error message with "Retry" option
- Disable the button while publishing is in progress

---

### Task 12: Builder — Deployment History Panel

**Where**: New component `components/builder/DeploymentHistory.tsx`

**What to do**:  
Build a panel (accessible from the builder sidebar or a button in the toolbar) that shows the history of all published versions.

**What to show**:
- List of deployments with: version number, date/time published, status (live / rolled back)
- The currently live version highlighted
- A "Rollback" button on each past version — click to restore that version as the live site
- Empty state: "No deployments yet. Click Publish to go live!"

---

### Task 13: Dashboard Project Cards — Show "Visit Site" Link

**Where**: [components/dashboard/ProjectCard.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/dashboard/ProjectCard.tsx)

**What to do**:  
If a project has been published, show a "Visit Site" link/button on the project card that opens the live URL in a new tab. Also show a small "Published ✓" badge on the card.

---

### Task 14: Dashboard Settings — Custom Domain Input

**Where**: [app/dashboard/settings/page.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/app/dashboard/settings/page.tsx) or new `components/dashboard/CustomDomainPanel.tsx`

**What to do**:  
Add a "Custom Domain" section in project settings where users can connect their own domain.

**How it should work**:
- Input field to enter custom domain (e.g., `www.mybusiness.com`)
- After entering → show instructions: "Add this CNAME record to your DNS settings: `your-site.stackly.studio`"
- A "Verify Domain" button that checks if DNS is properly configured
- Show status: Pending → Verifying → Verified ✓ + SSL Active ✓
- Error state if verification fails after timeout

---

## 🟣 DO AFTER — Analytics & Templates Backend is Ready

---

### Task 15: Analytics Dashboard — Connect to Real Data

**Where**: [app/dashboard/analytics/page.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/app/dashboard/analytics/page.tsx), [lib/analytics.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/analytics.ts)

**What to do**:  
Currently the analytics dashboard shows **fake data from localStorage** (via `seedDemoAnalytics()`). Replace with real data from the server.

**Changes**:
- Remove `seedDemoAnalytics()` and localStorage-based tracking
- Fetch real analytics data from the server (views, visitors, daily traffic, top pages)
- Keep the same UI components: `AnalyticsCards`, `ViewsChart`, `VisitorsChart`, `TopPages`, `ActivityTable`
- Keep the date filter (today / 7 days / 30 days) — pass as parameter when fetching data

---

### Task 16: New Page — Template Marketplace

**Where**: New page `app/templates/page.tsx` + new components in `components/templates/`

**What to do**:  
Build a page where users can browse all available templates (free and premium).

**Features**:
- Grid of template cards with: thumbnail preview, name, category badge, "Free" / "Premium" badge
- Filter sidebar: filter by category (E-commerce, Portfolio, Blog, Business, Restaurant) and style (Modern, Minimal, Bold)
- Search bar to search templates by name
- Click on a card → open a **preview modal** showing the template rendered in an iframe
- "Use This Template" button in the preview → creates a new project from that template and redirects to the builder

---

### Task 17: All Premium Features — Add Lock / Upgrade Gate

**Where**: Multiple files — builder, dashboard, templates, settings

**What to do**:  
Add a visual **lock icon** and "Upgrade to unlock" prompt on features that are only for paid plans.

**Where to add locks**:
- Premium templates in the template marketplace (Task 16)
- Custom domain setting (Task 14)
- AI generation buttons (future)
- Analytics export
- More than X projects (based on plan limit)

**How it should work**:
- Check the user's current plan (Free / Starter / Pro / Enterprise)
- If a feature requires a higher plan → show a lock overlay with "Upgrade to Pro" button
- Clicking upgrade → navigate to the pricing/planning page

---

### Task 18: Dashboard Settings — Subscription Management

**Where**: New section in settings or new page `app/dashboard/subscription/page.tsx`

**What to do**:  
Show the user's current subscription plan and allow them to manage it.

**Features**:
- Show current plan name, price, renewal date
- "Upgrade Plan" button → opens Razorpay checkout for the selected higher plan
- "Downgrade Plan" option with confirmation
- "Cancel Subscription" with confirmation dialog and reason selection
- After plan change → update the user's plan badge everywhere in the app

---

## 🔮 FUTURE — Blog, E-commerce, AI (Plan for Later)

---

### Task 19: New Page — Blog Post Editor

**Where**: New pages under `app/dashboard/blog/`

**What to do**:  
Build a rich text blog post editor for users who picked "Blog" as their project category.

**Features**:
- Blog post list page showing all posts (title, status, date)
- Editor page with: title input, auto-generated URL slug, category dropdown, featured image picker, rich text content editor (use a library like Tiptap or Slate.js)
- Draft / Publish toggle
- Preview button to see how the post will look on the live site

---

### Task 20: Blog — SEO-Friendly URLs

**Where**: [lib/exportHtml.ts](file:///d:/stackly/Workplace/Website-Builder-Application/lib/exportHtml.ts)

**What to do**:  
When publishing a site with blog posts, generate individual HTML pages for each blog post with clean URLs like `/blog/my-first-post`. Auto-generate `sitemap.xml` listing all pages and blog posts.

---

### Task 21: Builder — Product Management Panel (E-commerce)

**Where**: New component `components/ecommerce/ProductManager.tsx`

**What to do**:  
For e-commerce projects, build a product management panel accessible from the builder sidebar.

**Features**:
- Product list view (name, price, image, status)
- Add/Edit product form: name, description, price, sale price, images (use asset manager), variants (size, color), inventory count
- Delete product with confirmation

---

### Task 22: Builder — Cart & Checkout Components (E-commerce)

**Where**: New draggable components `components/draggable/CartComponent.tsx`, `CheckoutComponent.tsx`

**What to do**:  
Create new draggable blocks for the builder canvas:
- **Cart Block** — shows a mini-cart with items, quantities, and total price
- **Checkout Block** — order form with shipping address, payment button (Razorpay)

These should be available in the Component Palette under a new "E-commerce" group.

---

### Task 23: Builder Property Editor — AI "Generate Text" Button

**Where**: [components/builder/PropertyEditor.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/builder/PropertyEditor.tsx)

**What to do**:  
For text-based components (heading, text, hero, features, etc.), add a ✨ "Generate with AI" button next to the text input fields.

**How it should work**:
- Click the button → show a small prompt input: "What kind of text do you want?"
- User types a prompt (e.g., "Write a hero tagline for a coffee shop")
- Show a loading spinner
- Display the generated text → user can "Accept" or "Try Again"
- On accept → insert the text into the component

---

### Task 24: Asset Manager — AI Image Generation

**Where**: [components/assets/AssetManager.tsx](file:///d:/stackly/Workplace/Website-Builder-Application/components/assets/AssetManager.tsx)

**What to do**:  
Add an "AI Generate" tab in the Asset Manager alongside the existing upload tab.

**Features**:
- Text prompt input field
- "Generate Image" button
- Show loading state while generating
- Display the generated image with "Add to Library" and "Regenerate" buttons
- On add → save to asset library like any uploaded image

---

### Task 25: Builder — AI Layout Suggestions

**Where**: New component `components/builder/AILayoutSuggest.tsx`

**What to do**:  
Add a "✨ Suggest Layout" button in the builder (maybe in the quick insert bar or toolbar).

**How it should work**:
- Click → opens a small modal asking for the page purpose (e.g., "Landing page for a SaaS product")
- Show loading while AI generates a layout
- Preview the suggested layout in a mini-preview
- "Apply" button → replaces canvas content with the suggested components
- "Cancel" to dismiss

---

## 📋 Quick Summary for Standup

| # | Task | Page / Component | Start When |
|---|------|-----------------|------------|
| 1 | SEO meta tags in exported HTML | `lib/exportHtml.ts` | 🟢 Now |
| 2 | Responsive breakpoint style overrides | Builder → Style Panel | 🟢 Now |
| 3 | Migrate 20 blocks to BlockSpec | `components/blocks/` | 🟢 Now |
| 4 | Full template designs for 5 categories | `builderStore.ts` | 🟢 Now |
| 5 | Wire logout button | `navBar.tsx` | 🟢 Now |
| 6 | Auth session persistence + route guard | Login, Signup, all protected pages | 🟡 After backend auth |
| 7 | Profile editing in settings | `dashboard/settings` | 🟡 After backend auth |
| 8 | Dashboard → backend project save | `projectStore.ts` | 🟠 After backend project APIs |
| 9 | Builder auto-save to server | `builderStore.ts` | 🟠 After backend project APIs |
| 10 | Asset manager → cloud upload | `AssetManager.tsx`, `assetStore.ts` | 🟠 After backend project APIs |
| 11 | "Publish" button in builder | `BuilderLayout.tsx` | 🔴 After publish system |
| 12 | Deployment history panel | New `DeploymentHistory.tsx` | 🔴 After publish system |
| 13 | "Visit Site" link on project cards | `ProjectCard.tsx` | 🔴 After publish system |
| 14 | Custom domain input | `dashboard/settings` | 🔴 After publish system |
| 15 | Analytics → real server data | `analytics/page.tsx` | 🟣 After analytics backend |
| 16 | Template marketplace page | New `app/templates/` | 🟣 After templates backend |
| 17 | Premium feature lock / upgrade gate | Multiple files | 🟣 After subscriptions backend |
| 18 | Subscription management UI | `dashboard/settings` or new page | 🟣 After subscriptions backend |
| 19 | Blog post editor | New `dashboard/blog/` | 🔮 Future |
| 20 | Blog SEO-friendly URLs | `exportHtml.ts` | 🔮 Future |
| 21 | Product management panel | New `ProductManager.tsx` | 🔮 Future |
| 22 | Cart & checkout components | New draggable blocks | 🔮 Future |
| 23 | AI generate text button | `PropertyEditor.tsx` | 🔮 Future |
| 24 | AI image generation | `AssetManager.tsx` | 🔮 Future |
| 25 | AI layout suggestions | New `AILayoutSuggest.tsx` | 🔮 Future |
