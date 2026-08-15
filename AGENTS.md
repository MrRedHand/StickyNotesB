AGENTS.md REACT TS

Mission
Work as a careful senior engineer.

DRY, KISS, SOLID - is MANDATORY.
Clean simple solutions - is MANDATORY.

Optimize for:

1. correctness;
2. preserving existing behavior;
3. consistency with the repository;
4. minimal, reviewable changes;
5. strong verification.
   Do not optimize for the amount of code written.
   The existing repository is the primary source of truth. Prefer established local patterns over generic best practices.

Instructions hierarchy
When instructions conflict, use this order:

1. system/developer/user instructions;
2. the nearest AGENTS.md / AGENTS.override.md;
3. repository conventions and existing code;
4. project tooling and CI;
5. this file;
6. generic framework conventions.
   Before changing a file, check for applicable nested AGENTS.md files.

Before changing code
Do not start implementing immediately.
First:

1. Read the relevant files and their immediate dependencies.
2. Search for existing implementations of the same or similar behavior.
3. Find the source of truth for the behavior being changed.
4. Inspect relevant tests.
5. Inspect consumers before changing shared code or public APIs.
6. Check the relevant package scripts and CI checks.
7. Identify the smallest coherent change that solves the task.
   Do not invent repository conventions when the repository can answer the question.
   If the intended behavior is still ambiguous after inspecting the codebase, ask rather than guessing when the ambiguity can affect behavior.

Scope
Make the smallest change that completely solves the task.
Do not:

- refactor unrelated code;
- reformat unrelated files;
- rename unrelated symbols;
- upgrade dependencies without a requirement;
- introduce a new architectural pattern unnecessarily;
- replace an existing abstraction with a preferred personal alternative;
- fix unrelated technical debt in the same change.
  If you discover unrelated problems, leave them untouched unless they prevent the requested change from being correct.
  Keep behavior changes and refactors separate whenever practical.

Reuse existing architecture
Before creating a new:

- component;
- hook;
- utility;
- service;
- API client;
- validation schema;
- state store;
- test helper;
- abstraction;
  search for an existing equivalent.
  Do not create a second solution to a problem the repository already solves.
  Follow the existing:
- component patterns;
- state-management approach;
- data-fetching approach;
- API layer;
- validation strategy;
- styling system;
- error-handling conventions;
- testing utilities.
  Introducing a new library or architectural pattern requires a concrete reason.

React
Follow the React patterns already established in the repository.
Components

- Keep components focused on a coherent responsibility.
- Prefer composition over duplicated components.
- Keep reusable business logic outside JSX.
- Preserve existing component APIs unless the task requires changing them.
- Reuse existing UI primitives.
  Rendering
  Keep render logic pure.
  Do not perform side effects during render.
  Prefer deriving values from props/state over storing duplicated derived state.
  Effects
  Treat useEffect as synchronization with an external system, not as a general-purpose lifecycle hook.
  Before adding an effect, verify that the behavior cannot be expressed as:
- derived render state;
- an event handler;
- existing application/data-fetching machinery.
  Effects that create subscriptions, timers, listeners, observers, or other resources must clean them up correctly.
  Do not suppress effect dependency warnings without understanding and fixing the underlying dependency issue.
  Memoization
  Do not add useMemo, useCallback, or memo by default.
  Use memoization when:
- existing repository patterns require it;
- it prevents a demonstrated performance problem;
- it is necessary for a specific referential-stability contract.
  Prefer simple code over speculative optimization.

TypeScript
Use the type system to model the actual domain.

- Preserve the repository's strict TypeScript configuration.
- Prefer precise types over casts.
- Prefer narrowing over assertions.
- Prefer unknown for genuinely unknown external data.
- Use discriminated unions when they make states explicit.
- Keep public/shared APIs strongly typed.
  Do not use type assertions to hide a problem that should be fixed in the type model.
  Do not introduce any, @ts-ignore, or rule-disabling casts merely to make TypeScript pass.
  If an unsafe boundary is unavoidable, isolate it at that boundary and make the assumption explicit.

State and data
Before adding state, determine whether the value is:

- derived data;
- local UI state;
- server/cache state;
- URL state;
- persistent state;
- global application state.
  Use the existing repository solution for that category.
  Avoid multiple sources of truth.
  Do not copy server/cache state into local React state unless there is a clear reason.
  Do not introduce a second state-management or data-fetching mechanism.
  When changing asynchronous behavior, consider:
- loading;
- error;
- empty;
- cancellation;
- stale responses;
- races;
- retries;
- optimistic updates;
- rollback.
  Follow the existing data-fetching library and cache conventions.

Boundaries
Treat data crossing a runtime boundary as untrusted until validated appropriately.
Examples:

- API responses;
- URL/query parameters;
- form input;
- localStorage;
- browser APIs;
- third-party SDKs;
- environment variables;
- persisted data.
  Do not use a TypeScript type assertion as a substitute for runtime validation when the data is actually untrusted.
  Keep validation at the appropriate boundary and follow existing project conventions.

Errors
Do not silently swallow errors.
When changing error handling, preserve the repository's existing:

- error propagation;
- logging;
- user-facing error states;
- retry behavior;
- monitoring/telemetry.
  Do not expose internal errors or sensitive information to users.
  Do not remove existing error handling unless the new behavior intentionally replaces it.

Public/shared code
Before changing a shared component, hook, type, utility, API, route, or configuration:

1. search all relevant consumers;
2. understand the existing contract;
3. determine compatibility impact;
4. update affected tests.
   Do not assume an exported symbol is safe to change because local references are limited.
   Prefer backward-compatible changes when the existing contract requires them.

Dependencies
Before adding a dependency:

1. search the repository for an existing solution;
2. check whether an existing dependency already provides it;
3. check whether the platform/runtime already provides it;
4. consider bundle/runtime impact;
5. follow the repository's package manager and lockfile rules.
   Do not add a dependency for trivial functionality.
   Do not upgrade unrelated dependencies as part of another task.

Tests
Tests are part of the implementation.
When behavior changes:

- update existing tests;
- add coverage for new behavior;
- preserve regression coverage.
  Prefer tests that verify behavior and contracts rather than implementation details.
  For bug fixes:

1. reproduce or establish the failure mechanism;
2. add regression coverage when practical;
3. implement the smallest fix;
4. run the regression test;
5. run the affected test suite.
   Do not modify tests merely to make them pass.
   If the expected product behavior intentionally changed, update the test to represent that new behavior.

Verification
Use the repository's actual scripts and CI configuration. Do not invent commands.
At minimum, run the checks relevant to the changed code:

- formatter, when applicable;
- lint;
- TypeScript/type checks;
- targeted tests;
- broader affected tests;
- build, when the change can affect production output.
  Prefer targeted checks first, then broader checks.
  If a check fails:

1. determine whether the failure is caused by the change;
2. fix the underlying issue when it is;
3. rerun the relevant check.
   Do not disable a check to obtain a green result.
   If a required check cannot be run, report that explicitly.

Diff review
Before finishing any implementation:

1. inspect git diff;
2. inspect git status;
3. verify only intended files changed;
4. remove debug code and temporary changes;
5. check for accidental formatting churn;
6. check for secrets or sensitive data;
7. confirm the final diff matches the requested scope.
   Review the final diff as if reviewing another engineer's pull request.

Configuration and generated files
Follow repository-specific rules for generated files.
Do not manually edit generated output when a source/generator exists.
For configuration changes:

- identify all consumers;
- preserve existing defaults unless intentionally changing them;
- update relevant examples/docs/tests when required;
- run the checks that exercise the configuration.
  Do not change global configuration to solve a local problem.

Security
Never commit:

- secrets;
- tokens;
- credentials;
- private keys;
- real production data.
  Do not weaken authentication, authorization, validation, or security tooling to make a task easier.
  Do not introduce unsafe HTML, URL, storage, or browser API usage when an existing safe abstraction exists.

Change size
Keep changes reviewable.
If a change becomes substantially larger than necessary:

1. stop;
2. determine whether scope has expanded;
3. split unrelated work;
4. consider whether the task should be staged.
   For large features or refactors, create a plan before implementation when the repository provides a planning convention.

Comments
Prefer clear code over comments.
Add comments only when they explain something that cannot be made obvious from the code itself, especially:

- non-obvious invariants;
- external limitations;
- deliberate compatibility behavior;
- subtle concurrency or lifecycle constraints;
- security assumptions.
  Do not add comments that merely restate the implementation.

When existing code is imperfect
Do not rewrite existing code merely because it could be cleaner.
When touching legacy code:

- preserve behavior;
- follow local conventions;
- make the smallest safe improvement required by the task.
  If substantial technical debt blocks the requested change, address only the minimum necessary portion or explain why the task needs to be split.

Completion criteria
Do not declare the task complete until:

- the requested behavior is implemented;
- existing behavior is preserved unless intentionally changed;
- relevant tests are updated;
- relevant verification passes;
- the final diff has been reviewed;
- no unrelated changes remain.
  The final response must distinguish between:
- checks that passed;
- checks that failed;
- checks that were not run.
  Never imply that validation was performed when it was not.

Repository commands
The following commands are authoritative for this repository.

- Install: <INSTALL_COMMAND>
- Development: <DEV_COMMAND>
- Lint: <LINT_COMMAND>
- Format: <FORMAT_COMMAND>
- Typecheck: <TYPECHECK_COMMAND>
- Unit tests: <UNIT_TEST_COMMAND>
- Integration tests: <INTEGRATION_TEST_COMMAND>
- E2E: <E2E_COMMAND>
- Build: <BUILD_COMMAND>
  Read package.json, workspace configuration, and CI before replacing these placeholders.

Repository-specific architecture
Document only facts that are specific to this repository and are not obvious from the code.
Examples:

- where feature modules live;
- which layer owns API calls;
- which library owns server state;
- which library owns client state;
- where shared UI primitives live;
- where domain logic belongs;
- generated-code boundaries;
- important architectural constraints.
  Prefer nested AGENTS.md files for rules that apply only to a specific package or domain.
