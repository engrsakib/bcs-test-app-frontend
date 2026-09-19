# Admin dashboard — notifications setup

This guide is for the **admin web app** (`bcs-test-app-frontend`). It explains how notifications work and what you must configure so they behave reliably in production.

## Admin vs student (important)

| | **Admin web app** | **Student Flutter app (`exam-hub`)** |
|---|-------------------|--------------------------------------|
| Delivery | **Server-Sent Events (SSE)** while the dashboard is open | **Firebase Cloud Messaging (FCM)** + in-app inbox |
| Token API | Not used | `POST /user/save-token` |
| Inbox API | `GET /notifications?audience=admin` | `GET /notifications?audience=user` |
| Real-time | `GET /notifications/stream` (proxied as `/api/notifications/stream`) | Push + pull |

The admin panel does **not** use FCM. “Push” in the admin UI means **instant updates over SSE** when an admin is logged in and the notification drawer (or hook) is active. If the tab is closed, notifications are still **saved in MongoDB** and appear on the next login or when the list is refreshed (polling every 15 seconds as a fallback).

Student mobile **push** is documented in [`server/notification.md`](../../../server/notification.md) (Firebase env + save-token).

---

## Why admin notifications work (end-to-end)

1. A module action runs (create/update exam, question, user, etc.).
2. The service publishes an event on **EventBus** (e.g. `EXAM_CREATED`, `QUESTION_UPDATED`).
3. **`initWorker()`** in `server/src/app.ts` enqueues the event.
4. **Worker** calls the matching handler → **`processNotification`** with **`audience: "admin"`**.
5. **`notifyAllAdmins`**:
   - Creates a **Notification** document per admin (`userId` = admin `_id`, `audience: "admin"`).
   - Calls **`sseManager.broadcast(adminId, …)`** for each admin so open dashboards update immediately.
6. The admin frontend **`useNotifications`** hook:
   - Loads history via **`/api/proxy/notifications?audience=admin`**.
   - Opens **`EventSource("/api/notifications/stream")`** for live items.
   - Polls every **15s** if SSE reconnects fail.

No Firebase step is required for admin.

---

## Admin app setup checklist

### 1. Backend must be running with the worker

- Confirm `initWorker()` runs on API startup (`server/src/app.ts`).
- Without the worker, events are never processed and **no admin notifications are created**.

### 2. Environment variables (admin SSE only)

- **`BACKEND_BASE_URL`** (or equivalent used by `runtimeEnv.backendBaseUrl` in the Next.js app) must point to the live API (e.g. `https://api.example.com/api/v1` or your mounted path).
- Admin JWT must be issued on login and stored in cookies (`access_token` or `cbd_atkn_91f2a`) so the stream route can forward `Authorization`.

### 3. Firebase (optional for admin; required for student app)

- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` on the **server** are for **student FCM**, not admin SSE.
- Admin notifications still **save to DB** even if Firebase is misconfigured; students would miss push until Firebase is fixed.

### 4. Reverse proxy / hosting (common failure)

SSE breaks if the proxy **buffers** the stream. Ensure:

- **`X-Accel-Buffering: no`** (nginx) for `/notifications/stream` and the Next proxy `/api/notifications/stream`.
- **`Cache-Control: no-cache, no-transform`** (already set in API and Next route).
- Long-lived connections allowed (no aggressive idle timeout on the stream path).

The Next.js route lives at:

- `src/app/api/notifications/stream/route.ts` — proxies to `{backendBaseUrl}/notifications/stream`.

### 5. CORS and cookies

- Admin fetches use **`credentials: "include"`**.
- API and admin site cookie domain/path must allow the session cookie on both proxy REST and SSE routes.

### 6. Verify in the browser

1. Log in as admin, open the notification drawer.
2. In DevTools → Network, confirm **`/api/notifications/stream`** stays **pending** (open connection).
3. Trigger an action (e.g. create a question) from another tab/user.
4. A new row should appear without full page reload; **`event: notification`** in the stream (see `notification.sse.ts`).

If the stream returns **401**, fix login/cookie/proxy auth. If **502**, check `BACKEND_BASE_URL` and API reachability.

---

## EventBus event names (admin inbox)

These are published to the worker and, with default handlers, create **admin** notifications (plus activity log where applicable):

- `STUDY_PLAN_CREATED`, `STUDY_PLAN_UPDATED`
- `EXAM_SOLUTION_CREATED`, `EXAM_SOLUTION_UPDATED`
- `EXAM_ROUTINE_CREATED`, `EXAM_ROUTINE_UPDATED`
- `YOUTUBE_VIDEO_ADDED`, `YOUTUBE_VIDEO_UPDATED`
- `RESULT_PUBLISHED`, `RESULT_UPDATED`
- `BOOK_UPLOADED`, `BOOK_UPDATED`
- `EXAM_CREATED`, `EXAM_UPDATED`, `EXAM_DELETED`
- `GUIDELINE_CREATED`, `GUIDELINE_UPDATED`
- `ANNOUNCEMENT_CREATED`, `ANNOUNCEMENT_UPDATED`, `ANNOUNCEMENT_DELETED`
- `QUESTION_CREATED`, `QUESTION_UPDATED`, `QUESTION_DELETED`
- `QUESTION_TOPIC_CREATED`, `QUESTION_TOPIC_UPDATED`, `QUESTION_TOPIC_DELETED`
- `USER_REGISTERED`, `USER_UPDATED`, `USER_DELETED`
- `ADMIN_CREATED`, `ADMIN_UPDATED`, `ADMIN_DELETED`
- `EXAM_SUBMITTED`

**Student-only broadcasts** (FCM + user inbox, not via admin SSE handlers) use `notifyAllUsers` / `notifyUser` in `student-notification.service.ts`, for example:

- Exam go live / started / ended / results published
- Announcements to all students
- Top-3 leaderboard congratulations (`kind` values such as `exam_started`, `results_published`, etc.)

---

## API reference (admin)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/notifications/stream` | SSE live updates (admin JWT) |
| GET | `/notifications?audience=admin&page=&limit=` | Paginated inbox |
| GET | `/notifications/unread?audience=admin` | Unread list |
| PATCH | `/notifications/:id/read` | Mark one read |
| PATCH | `/notifications/read-all` | Mark all read |

Frontend wrappers:

- REST: `/api/proxy/notifications…`
- SSE: `/api/notifications/stream`

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| No notifications ever | Worker not initialized; event not published from service |
| History works, no live updates | SSE blocked, wrong proxy buffering, or stream 401/502 |
| Live updates only for some admins | That admin has no open stream; others still get DB rows |
| Students get no phone push | Missing/invalid FCM token or Firebase env (see `server/notification.md`) |
| Admin expects phone push | Admin product uses SSE + inbox, not FCM — use student app for mobile push |

---

## Related code

- Admin UI: `src/hooks/useNotifications.ts`, `src/components/layouts/NotificationDrawer.tsx`
- SSE proxy: `src/app/api/notifications/stream/route.ts`
- Server: `server/src/modules/notification/notification.helpers.ts` (`notifyAllAdmins`, `processNotification`)
- Server SSE: `server/src/modules/notification/notification.sse.ts`
- Worker: `server/src/events/Worker.ts`
