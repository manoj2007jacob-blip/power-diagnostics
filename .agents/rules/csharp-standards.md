# Power Diagnostics C# Backend Coding Standards

1. **Single Type Per File (Mandatory)**:
   - Every single C# file (`.cs`) MUST contain strictly **ONLY ONE** type (1 class, 1 record, 1 interface, or 1 enum).
   - Never combine commands, queries, validators, DTOs, responses, or handlers in the same file.
   - Separate every component into its own dedicated file under appropriate folders (e.g., `Commands/`, `Queries/`, `DTOs/`, `Converters/`, `Repositories/`).

2. **No Company Entity**:
   - The backend does NOT have a `Company` domain entity or `CompanyRepository`.
   - Contact company names for quotation enquiries are represented purely as scalar properties (e.g. `Enquiry.CompanyName`).

3. **Clean Architecture & Wolverine Pattern**:
   - `Core/PowerDiagnostics.Domain`: Pure domain entities, value objects, and enums.
   - `Core/PowerDiagnostics.Application`: CQRS features, DTOs, validators, and repository interfaces.
   - `Infrastructure/PowerDiagnostics.Infrastructure`: EF Core DbContext, repository implementations, converters, security, email, seeding.
   - `API/PowerDiagnostics.Api`: REST controllers dispatching requests to handlers via `IMessageBus` (WolverineFx).

4. **Lightweight APIs & Performance**:
   - Endpoints and handlers must return tailored, minimal projection DTOs (e.g. `FeaturedProductDto`) containing strictly the fields required by consumers, avoiding heavy child collections on list queries.
   - Foreign key and lookup IDs (e.g. `availabilityTypeId`, `statusId`, `brandId`, `categoryId`, `subcategoryId`) must be selected and passed directly from the frontend; backend handlers must NOT query lookup tables to guess or fallback IDs.
   - Never serialize raw domain entities or redundant child collections over the wire.
   - All read operations in repositories and query handlers must use `.AsNoTracking()` to eliminate EF tracking overhead and maximize query throughput.
