# Wassalni Backend — Complete Overview Documentation

> **Project**: Wassalni Transport Booking Application  
> **Stack**: Node.js (ESM) · Express 5 · Supabase (PostgreSQL) · PayMee Payment Gateway  
> **Last Updated**: April 11, 2026 — Bugs N1/N2/N3 fixed, pushed to origin/backend

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Architecture Overview](#2-architecture-overview)
3. [Entry Point — server.js](#3-entry-point--serverjs)
4. [Configuration Layer](#4-configuration-layer)
5. [Middleware Layer](#5-middleware-layer)
6. [Models Layer](#6-models-layer)
7. [Routes Layer](#7-routes-layer)
8. [Controllers Layer](#8-controllers-layer)
9. [Services Layer](#9-services-layer)
10. [Webhooks](#10-webhooks)
11. [Utils](#11-utils)
12. [Database Schema & Relationships](#12-database-schema--relationships)
13. [Data Flow Diagrams](#13-data-flow-diagrams)
14. [Complete API Endpoint Reference](#14-complete-api-endpoint-reference)
15. [Cross-File Dependency Map](#15-cross-file-dependency-map)
16. [Known Issues & Notes](#16-known-issues--notes)
17. [Environment Variables Reference](#17-environment-variables-reference)
18. [Sequence Diagrams](#18-sequence-diagrams)
19. [Error Response Catalog](#19-error-response-catalog)
20. [Quick Start Guide](#20-quick-start-guide)
21. [Testing Guide](#21-testing-guide)
22. [Deployment Notes](#22-deployment-notes)
23. [Codebase Summary](#23-codebase-summary)

---

## 1. Project Structure

```
backend/
├── server.js                    ← App entry point & route mounting
├── package.json                 ← Dependencies & ESM config
├── .env                         ← Environment variables (secrets)
└── src/
    ├── config/
    │   ├── supabase.js          ← Supabase client singleton
    │   └── paymee.js            ← PayMee API config object
    ├── middlewares/
    │   ├── auth.middleware.js   ← requireAdmin guard
    │   ├── requireAuth.js       ← Any authenticated user guard
    │   ├── requireController.js ← Controllers-only guard
    │   └── requirePassenger.js  ← Passengers-only guard
    ├── models/
    │   ├── user.model.js        ← User class + USER_ROLES enum
    │   ├── ticket.model.js      ← TICKET_STATUS enum (+ bug: class named User)
    │   └── payment.model.js     ← Transaction class + type/method/status enums
    ├── routes/
    │   ├── user.routes.js       ← /users/*
    │   ├── admin.routes.js      ← /admin/* (requireAdmin applied globally)
    │   ├── payment.routes.js    ← /api/payments/* & /token/*
    │   ├── ticket.routes.js     ← /ticket/*
    │   ├── transport.routes.js  ← /transports/* (requireAdmin on POST/PUT/DELETE)
    │   ├── station.routes.js    ← /stations/* (requireAdmin on POST/PUT/DELETE)
    │   ├── route.routes.js      ← /routes/* (requireAdmin on POST/PUT/DELETE)
    │   ├── schedule.routes.js   ← /schedules/* (requireAdmin on POST/PUT/DELETE)
    │   └── names.js             ← API endpoint reference comments (not a router)
    ├── controllers/
    │   ├── user.controller.js   ← Auth flows & user management
    │   ├── admin.controller.js  ← Admin dashboard & management
    │   ├── payment.controller.js← Recharge & token operations
    │   ├── ticket.controller.js ← Ticket creation & QR logic
    │   ├── transport.controller.js ← Transport CRUD
    │   ├── station.controller.js   ← Stations CRUD
    │   ├── route.controller.js     ← Route CRUD
    │   └── schedule.controller.js  ← Schedule CRUD
    ├── services/
    │   ├── user.service.js      ← Auth logic, login flows, token redemption
    │   ├── admin.service.js     ← Dashboard stats, user/ticket/transaction management
    │   ├── payment.service.js   ← PayMee API integration, token math
    │   ├── ticket.service.js    ← Ticket creation, QR generation
    │   ├── transport.service.js ← Transport CRUD against Supabase
    │   ├── station.service.js   ← Stations CRUD against Supabase (⚠️ has stray Express import)
    │   ├── route.service.js     ← Route + route_stations CRUD
    │   ├── schedule.service.js  ← Schedule creation, conflict detection, cancellation filter
    │   └── supabase.service.js  ← Placeholder file (currently empty)
    ├── utils/
    │   ├── validation.js        ← Input schemas + validate() middleware factory
    │   └── qr.utils.js          ← QR utilities placeholder (currently empty)
    └── webhooks/
        ├── index.js             ← Webhook router (POST /webhooks/paymee)
        └── paymeeWebhook.js     ← PayMee payment confirmation handler
```

**File Count Summary:**

| Layer | Files | Notes |
|---|---|---|
| Config | 2 | — |
| Middlewares | 4 | — |
| Models | 3 | — |
| Routes | 9 | +`names.js` (comment-only API reference) |
| Controllers | 8 | Renamed `stations` → `station` |
| Services | 9 | Renamed `stations` → `station`; +empty `supabase.service.js` |
| Webhooks | 2 | — |
| Utils | 2 | +empty `qr.utils.js` placeholder |
| Root | 2 (server.js, package.json) | — |
| **Total** | **41 files** | |

---

## 2. Architecture Overview

The backend follows a strict **3-layer MVC architecture**:

```
HTTP Request
     │
     ▼
┌──────────────────────────────────────────┐
│              server.js                   │
│   (Express app · CORS · Route mounting)  │
└───────────────┬──────────────────────────┘
                │
     ┌──────────▼──────────┐
     │     MIDDLEWARES      │
     │  requireAuth         │
     │  requireAdmin        │
     │  requireController   │
     │  requirePassenger    │
     │  validate()          │
     └──────────┬───────────┘
                │
     ┌──────────▼──────────┐
     │      ROUTES          │
     │  (URL → Controller)  │
     └──────────┬───────────┘
                │
     ┌──────────▼──────────┐
     │    CONTROLLERS       │
     │  (req/res handling)  │
     └──────────┬───────────┘
                │
     ┌──────────▼──────────┐
     │      SERVICES        │
     │  (Business Logic)    │
     └──────────┬───────────┘
                │
     ┌──────────▼──────────┐
     │    SUPABASE DB       │
     │  (PostgreSQL + Auth) │
     └─────────────────────┘
```

**Two controller style patterns exist:**

| Pattern | Used by | Export style |
|---|---|---|
| Named function exports | `user`, `admin`, `payment`, `ticket` | `export const fn = ...` |
| Class instance (default export) | `route`, `schedule`, `station`, `transport` | `export default new Controller()` |

---

## 3. Entry Point — `server.js`

**Role**: Bootstraps the Express application, applies global middleware, mounts all routers, starts the HTTP server on port `3000`.

**Key decisions:**
- `"type": "module"` in `package.json` makes this ESM — all imports use `import/export` not `require`.
- CORS is configured to allow only `process.env.FRONTEND_URL` (defaults to `http://localhost:5173`).
- Payment routes are **double-mounted**: `/api/payments` (for the main recharge flow) AND `/token` (for balance/verification utilities).
- The webhook router is mounted separately at `/webhooks` before the normal API routes.

```js
// Critical: CORS configured before all routes
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Both urlencoded + json parsers needed (PayMee sends form-encoded data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Route Mount Table:**

| Mount Point | Router File | Purpose |
|---|---|---|
| `/webhooks` | `webhooks/index.js` | External payment callbacks |
| `/api/payments` | `payment.routes.js` | Recharge & PayMee flow |
| `/token` | `payment.routes.js` | Token balance utilities |
| `/users` | `user.routes.js` | Auth & user management |
| `/ticket` | `ticket.routes.js` | Ticket booking & QR |
| `/admin` | `admin.routes.js` | Admin dashboard |
| `/transports` | `transport.routes.js` | Transport fleet management |
| `/stations` | `station.routes.js` | Station management |
| `/routes` | `route.routes.js` | Route management |
| `/schedules` | `schedule.routes.js` | Schedule management |

---

## 4. Configuration Layer

### `src/config/supabase.js`
**Role**: Creates and exports **a single shared Supabase client** used by every service file.

```js
export const supabase = createClient(supabaseUrl, supabaseKey);
```

- Throws at startup if `SUPABASE_URL` or `SUPABASE_KEY` is missing — fast-fail design.
- Every service imports from here: `import { supabase } from '../config/supabase.js'`
- Uses the **Service Role Key** (bypasses RLS) — important security consideration.

### `src/config/paymee.js`
**Role**: Convenience config object for PayMee credentials. **Note**: Currently unused — `payment.service.js` reads env vars directly instead.

```js
export const paymeeConfig = {
  apiKey: process.env.PAYMEE_API,
  apiUrl: process.env.PAYMEE_URL,
  ngrokUrl: process.env.NGROK_URL,
}
```

---

## 5. Middleware Layer

All middlewares follow the same pattern: extract Bearer token → validate with Supabase → check role → attach `req.user` → `next()`.

```
Request → [Extract token from Authorization header]
        → [Call supabase.auth.getUser(token)]
        → [Fetch user role from public.users table]
        → [Check role matches requirement]
        → [Attach user to req.user]
        → [Call next()]
```

### Middleware Summary Table

| File | Exported As | Who Passes | Used In Routes |
|---|---|---|---|
| `auth.middleware.js` | `default requireAdmin` | `admin` or `superAdmin` roles | All `/admin/*`, mutation routes in transport/route/schedule/stations |
| `requireAuth.js` | `{ requireAuth }` | Any authenticated user (any role) | `GET /users/getuseressentialinfo` |
| `requireController.js` | `{ requireController }` | `controller` role only | `POST /ticket/getticketstatusbyqrdata` |
| `requirePassenger.js` | `{ requirePassenger }` | `passenger` role only | Ticket creation, QR retrieval, recharge |

> ⚠️ **Note**: `requireAdmin` in `auth.middleware.js` accepts **both** `admin` AND `superAdmin`. There is currently **no `requireSuperAdmin`** middleware to enforce super-admin-only actions.

### Key Code: Token Verification Pattern (same across all 4 middlewares)

```js
const token = req.headers.authorization?.split(' ')[1];
const { data: { user }, error } = await supabase.auth.getUser(token);
const { data: userData } = await supabase.from('users').select('role').eq('user_id', user.id).single();
if (userData.role !== 'expected_role') return res.status(403).json({ error: 'Access denied' });
req.user = user;
next();
```

---

## 6. Models Layer

Models define **data shapes** and **enum constants**. They are NOT ORM models — Supabase is the source of truth, these are reference objects used for type safety and documentation.

### `user.model.js`

```js
export const USER_ROLES = {
  PASSENGER: "passenger",
  ADMIN:    "admin",
  CONTROLLER: "controller",
  SUPERADMIN: "superAdmin",
};
```

Contains documented business rules (e.g., "controller email must be first_name.controller@gmail.com").

### `ticket.model.js`

```js
export const TICKET_STATUS = {
  ACTIVE: "Active",  USED: "Used",
  EXPIRED: "Expired", REFUNDED: "Refunded"
};
```

> ⚠️ **Bug**: The class is named `User` instead of `Ticket` (line 7). Also `purshase_date` is a typo — DB column is `purchase_date`.

### `payment.model.js`

Defines three enums used in `payment.service.js`:

```js
TRANSACTION_TYPES  = { RECHARGE: "Recharge", PAYMENT: "Payment" }
TRANSACTION_METHODS = { ONLINE: "online", STATION: "station" }
TRANSACTION_STATUS  = { PENDING: "pending", COMPLETED: "completed", FAILED: "failed" }
```

Also contains 8 documented business rules for transaction validity (e.g., "if method is STATION, type can only be RECHARGE").

---

## 7. Routes Layer

Routes are thin wiring files. Their only jobs are: parse URL pattern → apply middleware → call controller.

### Admin Routes (`/admin/*`) — All guarded by `requireAdmin`

| Method | Endpoint | Controller | Notes |
|---|---|---|---|
| `GET` | `/admin/dashboard` | `getDashboardStats` | Total users, revenue, transactions |
| `POST` | `/admin/createcontroller` | `createController` | + `validate(createControllerSchema)` |
| `GET` | `/admin/users` | `getAllUsers` | List all users |
| `DELETE` | `/admin/users/:userId` | `deleteUser` | Permanent deletion |
| `GET` | `/admin/transactions` | `getAllTransactions` | All payment transactions |
| `GET` | `/admin/tickets` | `getAllTickets` | All issued tickets |

### User Routes (`/users/*`)

| Method | Endpoint | Middleware | Controller |
|---|---|---|---|
| `POST` | `/users/createuser` | none | `createUser` |
| `POST` | `/users/getuseressentialinfo` | `requireAuth` | `getUserEssentialInfo` |
| `POST` | `/users/redeemtokensfromuser` | **none** ⚠️ | `redeemTokensFromUser` |
| `GET` | `/users/auth/google` | none | `googleSignIn` |
| `GET` | `/users/auth/callback` | none | `googleSignUpCallback` |
| `POST` | `/users/loginwebfirststep` | none | `loginForPassengerAdminAndSuperAdmin` |
| `POST` | `/users/loginwebsecondstep` | none | `secondStepLoginForAdminAndSuperAdmin` |
| `POST` | `/users/loginmobile` | none | `userLoginForMobile` |
| `POST` | `/users/controllerlogin` | none | `controllerLogin` |

### Payment Routes (`/api/payments/*` and `/token/*`)

| Method | Endpoint | Middleware | Purpose |
|---|---|---|---|
| `POST` | `/api/payments/recharge` | `requirePassenger` | Initiate PayMee payment |
| `POST` | `/token/updatetokenbalance` | **none** ⚠️ | Update balance directly |
| `POST` | `/token/verifynumberoftokens` | **none** ⚠️ | Check if user has enough |
| `POST` | `/token/gettokenbalance` | **none** ⚠️ | Fetch token balance |
| `POST` | `/token/convertmoneytotoken` | **none** ⚠️ | 1 TND = 10 tokens |
| `POST` | `/token/converttokentomoney` | **none** ⚠️ | 10 tokens = 1 TND |
| `POST` | `/token/getuseridbytransactionid` | **none** ⚠️ | Look up user by transaction |

### Ticket Routes (`/ticket/*`)

| Method | Endpoint | Middleware | Purpose |
|---|---|---|---|
| `POST` | `/ticket/createticket` | `requirePassenger` | Book a ticket |
| `POST` | `/ticket/getqrdatabyticketid` | `requirePassenger` | Get QR code data |
| `POST` | `/ticket/getticketstatusbyqrdata` | `requireController` | Scan/validate QR |

### Infrastructure Domain Routes

| Domain | Base | GET / | GET /:id | POST / | PUT /:id | DELETE /:id | Extra Routes |
|---|---|---|---|---|---|---|---|
| Transport | `/transports` | public | public | `requireAdmin` | `requireAdmin` | `requireAdmin` | — |
| Stations | `/stations` | public | public | `requireAdmin` | `requireAdmin` | `requireAdmin` | — |
| Routes | `/routes` | public | public | `requireAdmin` | `requireAdmin` | `requireAdmin` | — |
| Schedules | `/schedules` | `GET /all` | — | `requireAdmin` | `requireAdmin` | `requireAdmin` | `GET /route/:routeId` (public) |

### Webhook Routes (`/webhooks/*`)

| Method | Endpoint | Handler | Notes |
|---|---|---|---|
| `POST` | `/webhooks/paymee` | `paymeeWebhook` | No auth — called by PayMee server |

---

## 8. Controllers Layer

Controllers handle HTTP input/output. They validate request body fields, delegate to a service, and format the response.

### Style A: Named function exports (user, admin, payment, ticket)

```js
export const createUser = async (req, res) => {
  const { email, role, ... } = req.body;        // 1. Extract from body
  if (!email || !role) return res.status(400)... // 2. Validate presence
  const result = await userService.createUser(...) // 3. Call service
  res.status(201).json({ ... })                  // 4. Send response
}
```

### Style B: Class-based default export (route, schedule, stations, transport)

```js
class RouteController {
  async create(req, res) { ... }
  async getAll(req, res) { ... }
}
export default new RouteController(); // Single instance
```

### Controller Responsibilities

| Controller | Functions | Notable Logic |
|---|---|---|
| `user.controller.js` | `createUser`, `getUserEssentialInfo`, `redeemTokensFromUser`, `googleSignIn`, `googleSignUpCallback`, `controllerLogin`, `loginForPassengerAdminAndSuperAdmin`, `secondStepLoginForAdminAndSuperAdmin`, `userLoginForMobile` | 2-step admin login; controller login requires code verification |
| `admin.controller.js` | `getDashboardStats`, `createController`, `getAllUsers`, `deleteUser`, `getAllTransactions`, `getAllTickets` | Uses `import * as adminService` (wildcard — compatible because adminService uses named exports) |
| `payment.controller.js` | `createRecharge`, `updateTokenBalance`, `verifyTokensNumber`, `getTokensBalance`, `moneyToToken`, `tokenToMoney`, `getUserIdByTransactionId` | Token math: 1 TND = 10 tokens |
| `ticket.controller.js` | `createTicket`, `getQrDataByTicketId`, `getTicketStatusByQrData` | QR validation response is unwrapped plain status (inconsistent format) |
| `transport.controller.js` | `create`, `getAll`, `getById`, `update`, `delete` | Full CRUD class-based |
| `station.controller.js` | `getAllStations`, `getStationById`, `createStation`, `updateStation`, `deleteStation` | Full CRUD class-based; imports from `station.service.js` |
| `route.controller.js` | `create`, `getAll`, `getById`, `update`, `delete` | `create` + `update` call `createFullRoute`/`updateFullRoute` atomically |
| `schedule.controller.js` | `create`, `getAll`, `getByRoute`, `update`, `delete` | `getAll` accepts `?date=` query param (defaults to today) |

---

## 9. Services Layer

Services contain all **business logic** and all **database queries**. They never touch `req` or `res`.

### `user.service.js` — Most complex service (396 lines)

**Key Logic: Two-Step Admin Login**
```
Step 1: loginForPassengerAdminAndSuperAdmin(email, password)
  → If passenger: return JWT token directly
  → If admin/superAdmin: store session in pendingSessions{} (in-memory), return tempSessionId

Step 2: secondStepLoginForAdminAndSuperAdmin(session, admin_code)
  → Look up tempSessionId in pendingSessions{}
  → verifyAdminCode(user_id, code) against DB
  → If valid: delete session, return JWT token
```

**Important**: `pendingSessions` is an **in-memory object** — cleared on server restart. Not suitable for multi-instance production deployments.

**Functions Summary:**

| Function | DB Tables | Description |
|---|---|---|
| `createUser` | `auth.users` (via signUp) | Creates user with role-specific codes |
| `getUserEssentialInfo` | `users` | Returns name, email, role, balance |
| `redeemTokensFromUser` | `users` | Deducts tokens (⚠️ no balance check, no error capture) |
| `signUpWithGoogle` | Supabase OAuth | Returns Google OAuth redirect URL |
| `handleAuthCallback` | Supabase OAuth | Exchanges code for session |
| `userLoginForMobile` | `users` | Passenger-only mobile login |
| `verifyAdminCode` | `users` | Compares admin_code |
| `verifycontrollerCode` | `users` | Compares controller_code |
| `loginForPassengerAdminAndSuperAdmin` | `users` | Step 1 of web login |
| `controllerLogin` | `users` | Controller login with code |
| `getPendingSession` | (in-memory) | Retrieves temp session |
| `deletePendingSession` | (in-memory) | Clears temp session |

### `payment.service.js` — PayMee Integration

**Recharge Flow:**
```
1. Insert transaction record (status: pending)  →  transactions table
2. Build paymeePayload (amount, user_id, webhook_url, order_id=transaction_id)
3. POST to PayMee API  →  returns { payment_url, order_id }
4. Return payment_url to controller → sent to frontend → user redirects to PayMee
```

**Token Exchange Rate:**
```js
moneyToToken({ amount }) { return amount * 10; }  // 1 TND = 10 tokens
tokenToMoney({ amount }) { return amount / 10; }  // 10 tokens = 1 TND
```

| Function | External Call | Notes |
|---|---|---|
| `createRecharge` | PayMee API (axios POST) | Creates DB record first, then calls PayMee |
| `updateTokenBalance` | Supabase | ⚠️ catch swallows error silently |
| `verifyTokensNumber` | Supabase | Returns boolean |
| `getTokensBalance` | Supabase | Returns numeric balance |
| `moneyToToken` | none | Pure math (×10) |
| `tokenToMoney` | none | Pure math (÷10) |
| `getUserIdByTransactionId` | Supabase | Used by webhook |

### `admin.service.js`

| Function | DB Tables | Notes |
|---|---|---|
| `getDashboardStats` | `users`, `transactions`, `transports` | Parallel Promise.all for performance |
| `createController` | `auth` + `users` | Manually inserts into public.users after auth signUp |
| `getAllUsers` | `users` | Ordered by `created_at` desc |
| `deleteUser` | `auth` (admin API) | Uses `supabase.auth.admin.deleteUser` |
| `getAllTransactions` | `transactions` | Ordered by `timestamp` desc |
| `getAllTickets` | `tickets` | Ordered by `purchase_date` desc |

### `ticket.service.js`

**Ticket Creation Flow:**
```
1. INSERT into tickets (user_id, schedule_id, price, status='Active', qr_data=null)
2. Get ticket_id from response
3. Generate QR code: QRCode.toDataURL(ticket_id) → base64 string
4. UPDATE ticket record to set qr_data = base64 string (strip PNG prefix)
5. Return ticket_id
```

### `schedule.service.js` — Most intelligent service

**Transport Conflict Detection:**
```
Before creating a schedule, query existing schedules for the same transport_id
where the times OVERLAP with the requested window.
If any overlap found → throw error "Transport is already scheduled"
```

Also **auto-derives `available_seats` from transport capacity**:
```js
const finalScheduleData = { ...scheduleData, available_seats: transport.capacity };
```

**New methods added post-merge:**

| Method | Description |
|---|---|
| `getCancelledScheduleIds(scheduleIds[])` | Queries `ticket_announcements` for active cancellations; returns a `Set` of cancelled IDs |
| `getAllSchedules(date)` | Filters schedules by date window; **excludes cancelled** schedules via `getCancelledScheduleIds` |
| `getSchedulesByRoute(routeId)` | Returns schedules for a specific route, also filtering out cancellations |

> ✅ **Fixed (Apr 11)**: `updateSchedule(id, updateData)` has been implemented in `schedule.service.js`.

### `route.service.js` — Two-table atomic operation

```
createFullRoute(routeData, stationSequence):
  1. INSERT into routes → get route_id
  2. Map stationSequence array → add route_id to each
  3. INSERT all stops into route_stations
  (If step 2 fails, route record orphans — no rollback yet)

updateFullRoute(routeId, routeData, stationSequence):
  1. UPDATE routes SET routeData WHERE route_id = routeId
  2. DELETE all route_stations WHERE route_id = routeId
  3. INSERT fresh stops from stationSequence
```

`getRouteDetails` uses **Supabase relational queries** (join-style):
```js
.select(`*, route_stations(sequence_order, stations(name,location))`)
```

> ✅ **Fixed (Apr 11)**: `updateFullRoute(routeId, routeData, stationSequence)` has been implemented in `route.service.js`.

### `station.service.js` & `transport.service.js`

Standard CRUD services. `station.service.js` orders results by `name`. `transport.service.js` orders by `license_plate`.

> ⚠️ **Bugs in `station.service.js`** (introduced from Hamza's branch):
> - Line 1: `import e from "express"` — Express is never used in a service file; stray import
> - Lines 3-4: `import dotenv from "dotenv"; dotenv.config()` — unnecessary; `dotenv` is already initialized in `server.js`

---

## 10. Webhooks

### `webhooks/index.js`
Simple router that connects `POST /webhooks/paymee` to the handler.

### `webhooks/paymeeWebhook.js` — Payment Confirmation Handler

**Flow:**
```
PayMee Server → POST /webhooks/paymee → paymeeWebhook handler
  1. Extract { order_id, amount, check_sum, payment_status } from payload
  2. Basic presence check (no cryptographic verification ⚠️)
  3. Map payment_status → "completed" / "failed"
  4. UPDATE transactions SET status = ? WHERE transaction_id = order_id
  5. If completed:
     a. getUserIdByTransactionId(order_id) → userId
     b. moneyToToken(amount) → tokens
     c. updateTokenBalance(userId, tokens)
  6. Return 200 OK
```

> ⚠️ **Critical Security Gap**: The `check_sum` field is extracted from the payload but **never verified**. Anyone who knows your webhook URL can POST a fake payload with `payment_status: True` to credit themselves free tokens.

> ⚠️ **Logic Bug**: The DB error check (`if (error)`) happens **after** the token credit block — if the DB update fails, tokens are still added but the error is returned after.

---

## 11. Utils

### `src/utils/validation.js`

Two exports:

**`validate(schema)` — Middleware factory:**
```js
export const validate = (schema) => (req, res, next) => {
  const errors = schema(req.body);
  if (errors.length > 0) return res.status(400).json({ error: "Validation failed", details: errors });
  next();
};
```

**`createControllerSchema(body)` — Validation schema:**

| Field | Rules |
|---|---|
| `email` | Required, regex email format |
| `password` | Required, min 6 chars (⚠️ guide requires 8) |
| `first_name` | Required, string |
| `last_name` | Required, string |

Currently only used for `POST /admin/createcontroller`. No schemas exist for signup, login, ticket booking, or payment.

---

## 12. Database Schema & Relationships

### Tables (from live Supabase inspection)

| Table | Rows | RLS | PK | Notable Constraints |
|---|---|---|---|---|
| `users` | 23 | ✅ | `user_id` (uuid) | `token_balance >= 0`, role enum |
| `transactions` | 29 | ✅ | `transaction_id` | type/status enums, `credited bool` |
| `tickets` | 7 | ✅ | `ticket_id` | status enum, `purchase_date` auto |
| `schedules` | 5 | ✅ | `schedule_id` | `available_seats >= 0`, `current_price >= 0` |
| `transports` | 3 | ✅ | `transport_id` | type: Bus/Metro, `capacity > 0` |
| `routes` | 4 | ✅ | `route_id` | `base_price >= 0` |
| `stations` | 6 | ✅ | `station_id` | — |
| `route_stations` | 8 | ✅ | `(route_id, station_id)` | Junction table |
| `validations` | 0 | ✅ | `validation_id` | outcome: Valid/Invalid/Duplicate |

### Entity Relationship Diagram

```
+----------------+       +------------------+       +---------------+
|     USERS      |──────<|   TRANSACTIONS   |       |  VALIDATIONS  |
+----------------+       +------------------+       +---------------+
| user_id (PK)   |       | transaction_id   |     / | validation_id |
| email          |       | user_id (FK)     |    /  | ticket_id (FK)|
| role           |       | amount           |   /   | controller_id |
| token_balance  |       | type             |  /    | outcome       |
| controller_code|       | method           | /     | scan_time     |
| admin_code     |       | status           |/      +-------+-------+
| super_admin_code       | timestamp        |               |
+-------+--------+       +------------------+               |
        |                                                    |
        └────────────────────────────┐                      |
                                     │                      │
                                     ▼                      ▼
                              +----------------+       (ticket_id FK)
                              |    TICKETS     |◄──────────────────
                              +----------------+
                              | ticket_id (PK) |
                              | user_id (FK)   |
                              | schedule_id(FK)|──────────────────────┐
                              | qr_data        |                      │
                              | status         |                      │
                              | purchase_date  |                      │
                              | price          |                      │
                              +----------------+                      │
                                                                      │
                              +-------------------+                   │
                              |     SCHEDULES     |◄──────────────────┘
                              +-------------------+
                              | schedule_id (PK)  |
                              | route_id (FK)     |──────────────────────┐
                              | transport_id (FK) |──────┐               │
                              | departure_time    |       │               │
                              | arrival_time      |       │               │
                              | available_seats   |       │               │
                              | current_price     |       │               │
                              +-------------------+       │               │
                                                          ▼               ▼
                              +----------------+  +---------------+  +---------+
                              |   TRANSPORTS   |  | ROUTE_STATIONS|  | ROUTES  |
                              +----------------+  +---------------+  +---------+
                              | transport_id   |  | route_id (FK) |  | route_id|
                              | type (Bus/Metro)|  | station_id(FK)|  | name    |
                              | capacity       |  | sequence_order|  | base_price
                              | license_plate  |  +-------+-------+  +---------+
                              | status         |          |
                              +----------------+          │
                                                          ▼
                                                   +----------+
                                                   | STATIONS |
                                                   +----------+
                                                   |station_id|
                                                   | name     |
                                                   | location |
                                                   +----------+
```

---

## 13. Data Flow Diagrams

### Flow A: Passenger Signup

```
Client POST /users/createuser
   { email, password, role:"passenger", first_name, last_name }
        │
        ▼
user.controller.js → createUser()
   validates presence of all fields
        │
        ▼
user.service.js → createUser({ email, password, role, ... })
   switch(role = "passenger"):
     supabase.auth.signUp({ email, password, options: { data: { role, first_name, last_name, token_balance: 0 } } })
        │
        ▼ (Supabase trigger: handle_new_user creates row in public.users)
        │
        ▼
Response 201: { message, user: { id, email } }
```

---

### Flow B: Admin 2-Step Web Login

```
Step 1: POST /users/loginwebfirststep  { email, password }
        │
        ▼
supabase.auth.signInWithPassword(email, password)
   + fetch role from public.users
        │
        ├─ role === "passenger"  →  return JWT token directly (200)
        │
        └─ role === "admin" / "superAdmin"
             → generate tempSessionId = crypto.randomUUID()
             → store { user_id, token, role, ... } in pendingSessions[tempSessionId]
             → return { role: "admin_or_super_admin", session: tempSessionId } (200)

Step 2: POST /users/loginwebsecondstep  { session: tempSessionId, admin_code }
        │
        ▼
getPendingSession(session) → fetch stored user data
   verifyAdminCode(user_id, admin_code) → compare with DB value
        │
        ├─ Code invalid    → 401 "invalid admin code"
        │
        └─ Code valid
             → deletePendingSession(session)
             → return { token, user: { id, email, role, first_name, last_name } }
```

---

### Flow C: Token Recharge (PayMee)

```
Client POST /api/payments/recharge  { user_id, amount }
  [requirePassenger middleware]
        │
        ▼
payment.service.js → createRecharge()
  1. INSERT transactions { user_id, amount, type:"Recharge", method:"online", status:"pending" }
  2. Build paymeePayload {
       amount, order_id: transaction_id,
       webhook_url: NGROK_URL/webhooks/paymee
     }
  3. axios.POST PayMee API → returns { payment_url, order_id }
        │
        ▼
Response 200: { success: true, payment_url, transaction_id }

Frontend redirects user to payment_url (PayMee hosted page)

User completes payment on PayMee

PayMee calls POST /webhooks/paymee { order_id, amount, payment_status, check_sum }
        │
        ▼
paymeeWebhook.js:
  1. UPDATE transactions SET status = "completed" WHERE transaction_id = order_id
  2. getUserIdByTransactionId(order_id) → userId
  3. moneyToToken(amount) → tokens  (×10 rate)
  4. updateTokenBalance(userId, tokens)  → UPDATE users SET token_balance += tokens
        │
        ▼
Response 200: { message: "Webhook processed successfully" }
```

---

### Flow D: Ticket Booking

```
Client POST /ticket/createticket  { user_id, schedule_id, price }
  [requirePassenger middleware]
        │
        ▼
ticket.service.js → createTicket()
  1. INSERT tickets { user_id, schedule_id, price, status: "Active", qr_data: null }
  2. QRCode.toDataURL(ticket_id) → base64 PNG string
  3. UPDATE tickets SET qr_data = base64 WHERE ticket_id = ticket_id
        │
        ▼
Response 200: { message: "ticket created successfully", ticketData: ticket_id }

Controller scans QR code:
POST /ticket/getticketstatusbyqrdata  { qr_data }  [requireController]
  → SELECT status FROM tickets WHERE qr_data = ?
  → Response: "Active" / "Used" / "Expired"
```

---

### Flow E: Schedule Creation (Admin)

```
Admin POST /schedules  { transport_id, route_id, departure_time, arrival_time, ... }
  [requireAdmin middleware]
        │
        ▼
schedule.service.js → createSchedule()
  1. SELECT * FROM schedules WHERE transport_id = ? AND times OVERLAP requested range
     → If conflict: throw "Transport is already scheduled"
  2. SELECT capacity FROM transports WHERE transport_id = ?
     → set available_seats = capacity automatically
  3. INSERT schedules { ...scheduleData, available_seats, current_price }
        │
        ▼
Response 201: { success: true, data: schedule }
```

---

## 14. Complete API Endpoint Reference

| # | Method | Path | Auth | Body / Params | Returns |
|---|---|---|---|---|---|
| 1 | GET | `/` | none | — | `"Backend API is running"` |
| 2 | POST | `/users/createuser` | none | `email, role, first_name, last_name, password` | `{ user }` |
| 3 | POST | `/users/getuseressentialinfo` | requireAuth | `user_id` | `{ first_name, last_name, email, role, token_balance }` |
| 4 | POST | `/users/redeemtokensfromuser` | **none** ⚠️ | `user_id, amount` | `{ message, newBalance }` |
| 5 | GET | `/users/auth/google` | none | — | `{ url }` OAuth redirect |
| 6 | GET | `/users/auth/callback` | none | `?code=` | `{ user, token }` |
| 7 | POST | `/users/loginwebfirststep` | none | `email, password` | `{ token }` or `{ session }` |
| 8 | POST | `/users/loginwebsecondstep` | none | `session, admin_code` | `{ token, user }` |
| 9 | POST | `/users/loginmobile` | none | `email, password` | `{ token, user }` |
| 10 | POST | `/users/controllerlogin` | none | `email, password, code` | `{ token, user }` |
| 11 | POST | `/api/payments/recharge` | requirePassenger | `user_id, amount` | `{ payment_url, transaction_id }` |
| 12 | POST | `/token/updatetokenbalance` | **none** ⚠️ | `user_id, amount` | `{ message }` |
| 13 | POST | `/token/verifynumberoftokens` | **none** ⚠️ | `user_id, amount` | `{ tokensData: boolean }` |
| 14 | POST | `/token/gettokenbalance` | **none** ⚠️ | `user_id` | `{ tokenBalence }` |
| 15 | POST | `/token/convertmoneytotoken` | **none** ⚠️ | `amount` | `{ token }` |
| 16 | POST | `/token/converttokentomoney` | **none** ⚠️ | `amount` | `{ money }` |
| 17 | POST | `/token/getuseridbytransactionid` | **none** ⚠️ | `transaction_id` | `{ user }` |
| 18 | POST | `/ticket/createticket` | requirePassenger | `user_id, schedule_id, price` | `{ message, ticketData }` |
| 19 | POST | `/ticket/getqrdatabyticketid` | requirePassenger | `ticket_id` | `{ message, qrData }` |
| 20 | POST | `/ticket/getticketstatusbyqrdata` | requireController | `qr_data` | status string ⚠️ (unwrapped) |
| 21 | GET | `/admin/dashboard` | requireAdmin | — | `{ total_users, total_transactions, activeBuses, total_revenue }` |
| 22 | POST | `/admin/createcontroller` | requireAdmin | `email, password, first_name, last_name` | `{ message, controller }` |
| 23 | GET | `/admin/users` | requireAdmin | — | `[user, ...]` |
| 24 | DELETE | `/admin/users/:userId` | requireAdmin | `:userId` param | `{ message }` |
| 25 | GET | `/admin/transactions` | requireAdmin | — | `[transaction, ...]` |
| 26 | GET | `/admin/tickets` | requireAdmin | — | `[ticket, ...]` |
| 27 | GET | `/transports` | none | — | `[transport, ...]` |
| 28 | GET | `/transports/:id` | none | `:id` | transport object |
| 29 | POST | `/transports` | requireAdmin | `type, capacity, status, license_plate` | transport object |
| 30 | PUT | `/transports/:id` | requireAdmin | partial transport | updated transport |
| 31 | DELETE | `/transports/:id` | requireAdmin | `:id` | `{ message }` |
| 32 | GET | `/stations` | none | — | `[station, ...]` |
| 33 | GET | `/stations/:id` | none | `:id` | station object |
| 34 | POST | `/stations` | requireAdmin | `name, location` | station object |
| 35 | PUT | `/stations/:id` | requireAdmin | partial station | updated station |
| 36 | DELETE | `/stations/:id` | requireAdmin | `:id` | deleted station |
| 37 | GET | `/routes` | none | — | `[route, ...]` with station names |
| 38 | GET | `/routes/:id` | none | `:id` | route + ordered stops |
| 39 | POST | `/routes` | requireAdmin | `{ routeData, stationSequence }` | route object |
| 40 | PUT | `/routes/:id` | requireAdmin | `{ routeData, stationSequence }` | updated route |
| 41 | DELETE | `/routes/:id` | requireAdmin | `:id` | `{ message }` |
| 42 | GET | `/schedules/all` | none | `?date=YYYY-MM-DD` | schedules for that date (defaults to today) |
| 43 | GET | `/schedules/route/:routeId` | none | `:routeId` | schedules for route (cancellations filtered) |
| 44 | POST | `/schedules` | requireAdmin | schedule object | created schedule |
| 45 | PUT | `/schedules/:id` | requireAdmin | partial schedule | updated schedule |
| 46 | DELETE | `/schedules/:id` | requireAdmin | `:id` | `{ message }` |
| 47 | POST | `/webhooks/paymee` | none (external) | PayMee payload | `{ message }` |

---

## 15. Cross-File Dependency Map

```
server.js
  ├── imports → src/routes/*.routes.js  (all 8 routers)
  └── imports → src/webhooks/index.js

src/routes/admin.routes.js
  ├── imports → src/controllers/admin.controller.js
  ├── imports → src/middlewares/auth.middleware.js  (requireAdmin)
  └── imports → src/utils/validation.js

src/routes/user.routes.js
  ├── imports → src/controllers/user.controller.js
  └── imports → src/middlewares/requireAuth.js

src/routes/ticket.routes.js
  ├── imports → src/controllers/ticket.controller.js
  ├── imports → src/middlewares/requireAuth.js
  ├── imports → src/middlewares/requirePassenger.js
  └── imports → src/middlewares/requireController.js

src/routes/payment.routes.js
  ├── imports → src/controllers/payment.controller.js
  └── imports → src/middlewares/requirePassenger.js

src/routes/{transport,route,schedule}.routes.js
  ├── imports → src/controllers/{domain}.controller.js
  └── imports → src/middlewares/auth.middleware.js  (requireAdmin)

src/routes/station.routes.js
  └── imports → src/controllers/station.controller.js
  (⚠️ missing requireAdmin import — auth not enforced on mutations)

src/controllers/admin.controller.js
  └── imports → src/services/admin.service.js

src/controllers/user.controller.js
  └── imports → src/services/user.service.js

src/controllers/payment.controller.js
  └── imports → src/services/payment.service.js

src/controllers/ticket.controller.js
  └── imports → src/services/ticket.service.js

src/controllers/{transport,stations,route,schedule}.controller.js
  └── imports → src/services/{domain}.service.js

src/services/*.service.js
  └── imports → src/config/supabase.js  (ALL services share this)

src/services/payment.service.js
  ├── imports → src/config/supabase.js
  └── imports → src/models/payment.model.js

src/services/ticket.service.js
  ├── imports → src/config/supabase.js
  └── imports → src/models/ticket.model.js  (TICKET_STATUS only)

src/webhooks/paymeeWebhook.js
  ├── imports → src/config/supabase.js
  └── imports → src/services/payment.service.js
       (getUserIdByTransactionId, moneyToToken, updateTokenBalance)
```

---

## 16. Known Issues & Notes

### Critical (Security)

| # | File | Issue | Impact |
|---|---|---|---|
| S1 | `paymeeWebhook.js` | `check_sum` never cryptographically verified | Fake webhooks → free tokens |
| S2 | `user.routes.js` line 20 | `redeemTokensFromUser` has no auth middleware | Anyone can drain any user's tokens |
| S3 | `payment.routes.js` | 6 token endpoints completely unprotected | Unauth access to balances + direct balance updates |
| S4 | `user.controller.js` line 1 | `import { url } from "inspector"` — unused Node internals | Noise, no runtime impact |

### High (Logic / Data Integrity)

| # | File | Issue | Impact |
|---|---|---|---|
| L1 | `user.service.js` line 184-187 | `redeemTokensFromUser` — no balance check, no error check on update | Negative token balance possible; silent failure |
| L2 | `payment.service.js` line 88-90 | `updateTokenBalance` catch swallows error silently | Token update fails silently after payment confirmation |
| L3 | `paymeeWebhook.js` line 31-37 | Token credit happens before error check on DB update | Tokens added even if transaction status update failed |
| L4 | `pendingSessions` in `user.service.js` | In-memory session store | Lost on server restart; not scalable |

### Medium (Code Quality)

| # | File | Issue |
|---|---|---|
| M1 | `ticket.model.js` line 7 | Class named `User` instead of `Ticket` |
| M2 | `ticket.model.js` line 14 | `purshase_date` typo (DB uses `purchase_date`) |
| M3 | `payment.controller.js` line 85 | Error message says "User ID and amount is required" for `getTokensBalance` (only user_id needed) |
| M4 | `ticket.controller.js` line 47 | `getTicketStatusByQrData` response is plain string, inconsistent with rest of API |
| M5 | `config/paymee.js` | File exists but is never imported — dead code |
| M6 | `admin.service.js` vs `user.service.js` | Two `createController` implementations with different code formats (`CTRL-XXXX` vs 6-digit number) |
| M7 | `paymeeWebhook.js` line 10-11 | Console logs Supabase URL and KEY (sensitive data in logs) |

### New Issues Found Post-Merge — All Fixed (April 11, 2026)

| # | File | Severity | Issue | Status |
|---|---|---|---|---|
| N1 | `route.service.js` | 🔴 Critical | `updateFullRoute()` was missing → `PUT /routes/:id` crashed | ✅ **Fixed** — method implemented |
| N2 | `schedule.service.js` | 🔴 Critical | `updateSchedule()` was missing → `PUT /schedules/:id` crashed | ✅ **Fixed** — method implemented |
| N3 | `station.routes.js` | 🔴 Critical | No `requireAdmin` on POST/PUT/DELETE — mutations were public | ✅ **Fixed** — middleware added |
| N4 | `station.service.js` line 1 | 🟡 Medium | `import e from "express"` — stray unused import | 🟡 Pending (no runtime impact) |
| N5 | `station.service.js` lines 3-4 | 🟡 Medium | `dotenv.config()` — redundant in a service file | 🟡 Pending (no runtime impact) |

---

## 17. Environment Variables Reference

All environment variables are stored in `backend/.env`. The file is **never committed** to version control.

| Variable | Required | Example Value | Used In | Description |
|---|---|---|---|---|
| `SUPABASE_URL` | ✅ Yes | `https://xxxx.supabase.co` | `config/supabase.js` | Your Supabase project API URL |
| `SUPABASE_KEY` | ✅ Yes | `eyJhbGci...` (JWT) | `config/supabase.js` | **Service Role Key** — bypasses RLS, has full DB access. Keep secret! |
| `PAYMEE_API` | ✅ Yes | `f91dcf0f...` | `payment.service.js` | PayMee API token for sandbox/production |
| `PAYMEE_URL` | ✅ Yes | `https://sandbox.paymee.tn/api/v2` | `payment.service.js` | PayMee base API URL (use sandbox for dev, live URL for prod) |
| `NGROK_URL` | ✅ Yes (dev) | `https://xxxx.ngrok-free.app` | `payment.service.js`, `paymeeWebhook.js` | Public tunnel URL so PayMee can reach your local webhook endpoint |
| `FRONTEND_URL` | ⚠️ Optional | `http://localhost:5173` | `server.js` (CORS) | Allowed frontend origin. Defaults to Vite dev server if missing |
| `GOOGLE_OAUTH_REDIRECT_URL` | ⚠️ Optional | `http://localhost:3000/users/auth/callback` | `user.service.js` | Supabase OAuth callback URL — must match what's registered in Supabase dashboard |
| `PAYMEE_WEBHOOK_KEY` | 🔴 Missing! | `your_webhook_secret_here` | `paymeeWebhook.js` (planned) | Secret key to verify PayMee webhook SHA-256 signature. **Not yet implemented.** |

### Security Rules

```
⛔ NEVER commit .env to Git
⛔ NEVER log SUPABASE_KEY or PAYMEE_API to console
⛔ NEVER use SUPABASE Service Role Key on the frontend
✅ Use different keys for sandbox vs. production
✅ Rotate the SUPABASE_KEY if it leaks
```

### `.env.example` Template

Create this file at `backend/.env.example` and commit it (with placeholder values only):

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_service_role_key_here

# PayMee Payment Gateway
PAYMEE_API=your_paymee_api_token_here
PAYMEE_URL=https://sandbox.paymee.tn/api/v2
PAYMEE_WEBHOOK_KEY=your_webhook_secret_here

# Tunneling (local dev only — use ngrok or similar)
NGROK_URL=https://your-tunnel.ngrok-free.app

# Frontend
FRONTEND_URL=http://localhost:5173

# OAuth
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/users/auth/callback
```

---

## 18. Sequence Diagrams

### Sequence A: PayMee Webhook (Full Timing)

```
Passenger      Backend API       PayMee API        Supabase DB
    │                │                │                  │
    │─POST /recharge─►│                │                  │
    │                │─INSERT pending──────────────────►  │
    │                │◄── transaction_id ────────────────  │
    │                │─POST /payments/create──►           │
    │                │◄── { payment_url }──────           │
    │◄─ payment_url ─│                │                  │
    │                │                │                  │
    │─(redirect)────────────────────►│                  │
    │     [User enters card on PayMee page]              │
    │                │                │                  │
    │                │◄─POST /webhooks/paymee             │
    │                │  { order_id, amount,               │
    │                │    payment_status, check_sum }      │
    │                │─UPDATE status ──────────────────►  │
    │                │─SELECT user_id  ────────────────►  │
    │                │◄── user_id ──────────────────────  │
    │                │─UPDATE token_balance ───────────►  │
    │                │◄── success ──────────────────────  │
    │                │─200 OK──────────►                  │
```

---

### Sequence B: Admin Two-Step Login

```
Admin Browser    Backend API           Supabase Auth          Supabase DB
     │                │                     │                     │
     │─POST /loginwebfirststep              │                     │
     │  { email, password }─►              │                     │
     │                │─signInWithPassword──►                     │
     │                │◄── { session, token }                     │
     │                │─SELECT role ────────────────────────────► │
     │                │◄── { role: "admin" } ────────────────────  │
     │                │                     │                     │
     │                │ [Store temp session in memory]            │
     │◄── { role: "admin_or_super_admin",   │                     │
     │      session: "uuid" }              │                     │
     │                │                     │                     │
     │─POST /loginwebsecondstep            │                     │
     │  { session, admin_code }─►          │                     │
     │                │ [Fetch from pendingSessions map]          │
     │                │─SELECT admin_code ──────────────────────► │
     │                │◄── admin_code ────────────────────────────  │
     │                │ [Compare codes]     │                     │
     │                │ [Delete temp session]                     │
     │◄── { token, user }                  │                     │
```

---

### Sequence C: Controller Ticket Validation

```
Controller App   Backend API           Supabase DB
     │                │                     │
     │─POST /ticket/getticketstatusbyqrdata │
     │  { qr_data: "base64..." }─►         │
     │                │ [requireController]  │
     │                │ [Verify JWT → check role = controller]
     │                │─SELECT status ──────►
     │                │  FROM tickets        │
     │                │  WHERE qr_data = ?   │
     │                │◄── { status: "Active" }
     │◄── "Active" ───│                     │
     │ (shown as VALID on scanner app)      │
```

---

## 19. Error Response Catalog

All errors follow one of two shapes:

**Standard Error:**
```json
{ "error": "Human readable message" }
```

**Validation Error:**
```json
{ "error": "Validation failed", "details": ["field is required", ...] }
```

### Error Reference by Endpoint Group

#### Auth & Users

| HTTP Code | Error Message | Cause | Endpoint |
|---|---|---|---|
| 400 | `"email, role, first_name, last_name and password are required"` | Missing body field | `POST /users/createuser` |
| 400 | `"email and password are required"` | Missing credentials | `POST /users/loginwebfirststep` |
| 400 | `"session and admin code are required"` | Missing 2nd step fields | `POST /users/loginwebsecondstep` |
| 400 | `"email and password and code are required"` | Missing controller login fields | `POST /users/controllerlogin` |
| 401 | `"invalid admin code"` | Wrong 6-digit admin code | `POST /users/loginwebsecondstep` |
| 401 | `"invalid code"` | Wrong controller code | `POST /users/controllerlogin` |
| 403 | `"Access denied: passengers only"` | Non-passenger tried mobile login | `POST /users/loginmobile` |
| 500 | `"failed to create user"` + `details` | Supabase auth error | `POST /users/createuser` |
| 500 | `"failed to login"` | Supabase signIn error | `POST /users/loginwebfirststep` |

#### Payments & Tokens

| HTTP Code | Error Message | Cause | Endpoint |
|---|---|---|---|
| 400 | `"User ID and Amount are required"` | Missing body field | `POST /api/payments/recharge` |
| 400 | `"Paymee API did not return a payment link"` | PayMee rejected the request | `POST /api/payments/recharge` |
| 400 | `"User ID and amount is required"` | Missing body field | `POST /token/updatetokenbalance` |
| 400 | `"transaction id is required"` | Missing body field | `POST /token/getuseridbytransactionid` |
| 500 | `"Failed to initiate recharge"` + `details` | PayMee API call failed | `POST /api/payments/recharge` |

#### Tickets

| HTTP Code | Error Message | Cause | Endpoint |
|---|---|---|---|
| 400 | `"user id, schedule id and price are required"` | Missing body field | `POST /ticket/createticket` |
| 400 | `"ticket id is required"` | Missing body field | `POST /ticket/getqrdatabyticketid` |
| 400 | `"qr data is required"` | Missing body field | `POST /ticket/getticketstatusbyqrdata` |

#### Admin

| HTTP Code | Error Message | Cause | Endpoint |
|---|---|---|---|
| 400 | `"User ID is required"` | Missing `:userId` param | `DELETE /admin/users/:userId` |
| 400 | `"Validation failed"` + `details[]` | Schema validation errors | `POST /admin/createcontroller` |
| 500 | `"Internal Server Error"` | Supabase query error | All admin endpoints |

#### Middlewares (Auth Guards)

| HTTP Code | Error Message | Cause |
|---|---|---|
| 401 | `"No token provided"` | Missing `Authorization` header |
| 401 | `"Invalid token"` | JWT expired or malformed |
| 403 | `"Access denied"` | Valid token but wrong role |

#### Webhooks

| HTTP Code | Error Message | Cause |
|---|---|---|
| 400 | `"Invalid webhook payload"` | Missing `order_id`, `amount`, or `check_sum` |
| 500 | `"Failed to update transaction status"` | Supabase update error |
| 500 | `"Failed to process webhook"` | Unhandled exception |

---

## 20. Quick Start Guide

### Prerequisites

| Tool | Minimum Version | Check Command |
|---|---|---|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Supabase account | — | [supabase.com](https://supabase.com) |
| PayMee sandbox account | — | [sandbox.paymee.tn](https://sandbox.paymee.tn) |
| ngrok (for local webhook testing) | v3+ | `ngrok --version` |

### Step-by-Step Setup

**1. Clone and navigate to backend:**
```bash
git clone <repo-url>
cd pfa/pfaa/backend
```

**2. Install dependencies:**
```bash
npm install
```

Installed packages and their purpose:

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server framework |
| `@supabase/supabase-js` | ^2.95.3 | Supabase client (DB + Auth) |
| `axios` | ^1.13.5 | HTTP client for PayMee API calls |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing middleware |
| `dotenv` | ^17.2.4 | Load `.env` file into `process.env` |
| `qrcode` | ^1.5.4 | Generate QR codes as base64 PNG strings |

**3. Create your `.env` file:**
```bash
cp .env.example .env
# Then fill in your actual credentials
```

**4. Start ngrok tunnel (required for PayMee webhooks in local dev):**
```bash
ngrok http 3000
# Copy the https:// URL shown and paste it into .env as NGROK_URL
```

**5. Start the development server:**
```bash
node server.js
# Server starts on http://localhost:3000
```

You should see:
```
Server running on http://localhost:3000
```

**6. Test the server is alive:**
```bash
curl http://localhost:3000/
# Expected: "Backend API is running"
```

### Common Startup Errors

| Error | Cause | Fix |
|---|---|---|
| `Error: Supabase URL or Service Role Key is missing` | `.env` file missing or incomplete | Create `.env` with `SUPABASE_URL` and `SUPABASE_KEY` |
| `Error: Cannot find module 'cors'` | Dependencies not installed | Run `npm install` |
| `SyntaxError: Cannot use import statement` | Node version too old or `type:module` missing | Use Node 18+; check `package.json` has `"type": "module"` |
| `CORS error` from frontend | `FRONTEND_URL` mismatch | Set `FRONTEND_URL` in `.env` to match your frontend origin |

---

## 21. Testing Guide

### Testing with cURL

**1. Create a passenger account:**
```bash
curl -X POST http://localhost:3000/users/createuser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "passenger",
    "first_name": "Alice",
    "last_name": "Test"
  }'
```

**2. Login as passenger (mobile):**
```bash
curl -X POST http://localhost:3000/users/loginmobile \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
# Save the "token" from response — you'll use it as Bearer token below
```

**3. Initiate a wallet recharge (passenger only):**
```bash
curl -X POST http://localhost:3000/api/payments/recharge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"user_id": "<uuid>", "amount": 10}'
# Response will include a payment_url — open it in your browser
```

**4. Get all schedules (public, no auth needed):**
```bash
curl http://localhost:3000/schedules
```

**5. Admin — get dashboard stats:**
```bash
curl http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer <admin_token>"
```

**6. Create a station (admin only):**
```bash
curl -X POST http://localhost:3000/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"name": "Tunis Marine", "location": "36.7992,10.1727"}'
```

**7. Simulate a PayMee webhook (local testing):**
```bash
curl -X POST http://localhost:3000/webhooks/paymee \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'order_id=<transaction_id>&amount=10&payment_status=True&check_sum=dummy'
```

### Testing Checklist

| Scenario | Endpoint | Expected Result |
|---|---|---|
| ✅ Passenger signup | `POST /users/createuser` | 201 + user object |
| ✅ Passenger mobile login | `POST /users/loginmobile` | 200 + JWT token |
| ✅ Admin login step 1 | `POST /users/loginwebfirststep` | 200 + session ID |
| ✅ Admin login step 2 | `POST /users/loginwebsecondstep` | 200 + JWT token |
| ✅ Controller login | `POST /users/controllerlogin` | 200 + JWT token |
| ✅ List all schedules | `GET /schedules` | 200 + array |
| ✅ Book ticket (passenger) | `POST /ticket/createticket` | 200 + ticket_id |
| ✅ Admin: list users | `GET /admin/users` | 200 + user array |
| ✅ Admin: create schedule | `POST /schedules` | 201 + schedule |
| ✅ Webhook: payment confirmed | `POST /webhooks/paymee` | 200 + tokens added |
| 🔒 Recharge without auth | `POST /api/payments/recharge` | 401 Unauthorized |
| 🔒 Admin route without token | `GET /admin/dashboard` | 401 Unauthorized |
| 🔒 Passenger tries admin route | `GET /admin/users` | 403 Access Denied |

### Postman Collection Structure (recommended)

```
Wassalni Backend
├── 🔐 Auth
│   ├── Signup (Passenger)
│   ├── Login Mobile
│   ├── Login Web Step 1
│   ├── Login Web Step 2
│   └── Controller Login
├── 💳 Payments
│   ├── Initiate Recharge
│   ├── Get Token Balance
│   └── Verify Token Count
├── 🎫 Tickets
│   ├── Create Ticket
│   ├── Get QR Data
│   └── Validate QR (Controller)
├── 🛡️ Admin
│   ├── Dashboard Stats
│   ├── List Users
│   ├── Delete User
│   ├── Create Controller
│   ├── List Transactions
│   └── List Tickets
└── 🚌 Infrastructure
    ├── Stations CRUD
    ├── Transports CRUD
    ├── Routes CRUD
    └── Schedules CRUD
```

---

## 22. Deployment Notes

### Local Development Setup

```
[Frontend :5173]  ←CORS→  [Backend :3000]  ←→  [Supabase Cloud]
                               ↑
                          [ngrok tunnel]
                               ↑
                       [PayMee Sandbox]
```

### ngrok Configuration

ngrok is **required** for local development because PayMee cannot call `localhost`.

**Start ngrok:**
```bash
ngrok http 3000
```

**Resulting URL pattern:** `https://xxxx-yy-zz.ngrok-free.app`

**Update `.env`:**
```
NGROK_URL=https://xxxx-yy-zz.ngrok-free.app
```

> ⚠️ **ngrok free tier** generates a new URL every restart — you must update `.env` and restart the backend each time.

**Verify the webhook is reachable:**
```bash
curl https://your-ngrok-url.ngrok-free.app/webhooks/paymee \
  -X POST -H "Content-Type: application/json" \
  -d '{"order_id":"test", "amount":"1", "check_sum":"abc", "payment_status":"False"}'
```

### Supabase Configuration Checklist

| Step | Location in Supabase Dashboard | Notes |
|---|---|---|
| Create project | Projects → New Project | Get URL + Service Role key |
| Enable Email auth | Authentication → Providers → Email | Enable email/password |
| Enable Google OAuth | Authentication → Providers → Google | Add Client ID + Secret |
| Set redirect URLs | Authentication → URL Configuration | Add `http://localhost:3000/users/auth/callback` |
| Confirm `handle_new_user` trigger | Database → Functions | Auto-creates `public.users` row on signup |
| Check RLS policies | Table Editor → [table] → RLS | Currently enabled but no policies written yet |
| Service Role Key | Settings → API → Service Role | Paste into `SUPABASE_KEY` in `.env` |

### PayMee Sandbox vs Production

| Setting | Sandbox | Production |
|---|---|---|
| `PAYMEE_URL` | `https://sandbox.paymee.tn/api/v2` | `https://app.paymee.tn/api/v2` |
| `PAYMEE_API` | Sandbox token (from sandbox dashboard) | Live token (from production account) |
| Card numbers | Use PayMee test cards | Real cards |
| Webhooks | Goes to ngrok tunnel | Goes to your production domain |

### Production Deployment Checklist

```
□ Remove all console.log statements logging sensitive values
□ Set NODE_ENV=production
□ Replace NGROK_URL with your real production domain
□ Switch PAYMEE_URL from sandbox to live URL
□ Rotate SUPABASE_KEY before going live
□ Implement PAYMEE_WEBHOOK_KEY signature verification
□ Write Supabase RLS policies for all tables
□ Put server behind reverse proxy (nginx/caddy)
□ Set up process manager (PM2 or systemd)
□ Configure HTTPS (TLS certificate)
□ Set FRONTEND_URL to your live frontend domain
```

---

## 23. Codebase Summary

| Section | What it covers |
|---|---|
| **Project Structure** | Full annotated file tree + file count table (38 files across 9 layers) |
| **Architecture** | ASCII layered MVC diagram; 2 controller style patterns compared |
| **server.js** | 10-row route mount table; CORS & binary parser decisions explained |
| **Config Layer** | Supabase singleton fast-fail pattern; paymee.js dead code finding |
| **Middleware Layer** | All 4 auth guards; shared token-verification pattern; missing requireSuperAdmin noted |
| **Models Layer** | 3 enum files; business rules documented; 2 bugs found (wrong class name, typo) |
| **Routes Layer** | Every endpoint per domain with auth column; protected vs public split |
| **Controllers Layer** | Both named-export and class-based styles; responsibility table for all 8 controllers |
| **Services Layer** | Per-service logic including 2-step login, PayMee integration, conflict detection, QR flow |
| **Webhooks** | Full payment confirmation flow; 2 critical bugs identified |
| **Utils** | Validation middleware factory; `createControllerSchema` field rules |
| **DB Schema** | Live Supabase table stats (rows, RLS status); full ASCII ER diagram |
| **Data Flows** | 5 complete ASCII flow diagrams: signup, admin login, recharge, ticket booking, schedule |
| **API Reference** | All 44 endpoints in one table with method, path, auth, body fields, return shape |
| **Dependency Map** | Full import chain from server.js → routes → controllers → services → supabase |
| **Known Issues** | 17 bugs/issues catalogued: S1-S4 (security), L1-L4 (logic), M1-M7 (code quality) |
| **Env Variables** | 8 variables: required/optional flag, example value, which file uses it, `.env.example` template |
| **Sequence Diagrams** | 3 formal timing diagrams: PayMee webhook, admin 2-step login, controller QR scan |
| **Error Catalog** | All error codes + messages grouped by domain, including middleware guard errors |
| **Quick Start** | Prerequisites table; 6-step setup; dependency purpose table; common startup error fixes |
| **Testing Guide** | 7 cURL commands; 13-row testing checklist; recommended Postman collection structure |
| **Deployment Notes** | ngrok setup; Supabase config checklist; sandbox vs production PayMee table; production deployment checklist |
