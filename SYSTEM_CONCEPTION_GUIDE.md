# WASALNI System Conception Guide

This document is the single technical reference for the full project (backend, mobile, and web frontend).

## 1) Project Purpose

WASALNI is a multi-client transport ticketing system with:

- passenger flows (buy, view, refund tickets),
- controller flows (scan/verify/validate tickets against selected trip),
- admin flows (dashboard, create controllers, publish delay/cancellation announcements),
- payment/token flows (Paymee + token accounting).

Main code areas:

- `backend/`: Node.js + Express + Supabase business/API layer.
- `mobile/app/`: Flutter mobile app (passenger + controller + admin login behavior).
- `frontend/`: React web app shell (login/register currently wired).

---

## 2) High-Level Architecture

### Backend

- Entry point: `backend/server.js`
- Pattern: **Route -> Controller -> Service -> Supabase**
- Auth: bearer token + role middlewares:
  - `requirePassenger`
  - `requireController`
  - `requireAdmin`
  - `requireAuth`

### Mobile

- Navigation root: `mobile/app/lib/main.dart`
- Auth/session: `features/auth/auth_controller.dart`
- API clients:
  - `data/api/api_client.dart` (auth + general requests)
  - `data/api/api_service.dart` (ticket/schedule/payment client calls)
- Localization: the Flutter app starts in English by default, supports persisted English/Arabic selection, and switches to RTL when Arabic is active.
- Startup flow now goes Splash -> Welcome (language picker) -> Login/Home.

### Web Frontend

- Route map: `frontend/src/routes/AppRoutes.jsx`
- Guard scaffold: `frontend/src/routes/ProtectedRoute.jsx` (currently empty)
- Current pages exposed: login/register via `MainLayout`.

---

## 3) Core Business Flows

## 3.1 Passenger flow

1. User logs in.
2. User opens bus/train schedule and chooses slot.
3. App checks token balance and seat availability.
4. Ticket(s) created.
5. Tokens are redeemed.
6. Ticket appears in:
   - My Tickets (active)
   - History (all)
7. If trip cancelled, user can request refund.
8. Refund is processed in test mode after delay window.

## 3.2 Controller flow

1. Controller logs in.
2. Controller opens Controller Home.
3. Controller selects date, transport type (bus/metro), then schedule.
4. Controller scans QR or enters short code.
5. Backend returns ticket details.
6. App compares selected schedule vs ticket schedule.
7. If valid and active, controller validates ticket.
8. Backend marks ticket status as `Used`.

## 3.3 Delay/Cancellation flow

1. Admin creates delay/cancellation announcement by `schedule_id`.
2. Ticket queries enrich each ticket with disruption state.
3. Cancelled trips are excluded from schedule list endpoints.
4. Cancelled tickets become refund-eligible.

## 3.4 Payment and token flow

1. Passenger requests recharge.
2. Backend creates Paymee transaction and returns payment URL.
3. Paymee webhook confirms payment.
4. Transaction completion updates token balance.
5. Token endpoints support conversion and balance checks.

---

## 4) Backend Route Registry (from `server.js`)

- `/webhooks` -> webhook routes
- `/api/payments` -> payment routes
- `/token` -> token/payment utility routes
- `/users` -> user routes
- `/ticket` -> ticket routes
- `/admin` -> admin routes
- `/schedules` -> schedule routes
- `/stations` -> station routes
- `/routes` -> route routes
- `/transports` -> transport routes

Health endpoint:

- `GET /` -> `Backend API is running`

---

## 5) Backend Endpoints (complete map)

## 5.1 User endpoints (`/users`)

- `POST /users/createuser`
- `POST /users/getuseressentialinfo` (auth)
- `POST /users/changepassword` (auth)
- `POST /users/redeemtokensfromuser`
- `GET /users/auth/google`
- `GET /users/auth/callback`
- `POST /users/loginwebfirststep`
- `POST /users/loginwebsecondstep`
- `POST /users/loginmobile`
- `POST /users/controllerlogin`
- `POST /users/loginunified`
- `POST /users/loginunified/verify`

## 5.2 Ticket endpoints (`/ticket`)

- `POST /ticket/createticket` (passenger)
- `GET /ticket/mytickets/active` (passenger)
- `GET /ticket/mytickets/history` (passenger)
- `POST /ticket/getqrdatabyticketid` (passenger)
- `POST /ticket/getticketstatusbyqrdata` (controller)
- `POST /ticket/getticketstatusbyidsuffix` (controller)
- `POST /ticket/getticketdetailsbyinput` (controller)
- `POST /ticket/markticketasused` (controller)
- `POST /ticket/requestrefund` (passenger)
- `GET /ticket/refundrequests` (passenger)
- `POST /ticket/admin/announcement/delay` (admin)
- `POST /ticket/admin/announcement/cancellation` (admin)

