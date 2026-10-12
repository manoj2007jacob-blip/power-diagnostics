# Power Diagnostics Workspace Guidelines

## Theme & Color Scheme
- All page hero headers and action buttons MUST strictly use **Theme Blue**: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`.
- Contrast text and icons on Theme Blue backgrounds MUST always be `#ffffff`.
- Third-party social icons (WhatsApp, LinkedIn, Facebook, Instagram) retain their standard brand colors.

## C# Backend Architecture & File Standards
- **Strict 1 Type Per File**: Every single C# file (`*.cs`) MUST contain strictly ONLY 1 type (1 class, 1 record, 1 interface, or 1 enum). Never place multiple classes, records, queries, commands, responses, handlers, or validators in a single file.
- **No Company Entity**: Do not create or use a `Company` domain entity or repository. Company names in enquiries are simple string properties (`Enquiry.CompanyName`).
- **Lightweight API Design**: Backend endpoints and handlers must only return minimal, tailored projection DTOs (e.g. `FeaturedProductDto`, `AuthorizedBrandDto`) selecting strictly necessary fields and avoiding heavy child collections on list queries. All EF Core read queries must use `.AsNoTracking()` for optimal throughput and zero unnecessary overhead.
- **Direct Client ID Passing**: Foreign key and lookup IDs (e.g. `availabilityTypeId`, `statusId`, `brandId`, `categoryId`, `subcategoryId`) must be selected and passed directly from the frontend. Handlers must NOT query lookup tables to resolve or fallback IDs.
- **Minimal Mutation Responses**: API responses for mutating operations must be minimal: return strictly only the generated/persisted ID (e.g. `long`) for POST, and empty / `204 NoContent` (`Result`) for PUT / PATCH / DELETE unless a specific need is there for additional data at the frontend.

## Frontend API Invocation Standards
- **Lazy API Calls**: Never invoke HTTP requests or trigger eager `load*()` calls inside Angular service constructors.
- **On-Demand & SSR Safe**: All API fetching must be triggered lazily inside consuming component lifecycles (e.g., `ngOnInit`). Use service-level cache flags to prevent redundant network roundtrips.
  - **SEO content renders on the server**: Public pages render with Angular SSR. Data that crawlers must see (product/article detail, catalogue & blog lists, home page content, related products, brands) MUST be fetched WITHOUT `isPlatformBrowser` guards so it is in the server HTML; the HTTP transfer cache hands those responses to the browser, so nothing is fetched twice.
  - **Browser-only data**: Use `isPlatformBrowser` guards only for data with no SEO value or that depends on the visitor (lookups for form dropdowns, cart, auth/admin state) and for DOM/`window` APIs.
  - **Missing content**: When a product/article does not exist, call `injectNotFoundStatus()` (`core/seo/not-found-status.ts`) so the server responds with HTTP 404, not a "soft 404" with status 200.
- **Ambient & Global Modal Deferral**: Components rendered globally in `app.html` (such as `QuickConnectModalComponent`) MUST NEVER trigger API calls on initial page load / `ngOnInit()`. Defer API calls until the user explicitly opens or interacts with the modal (e.g. Bootstrap `show.bs.modal` event, click, or focus).


