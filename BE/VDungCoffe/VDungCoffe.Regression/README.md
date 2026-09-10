# Backend regression checks

Run from the repository root:

```powershell
dotnet run --project BE/VDungCoffe/VDungCoffe.Regression
```

This executable uses the backend's existing dependencies without adding a test framework. A failed check exits with code 1. It exercises the actual authorization handler, controller action policies, general-update DTO overposting boundary, rich-text sanitizer, pagination size limits, price validator, and SQL Server EF model concurrency/filter metadata.

These are targeted regression checks, not HTTP or database integration tests. They do not prove JWT middleware wiring, SQL Server concurrent-write behavior, cache/CDN delivery, audit transaction atomicity, or database migration deployment. Those require a configured test host and SQL Server database.