## 5.3 Payment/token endpoints (`/api/payments`, `/token`)

- `POST /api/payments/recharge` (passenger)
- `POST /token/updatetokenbalance`
- `POST /token/verifynumberoftokens`
- `POST /token/gettokenbalance`
- `POST /token/convertmoneytotoken`
- `POST /token/converttokentomoney`
- `POST /token/getuseridbytransactionid`

## 5.4 Admin endpoints (`/admin`)

- `GET /admin/dashboard`
- `POST /admin/createcontroller`

## 5.5 Schedule endpoints (`/schedules`)

- `POST /schedules/`
- `GET /schedules/all`
- `GET /schedules/route/:routeId`
- `PUT /schedules/:id`
- `DELETE /schedules/:id`

## 5.6 Station endpoints (`/stations`)

- `GET /stations/`
- `GET /stations/:id`
- `POST /stations/`
- `PUT /stations/:id`
- `DELETE /stations/:id`

## 5.7 Route endpoints (`/routes`)

- `POST /routes/`
- `GET /routes/`
- `GET /routes/:id`
- `PUT /routes/:id`
- `DELETE /routes/:id`

## 5.8 Transport endpoints (`/transports`)

- `POST /transports/`
- `GET /transports/`
- `GET /transports/:id`
- `PUT /transports/:id`
- `DELETE /transports/:id`

## 5.9 Webhook endpoint

- `POST /webhooks/paymee`

---

## 6) Backend Functions and Responsibilities

## 6.1 Controllers

### `admin.controller.js`

- `getDashboardStats`: returns admin dashboard aggregates.
- `createController`: creates a controller account.

### `payment.controller.js`

- `createRecharge`: starts payment transaction.
- `updateTokenBalance`: updates user token balance.
- `verifyTokensNumber`: checks if user has enough tokens.
- `getTokensBalance`: returns current token balance.
- `moneyToToken`: converts money value to tokens.
- `tokenToMoney`: converts token value to money.
- `getUserIdByTransactionId`: resolves user from transaction.

### `route.controller.js`

- `create`, `getAll`, `getById`, `delete`, `update`: CRUD for transport routes.

### `schedule.controller.js`

- `create`, `getByRoute`, `getAll`, `delete`, `update`: CRUD/listing for schedules.

### `station.controller.js`

- `getAllStations`, `getStationById`, `createStation`, `updateStation`, `deleteStation`: station CRUD.

### `ticket.controller.js`

- `createTicket`: creates ticket for passenger.
- `getQrDataByTicketId`: returns QR payload.
- `getTicketStatusByQrData`: verify by QR payload.
- `getTicketStatusByIdSuffix`: verify by short suffix.
- `getTicketDetailsByInput`: resolves by full id or suffix.
- `markTicketAsUsed`: validates/consumes ticket.
- `getMyActiveTickets`, `getMyTicketHistory`: passenger ticket lists.
- `createDelayAnnouncement`, `createCancellationAnnouncement`: disruption publishing.
- `requestRefund`, `getRefundRequests`: refund workflow.

### `transport.controller.js`

- `create`, `getAll`, `getById`, `update`, `delete`: transport CRUD.

### `user.controller.js`

- `createUser`: registration.
- `getUserEssentialInfo`: profile essentials.
- `redeemTokensFromUser`: token debit operation.
- `googleSignIn`, `googleSignUpCallback`: Google auth.
- `changePassword`: credential update.
- `controllerLogin`: controller login.
- `loginForPassengerAdminAndSuperAdmin`: web step-1 login.
- `secondStepLoginForAdminAndSuperAdmin`: web step-2 code verification.
- `userLoginForMobile`: mobile login path.
- `unifiedMobileLogin`: role-unified mobile login path.
- `verifyRoleCode`: second-factor/role code verification.

## 6.2 Services

### `ticket.service.js`

