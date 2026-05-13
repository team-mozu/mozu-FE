# System Design — mozu-FE

Runtime view of the frontend. Pairs with [architecture.md](./architecture.md) (structural view) and [PROJECT_DOMAIN.md](./PROJECT_DOMAIN.md) (business domain). For the backend equivalent see [../../mozu-BE-v2/docs/system-design.md](../../mozu-BE-v2/docs/system-design.md).

## 1. Process model

Two independent SPAs, served on subdomains, hitting the same backend:

```
admin.localhost:3002        student.localhost:3001
        │                            │
        └──────────────┬─────────────┘
                       ▼
               VITE_SERVER_URL  (staging or local)
                       │
                       ▼
                  mozu-BE-v2
```

Both apps share one HTTP client (`packages/util-config/src/services/apiClient.ts`) but maintain independent SSE connections, query caches, and cookie stores.

## 2. Auth flow

```
[admin]
SignInPage → POST /organ/login → tokens → cookies
                                            │
                                            ▼
                                  ProtectedRoute reads cookie
                                            │
                                            ▼
                              ClassManagement page mounts
                              tanstack Query fires GET /lesson
```

```
[student]
HomePage → POST /team/participate {code, name} → tokens → cookies
                                                          │
                                                          ▼
                                              SSEProtectedRoute opens SSE
                                                          │
                                                          ▼
                                              WaitingPage subscribes to TEAM_SSE_CONNECTED
```

Token refresh — see [architecture.md §6](./architecture.md#6-http-layer). **Important:** the SSE connection is **not** automatically re-opened on token refresh today; the FE only retries REST. Audit before relying on long-lived lesson sessions.

## 3. Lesson runtime — admin side

```
ClassEnvironment ────────────┐
   │                         │ open SSE /lesson/sse/{id}
   │ click "모의주식투자 시작하기"
   ▼
POST /lesson/{id}/start
   │
   ▼
InvestmentPreparation
   │  SSE events arrive:
   │    TEAM_PART_IN          → render joining teams
   │    LESSON_SSE_CONNECTED  → confirm channel
   ▼
admin clicks "Next round"
   │
   ▼
POST /lesson/{id}/next
   │
   ▼
ImprovedClassMonitoringPage
   │ SSE events:
   │   CLASS_NEXT_INV_START   → bump local round state
   │   per-team progress      → update dashboard rows
   ▼
admin clicks "End"  →  POST /lesson/{id}/end
```

`SSEProvider` (in admin) wraps `InvestmentPreparation` and `ImprovedClassMonitoringPage` in the route tree so both share one connection per `lessonId`. See `packages/admin/src/app/routes/protected.tsx`.

## 4. Lesson runtime — student side

```
home → participate → tokens → waiting (SSE open)
                                  │ CLASS_START
                                  ▼
                              stock-trading (round n)
                                  │ CLASS_NEXT_INV_START
                                  ▼
                              stock-trading (round n+1)
                                  │ CLASS_END
                                  ▼
                              ending → result
```

`SSEContext` initializes `event-source-polyfill` against `${VITE_SERVER_URL}/team/sse`. Listeners are wired up in `useTypeSSE.tsx` — the hook accepts a map `{ eventName: handler }` and registers each via `eventSource.addEventListener`.

## 5. SSE event catalog (FE expectations)

Authoritative source: [../../mozu-BE-v2/docs/SSE_API_SPECIFICATION.md](../../mozu-BE-v2/docs/SSE_API_SPECIFICATION.md). FE-side mapping (verify on next audit):

| Event | Channel | Consumer page | Effect |
|-------|---------|--------------|--------|
| `TEAM_SSE_CONNECTED` | team | student/waiting | gate "ready" state |
| `LESSON_SSE_CONNECTED` | lesson-organ | admin/monitoring | confirm channel |
| `TEAM_PART_IN` | lesson-organ | admin/InvestmentPreparation | append joining team row |
| `CLASS_START` | team | student/stock-trading | enter round 1 |
| `CLASS_NEXT_INV_START` | both | both | advance round, refetch prices |
| `CLASS_END` | both | both | navigate to result/ending |

## 6. Failure modes & current gaps

- **SSE not re-opened on token refresh.** The polyfill keeps sending the old token until the connection dies; reconnect logic is in `onerror` only. Fix idea: subscribe to refresh events and call `eventSource.close()` + recreate.
- **No Last-Event-ID handling.** Dropped events during transient disconnects are lost. If BE adds replay, the FE must persist the last id and pass it as a header (`event-source-polyfill` supports custom headers).
- **TanStack Query + SSE double source.** Some monitoring widgets may both poll and consume SSE. Audit `ImprovedClassMonitoringPage` to ensure one source of truth.
- **Login page double-submit guarded by ref + form submit** — see commit history; do not regress.
- **Cookie domains.** Admin uses `admin.localhost`; student uses `student.localhost`. In staging both apps live under `*.vercel.app`. Mismatches in `.env` will silently fail logins.

## 7. Build / deploy

- Production builds emit to `packages/{admin,student}/dist/`. CI: `yarn build:prod` per app.
- Hosting: Vercel (`mozu-admin.vercel.app`, `mozu-student.vercel.app`) per the BE CORS allowlist.
- Lighthouse CI configured (`lighthouserc.js`, `packages/admin/lhci_reports/`) but not in mandatory pipeline.

## 8. Open questions

- Is `useTypeSSE` reconnect bounded? (exponential backoff vs immediate retry storm)
- Where does the student get the lesson timer countdown — SSE event, REST poll, or client clock?
- Is there a global error boundary that catches `EventSourcePolyfill` thrown errors? (The default boundary in admin shows a generic "Unexpected Application Error".)

## Related docs

- [architecture.md](./architecture.md) — structural view
- [PROJECT_DOMAIN.md](./PROJECT_DOMAIN.md) — business domain & user flows
- [../../mozu-BE-v2/docs/system-design.md](../../mozu-BE-v2/docs/system-design.md) — backend runtime
- [../../mozu-BE-v2/docs/SSE_API_SPECIFICATION.md](../../mozu-BE-v2/docs/SSE_API_SPECIFICATION.md) — SSE wire format
