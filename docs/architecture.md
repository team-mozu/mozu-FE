# Architecture — mozu-FE

Frontend monorepo for Mozu. Yarn 4 Berry workspaces, Vite, React 18, TypeScript, Emotion, TanStack Query, React Router 7.

Pairs with [PROJECT_DOMAIN.md](./PROJECT_DOMAIN.md) (business domain) and [system-design.md](./system-design.md) (runtime / data flow).

## 1. Workspaces

```
packages/
├── admin/          @mozu/admin     — Vite SPA, teacher dashboard, port 3002
├── student/        @mozu/student   — Vite SPA, student app, port 3001
├── ui/             @mozu/ui        — shared components (Input, SvgIcon, Toast, …)
├── util-config/    @mozu/util-config — axios instance, env, cookies, auth helpers
└── design-token/   @mozu/design-token — colors, fonts, spacing
```

Dependency direction: `admin`, `student` → `ui`, `util-config`, `design-token`. The two apps never import from each other.

## 2. Per-app structure (FSD — Feature-Sliced Design)

Inside both `packages/admin/src/` and `packages/student/src/`:

```
app/         providers, layouts, routes
pages/       route-level screens
widgets/     composite UI sections (tables, dashboards, sidebars)
features/    user-facing actions (CRUD, login, monitoring)
entities/    domain queries / mutations / API clients
shared/      pure helpers, hooks, low-level UI
```

Strict layer rule (bottom-up imports only): `shared → entities → features → widgets → pages → app`. Cross-layer "down" imports are not allowed; cross-slice imports inside the same layer go via the slice's `index.ts` barrel.

## 3. Admin app — surface

- **Pages**: `class/`, `stock/`, `article/`, `monitoring/`, `login/`
- **Features**: `classManagement`, `classToggleStar`, `classDelete`, `classListFiltering`, `articleCRUD`, `stockCRUD`, `monitoring`
- **Widgets**: `classListSection`, `classTable`, `monitoringDashboard`, `articleTable`, `stockTable`, `emptyState`, `classManagement`
- **Entities**: `organ` (auth/login), `class`, `article`, `monitoring`, `stock`

Routing entry: `app/App.tsx` mounts `RouterProvider` with `app/routes/router.tsx` (browser router). Protected vs public split: `ProtectedRoute.tsx` reads the `accessToken` cookie and redirects to `/signin` if missing.

## 4. Student app — surface

- **Pages**: `home/`, `stock-trading/`, `news/`, `result/`, `waiting/`, `ending/`, `mocks/`
- **Features**: `stock-trading`, `news-reading`, `ranking-view`, `session-management`
- **Entities**: `class`, `stock`, `portfolio`, `news`, `transaction`, `user`

## 5. State / data

- **TanStack Query** owns server cache (per-entity `queries.ts` + `mutations.ts`).
- Local UI state via React hooks, `useForm` (custom in `shared/lib/hooks/`), `useOptimistic`.
- Auth tokens persisted to cookies via `universal-cookie` (helpers in `util-config/src/utils/cookies.ts`).
- Cookie domain configurable per environment: `VITE_ADMIN_COOKIE_DOMAIN`, `VITE_STUDENT_COOKIE_DOMAIN`.

## 6. HTTP layer

`packages/util-config/src/services/apiClient.ts` exports a single axios instance:

- `baseURL = VITE_SERVER_URL`
- Request interceptor: attaches `Authorization: Bearer <accessToken>` (skipped for login and token-reissue endpoints), and auto-converts to `multipart/form-data` for `/item` and `/article` POST/PATCH.
- Response interceptor: on 401/403, calls `reIssueToken`, retries the failed request, and queues siblings. On refresh failure, clears tokens and `window.location.replace('/signin')`.

## 7. SSE layer

Two channels with parallel implementations (kept separate for cookie / auth scope):

| App | Context | Hook | URL |
|-----|---------|------|-----|
| admin | `packages/admin/src/shared/lib/contexts/SSEContext.tsx` | `shared/lib/hooks/useTypeSSE.ts` | `${VITE_SERVER_URL}/lesson/sse/${lessonId}` |
| student | `packages/student/src/shared/contexts/SSEContext.tsx` | `shared/useTypeSSE.tsx` | `${VITE_SERVER_URL}/team/sse` |

Both use `event-source-polyfill` (the native `EventSource` cannot send `Authorization`). Events are dispatched via `addEventListener(<EVENT_NAME>, …)`. See [system-design.md](./system-design.md) for the event catalog and reconnect strategy, and the backend's [SSE_API_SPECIFICATION.md](../../mozu-BE-v2/docs/SSE_API_SPECIFICATION.md) for the wire contract.

## 8. Build / Run

- Install: `yarn install` (PnP, no `node_modules`)
- Dev: `yarn dev` (concurrent admin + student)
- Build: `yarn build` (per workspace tsc + vite build)
- Env: root `.env` is the source of truth; `node copyEnv.js` propagates to each package as a sibling `.env`. Skip with `BRANCH=…` env per environment.

## 9. Cross-cutting

- **Lint/format**: Biome 2 (`biome.json`).
- **Commits**: Conventional Commits via commitlint; Husky `prepare-commit-msg` prefixes the JIRA ticket parsed from the branch name.
- **Routing**: import from `react-router-dom` only (a recent unification removed mixed `react-router` imports — Yarn PnP otherwise loads two router instances).
- **TS LSP**: with PnP, "Cannot find module" reports for `@emotion/*`, `@mozu/*`, `react-router-dom` are false positives; runtime resolves correctly.

## Related docs

- [system-design.md](./system-design.md) — runtime, data flow, SSE sequence
- [PROJECT_DOMAIN.md](./PROJECT_DOMAIN.md) — business domain & user flows
- `../CLAUDE.md` / `../AGENT.md` — agent session brief
- Backend counterparts: `../../mozu-BE-v2/docs/architecture.md`, `../../mozu-BE-v2/docs/system-design.md`
