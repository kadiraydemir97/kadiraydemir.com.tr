# Agent Guidelines

This file contains instructions and rules for AI agents working on this codebase.

## Testing Rules

1. **Preserve Existing Tests**:
   - You MUST NOT delete or modify existing tests unless the feature they test has explicitly changed significantly or been removed.
   - If a test fails, your first priority is to fix the code, not the test (unless the test itself is outdated).

2. **Mandatory Testing for New Features**:
   - For every new feature, component, or bug fix you implement, you MUST write corresponding tests.
   - These can be unit tests, component tests, or E2E tests, depending on the scope of the change.
   - Verify that your new tests pass before submitting.

3. **Verify All Work**:
   - Always run the full test suite (`npm run test`) before submitting changes to ensure no regressions were introduced.
