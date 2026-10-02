---
name: frontend-lazy-loading
description: Guidelines and best practices for Angular lazy API loading, deferred modal data fetching, SSR safety, and lightweight client-side caching in Power Diagnostics.
---

# Frontend Lazy API Loading & On-Demand Standards

## 1. Zero Eager Calls in Global / Ambient Components
- **Global Modals & Drawers** (e.g., `QuickConnectModalComponent`, cart drawers, popup dialogs declared in `app.html`):
  - **NEVER** trigger HTTP requests or call lookup APIs inside `ngOnInit()`.
  - Global modals are mounted at initial application load; eager fetching in `ngOnInit()` causes unnecessary network requests on every page load (e.g., Home page).
  - **Rule**: Defer API calls until the user explicitly opens or interacts with the modal:
    - Listen to the Bootstrap modal `show.bs.modal` event in `ngAfterViewInit()`.
    - Provide fallback triggers such as `(focusin)` or `(click)` on the modal form.
    - Track a boolean flag (`hasLoaded = true`) so the API is fetched at most once per session.

## 2. Zero Constructor HTTP Invocations
- Never invoke `HttpClient` methods (`get`, `post`, etc.) or call `load*()` methods inside Angular `@Injectable()` service constructors.
- All service methods returning `Observable` must be cold and only execute upon explicit component subscription.

## 3. Route-Level & Component Lifecycle Guarding
- Only fetch page-specific data when that route's component is activated.
- Always wrap browser-dependent logic (DOM access, event listeners, local storage) with `isPlatformBrowser(platformId)` to guarantee SSR safety.

## 4. In-Memory Service Caching
- Lookups and static/semi-static data (e.g., service types, categories, brands) must be cached in memory (via `Map`, reactive `signal`, or `shareReplay`) to prevent redundant roundtrips across navigation.

## 5. Minimal & Lightweight Payloads
- Request only the strictly necessary fields and lightweight DTOs from the backend.