- `createTicket`: creates ticket, generates QR, decrements schedule seats.
- `getQrDataByTicketId`: fetch QR image payload.
- `getTicketStatusByQrData`: returns ticket status by QR payload.
- `getTicketsByPassenger`: active/history listing with disruption + refund enrichment.
- `getTicketByIdSuffix`: short-code ticket lookup.
- `getTicketByIdentifier`: full-id or short-code resolver.
- `markTicketAsUsed`: marks active ticket as used.
- `createDelayAnnouncement`: adds/activates delay announcement.
- `createCancellationAnnouncement`: adds/activates cancellation announcement.
- `requestRefundByPassenger`: creates refund request if eligible.
- `getRefundRequestsByPassenger`: returns passenger refund requests.

### `payment.service.js`

- `createRecharge`: creates payment transaction.
- `updateTokenBalance`: token credit update.
- `verifyTokensNumber`: sufficiency check.
- `getTokensBalance`: read balance.
- `getUserIdByTransactionId`: resolve owner by transaction.
- `completeRechargeTransactionById`: finalize credited transaction.

### `schedule.service.js`

- `getCancelledScheduleIds`: derives cancelled schedule IDs.
- `createSchedule`: creates schedule with initial seats.
- `getAllSchedules`: list schedules by date (excluding cancelled).
- `deleteSchedule`: delete schedule.
- `getSchedulesByRoute`: route-specific list (excluding cancelled).

### `station.service.js`

- `createStation`, `getAllStations`, `getStationById`, `updateStation`, `deleteStation`.

### `route.service.js`

- `createFullRoute`, `getRouteDetails`, `getAllRoutes`, `deleteRoute`.

### `transport.service.js`

- `createTransport`, `getAllTransports`, `getTransportById`, `updateTransport`, `deleteTransport`.

### `user.service.js`

- `createUser`, `getUserEssentialInfo`, `redeemTokensFromUser`.
- `signUpWithGoogle`, `handleAuthCallback`.
- `userLoginForMobile`, `unifiedMobileLogin`, `controllerLogin`.
- `loginForPassengerAdminAndSuperAdmin`.
- `verifyAdminCode`, `verifycontrollerCode`, `verifySuperAdminCode`.
- `getPendingSession`, `deletePendingSession`.
- `changeUserPassword`.

---

## 7) Data and State Rules

- Ticket statuses: `Active`, `Used`, `Expired`, `Refunded`.
- Controller can validate only `Active` ticket on matching selected schedule.
- Short code = last segment after `-` from ticket UUID.
- Seat consumption:
  - each created ticket decrements `schedules.available_seats` by 1.
  - multi-quantity purchase repeats creation and decrements accordingly.
- Cancelled schedules are hidden from schedule listing endpoints.
- Refund requests are only valid for cancelled ticket schedules.

---

## 8) Mobile App Screen/Flow Map

Authentication and shell:

- Splash -> Login -> role-based navigation.

Passenger key screens:

- Home
- Bus schedule / Train schedule
- My Tickets (active + history)
- Refund requests
- Profile
- Recharge
- Profile includes a language selector for switching between English and Arabic.
- Common passenger and controller screens now use localized labels for booking, schedule browsing, days, transport types, and ticket validation.
- A welcome screen is shown after splash so the user can choose language before entering the app.

Controller key screen:

- Controller Home:
  - choose date
  - choose transport type
  - choose schedule
  - scan QR or enter short code
  - review ticket details
  - validate ticket

---

## 9) Web Frontend Status and Integration Guidance

Current web status:

- Routing exists for login/register.
- Protected route scaffold exists but is empty.

How to connect complete web frontend safely:

1. Reuse backend endpoints listed above (same contracts as mobile).
2. Add web auth context for bearer token persistence.
3. Implement role-aware route guards (passenger/admin/controller).
4. Implement API modules by domain:
   - users/auth
   - schedules/routes/stations/transports
   - tickets/controller verification
   - admin dashboard + controller creation
5. Implement ticket and controller flows exactly as mobile rules.

---

## 10) Operational Notes for Developers

- Backend local host for emulator: `10.0.2.2` (Android emulator only).
- Backend host for real phone: use local LAN IP (example: `192.168.1.8`).
- Android cleartext HTTP must be enabled for local `http://` development.
- Keep all clients (web/mobile) aligned on the same endpoint contracts.

---

## 11) Recommended Next Conception Steps

- Formal API spec (OpenAPI/Swagger) generated from current route contracts.
- Domain diagrams:
  - user-role lifecycle
  - ticket lifecycle
  - payment transaction lifecycle
- Web frontend completion using the exact backend map in this document.
- Add automated tests for:
  - ticket validation rules,
  - seat decrement behavior,
  - refund eligibility,
  - cancellation filtering.
