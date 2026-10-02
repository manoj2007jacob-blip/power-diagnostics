---
name: csharp-clean-architecture
description: C# .NET 10 Clean Architecture standards and file organization guidelines for Power Diagnostics backend. Enforces strict 1 type per file (1 class, record, interface, or enum) and prevents Company entity usage.
---

# Power Diagnostics C# Clean Architecture & Coding Rules

## 1. Strict File Structure: Exactly 1 Type Per File
- **Rule**: Every single C# file (`*.cs`) MUST contain **ONLY 1 type definition** (1 `class`, 1 `record`, 1 `interface`, or 1 `enum`).
- **Prohibition**: Do not group multiple classes, records, queries, commands, responses, handlers, or validators within a single `.cs` file.
- **Organization**:
  - `Features/<Feature>/DTOs/<DtoName>.cs`
  - `Features/<Feature>/Queries/<QueryName>.cs`
  - `Features/<Feature>/Queries/<QueryName>Handler.cs`
  - `Features/<Feature>/Commands/<CommandName>.cs`
  - `Features/<Feature>/Commands/<CommandName>Validator.cs`
  - `Features/<Feature>/Commands/<CommandName>Handler.cs`
  - `Common/Interfaces/Repositories/<IRepositoryName>.cs`
  - `Persistence/Repositories/<RepositoryName>.cs`
  - `Persistence/Converters/<ConverterName>.cs`

## 2. No Company Entity
- The `Company` entity is excluded from the domain model.
- Do not create `Company.cs`, `ICompanyRepository.cs`, or `CompanyRepository.cs`.
- Enquiry requests capture client company names as plain string fields (`Enquiry.CompanyName`).

## 3. Technology Stack & Patterns
- **.NET 10 & C# 13**
- **WolverineFx**: Handlers are static or instance classes following the naming convention `<CommandOrQuery>Handler` with `Handle(...)`.
- **EF Core 10 + Npgsql**: PostgreSQL database provider with `UnitOfWork` and generic/specialized repositories.
- **Ardalis.Result**: Handlers return `Result<T>` or `Result<PagedResult<T>>`.
- **FluentValidation**: Independent validator classes inheriting `AbstractValidator<TCommand>`.

## 4. Lightweight API Design & Performance
- **Minimal Projection DTOs**: Endpoints for lists, cards, or featured items (e.g. `GetFeaturedProducts`, `GetBrands`) must return dedicated, lightweight DTOs (e.g. `FeaturedProductDto.cs`, `AuthorizedBrandDto.cs`) that project strictly the minimal properties needed. Never query or include heavy child collections (documents, specifications, full descriptions) when only card summaries or basic fields are needed.
- **Direct Client ID Passing (No Redundant Backend Resolution)**: Lookup and foreign key IDs (e.g. `availabilityTypeId`, `statusId`, `brandId`, `categoryId`, `subcategoryId`) must be selected and passed directly from the frontend. Handlers must NOT query lookups to fallback or guess IDs when saving commands.
- **Minimal Mutation Responses**: API responses for PUT / POST / PATCH / DELETE must be minimal. Return strictly only the generated ID (`long` or `Guid`) for `POST`, and empty / `204 NoContent` (`Result`) for `PUT`, `PATCH`, and `DELETE` unless a specific need is there for additional data at the frontend.
- **AsNoTracking**: All read queries across repositories and query handlers must use `.AsNoTracking()` to avoid unnecessary object tracking and optimize throughput.
- **No Entity Leakage**: Never expose raw domain entities directly through controllers.

## 5. Frontend API Invocation Principles
- **Lazy Invocation**: Angular service constructors must NEVER trigger eager HTTP calls.
- **On-Demand Loading**: Trigger API calls in consuming component lifecycle hooks (`ngOnInit` wrapped with SSR `isPlatformBrowser` checks where relevant).
- **Service-Level Caching**: Maintain state/boolean guards (e.g. `isLoaded`) to prevent duplicate HTTP calls across multiple component mounts.

