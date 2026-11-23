# Frontend — React App

A client application built with React + TypeScript for booking event tickets.

## Quick Start

### Requirements

- **Node.js** 18+
- **Backend** — a running API server (see `backend/README.md`)

### Installation

From the project root:

```bash
npm install
```

### Configuration

Create a `frontend/.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### Running

```bash
# From the project root
npm run dev:frontend

# Or from frontend/
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production build

```bash
npm run build
```

### Tests

```bash
npm test
```

Tests are written with Vitest and Testing Library.

## Architecture

The app is built with **React + TypeScript** and the following key technologies:

- **React Router DOM** — page routing
- **React Query (TanStack Query)** — API queries and mutations
- **React Context API** — global state (user, order)
- **localStorage** — state persistence across page reloads
- **Mantine + Shadcn/ui** — UI components
- **TailwindCSS** — styling
- **React Hot Toast** — notifications

## Structure

```text
frontend/src/
├── app/                # App bootstrap
│   ├── App.tsx         # Providers
│   ├── Router.tsx      # Routes
│   ├── layout/         # Navbar and LayoutWrapper
│   └── pages/          # Error404
├── features/           # App features (counterparts of the backend modules)
│   ├── auth/           # Login, sign-up, route protection, UserContext
│   ├── users/          # Profile and user management
│   ├── events/         # Events and favourites
│   ├── orders/         # Cart, payment, order history, OrderContext
│   ├── tickets/        # Tickets, hall, sectors, zones and seats
│   ├── posts/          # Event forum
│   ├── discountCodes/  # Discount codes
│   ├── admin/          # Admin panel
│   └── faq/            # Questions and answers
├── shared/             # Feature-independent code
│   ├── api/            # HTTP client and query keys
│   ├── components/     # ui (shadcn), libs, Form, FormInput, FormButton
│   ├── lib/            # The cn function
│   ├── types/          # Shared types
│   └── utils/          # localStorage, dates, API responses
├── assets/             # Images and icons
├── test/               # Test setup
└── __tests__/          # Tests

Each feature in features/ may contain the folders:
api/mutations/, api/queries/ (React Query hooks), components/, pages/, context/ and utils/.
```

## Contexts and State Management

### UserContext

**File:** `context/UserContext.tsx`

Manages user data:

- `userId` — ID of the logged-in user (from localStorage)
- `userProgress` — progress in the purchase process

### OrderContext

**File:** `context/OrderContext.tsx`

Manages the cart and the order:

- `order: CartTicket[]` — array of tickets in the cart (persisted in localStorage as `ORDERS`)
- `totalPrice: number` — total price (persisted in localStorage as `totalPrice`)
- `discountCode: string | number` — the applied discount code

## Routing

```text
/                    → Login
/register            → Sign-up
/home                → Home page (list of events)
/event-details/:id   → Event details
/hall                → Hall sector selection
/blocks              → Zone (block) selection
/seats               → Seat selection (optional)
/ticket-choice       → Ticket type selection
/summary             → Order summary
/success             → Payment success
/cancel              → Payment cancelled
/tickets             → My tickets
/favourite           → Favourite events
/user-profile        → User profile
/forum/:id           → Event forum
/calendar            → Event calendar
```

## Ticket Purchase Process — Step by Step

### Step 1: Home Page — List of Events

**Route:** `/home`
**Component:** `Home.tsx`
**API:** `useGetAllEventsQuery()` — fetches all events from the backend

The home page shows the events as `EventCard` cards. Each card contains:

- The event image
- Name, genres (stars), date and time
- A "Szczegóły" (Details) button → navigates to `/event-details/:eventId`
- A "Forum" button → navigates to `/forum/:eventId`
- A "Ulubione" (Favourites) button → adds to / removes from favourites

**Filtering:** the user can filter events by:

- Date, name, category (concert, workshop, conference, festival)
- Event star, price range, whether numbered seats are required

Filtering happens on the client, based on the fetched data.

---

### Step 2: Event Details

**Route:** `/event-details/:eventId`
**Component:** `EventDetails.tsx`
**API:** `useGetEventByIdQuery(eventId)` — fetches the details of the selected event

The page shows:

- The event image, name, genres, date, time and description
- The ticket price ("Bilety już od: X PLN" — tickets from X PLN)
- An "Add to / Remove from favourites" button
- A "Przejdź na forum" (Go to the forum) button
- **A "Wybierz sektor hali" (Choose a hall sector) button** → navigates to `/hall?eventId=${eventId}`

The `eventId` is saved in localStorage as `eventDetails`.

---

### Step 3: Hall Sector Selection

**Route:** `/hall?eventId=...`
**Component:** `Hall.tsx`
**API:** `useGetEventByIdQuery(eventId)` — fetches the sectors available for the event

The page shows a visualization of the hall with its sectors (from the `SECTORS` enum). Each sector:

- Is clickable if it is available for the event
- When clicked, is saved in the URL (`?eventId=...&sector=...`) and in localStorage
- Is disabled (grey) if it is not available

**The "Wybierz strefę" (Choose a zone) button** navigates to `/blocks?eventId=...&sector=...`.
If no sector has been selected, a warning dialog is shown.

---

### Step 4: Zone (Block) Selection

**Route:** `/blocks?eventId=...&sector=...`
**Component:** `Blocks.tsx`
**API:** `useGetEventByIdQuery(eventId)` — checks whether the event requires seats

The page shows 4 blocks (zones): **blue, green, yellow, black**.
When clicked, the block is saved in the URL (`?eventId=...&sector=...&block=...`).

**Key logic:**

- If `eventDetails.seatRequired === true` → the "Wybierz konkretne miejsce" (Choose a specific seat) button → `/seats`
- If `eventDetails.seatRequired === false` → the "Przejdź do wyboru biletów" (Go to ticket selection) button → `/ticket-choice`

---

### Step 5: Seat Selection (Optional)

**Route:** `/seats?eventId=...&sector=...&block=...`
**Component:** `Seats.tsx`
**API:** `useGetOccupiedSeatsQuery(eventId, sector, block)` — fetches occupied seats

The page shows a grid of 100 seats with a legend:

- 🟢 **Free** — can be selected
- 🔵 **Selected** — chosen by the user
- 🔴 **Occupied** — already purchased (from the API)

The user clicks free seats, which are:

- Saved in the URL (`?seats=1,5,12`)
- Saved in localStorage as `selected-seats`

**The "Przejdź do wyboru biletów" (Go to ticket selection) button** navigates to `/ticket-choice?eventId=...&sector=...&block=...&seats=...`.
If no seat has been selected, a warning dialog is shown.

---

### Step 6: Ticket Type Selection

**Route:** `/ticket-choice?eventId=...&sector=...&block=...&seats=...`
**Component:** `TicketChoice.tsx`

The page has **two modes**, depending on whether the event requires seats:

#### Mode A: With seats (`seats` is defined)

For each selected seat an `Order` component is shown with:

- Event information (name, date, image)
- Seat information (sector, zone, seat number)
- **A ticket type selector** — the user chooses Normal, Child or VIP
- The ticket price is updated in `OrderContext` when the type changes

#### Mode B: Without seats (`seats` is not defined)

An `OrderWithOutSeats` component is shown with:

- **A counter for the total number of tickets** — "Increase" / "Decrease" buttons
- **Ticket allocation by type** — for each type (normal, child, VIP) the user sets a count
- Validation: the sum of tickets by type must equal the total number of tickets

**State persistence:**

- `order` (an array of `CartTicket`) → localStorage as `ORDERS`
- `totalPrice` → localStorage as `totalPrice`

**The "Przejdź do podsumowania" (Go to summary) button** navigates to `/summary?eventId=...`.

---

### Step 7: Order Summary

**Route:** `/summary?eventId=...`
**Component:** `OrderSummary.tsx`

The page shows:

- **The list of tickets** — each as an `Order` component (read-only, the type cannot be changed)
- **The discount code form** — the `DiscountCodeForm` component
- **The total amount** — the `TotalAmount` component (reads from `OrderContext`)
- **A "Zapłać teraz" (Pay now) button** — creates a Stripe checkout session

#### Discount Code

**Component:** `DiscountCodeForm.tsx`
**API:** `useApplyDiscountCodeMutation()` → `POST /api/v2/discount-codes/apply`

The user enters a code and clicks "Użyj kodu" (Use code). The backend returns the discount percentage. The frontend:

1. Lowers the price of every ticket in `OrderContext` by that percentage
2. Updates `totalPrice`
3. Saves the code in localStorage as `code`

**Error handling:**

- `400` — the code has expired or the order value is too low
- `409` — the code has already been used
- `404` — the code is invalid

---

### Step 8: Stripe Payment

**API:** `useCreateCheckoutSessionMutation()` → `POST /api/v2/checkout-sessions`

The "Zapłać teraz" (Pay now) button sends the array of tickets (`CartTicket[]`) to the backend.

**Backend:**

1. Saves the tickets in `user.cart` in the database
2. Creates a Stripe Checkout session with the products (tickets)
3. Sets `success_url` → `/success`
4. Sets `cancel_url` → `/cancel`
5. Returns the Stripe session URL

**The frontend** redirects the user to the Stripe payment page (an external site).

---

### Step 9: Payment Result

#### Success

**Route:** `/success`
**Component:** `Success.tsx`

Shows the message "Płatność została pomyślnie zakończona!" (The payment was completed successfully!) with information about the confirmation email. The "Powróć do ekranu głównego" (Back to the home screen) button → `/home`.

#### Cancellation

**Route:** `/cancel`
**Component:** `Cancel.tsx`

Shows the message "Wysyłanie nieudane" (Sending failed) and asks the user to check their details.

---

### Step 10: Stripe Webhook — Finalizing the Order

After a successful payment, Stripe sends the `checkout.session.completed` event to the backend webhook:

1. **Load the user** — by `userId` from the session metadata
2. **Mark the discount code** as used
3. **Create the order** with the ticket data
4. **Create the tickets** for each ticket
5. **Generate a PDF** with the tickets
6. **Send an email** with the confirmation and the PDF attached
7. **Clear the cart**

---

### Step 11: My Tickets

**Route:** `/tickets`
**Component:** `Tickets.tsx`
**API:** `useGetTicketsByUserQuery(userId)` — fetches the user's tickets

The page shows the purchased tickets as `Ticket` components with:

- Event information, ticket type and price
- Sector, zone and seat (if applicable)

**Filters:**

- **"Nadchodzące" (Upcoming)** — only tickets for future events
- **"Wszystkie" (All)** — all purchased tickets

---

## Summary — The Full User Journey

```text
1.  /home                          → Browses and filters events
2.  /event-details/:eventId        → Sees the details, clicks "Choose a hall sector"
3.  /hall?eventId=...              → Picks a sector on the hall visualization
4.  /blocks?eventId=...&sector=... → Picks a zone (block)
5.  /seats?eventId=...&sector=...&block=...  → (Optional) Picks seats
6.  /ticket-choice?eventId=...     → Picks ticket types (Normal/Child/VIP)
7.  /summary?eventId=...           → Summary, discount code, "Pay now"
8.  Stripe Checkout (external)     → Card payment
9.  /success                       → Success confirmation
10. /tickets                       → Sees the purchased tickets
```

### Key Mechanisms

- **OrderContext** — carries the cart through the whole purchase process
- **localStorage** — persists state across reloads (`ORDERS`, `totalPrice`, `sector`, `selected-seats`)
- **URL params** — carry `eventId`, `sector`, `block` and `seats` between steps
- **Stripe Checkout** — external payment with a webhook for finalization
- **Webhook** — creates the order and tickets, sends an email with a PDF

## Dependencies

- **react** + **react-dom** — UI framework
- **react-router-dom** — routing
- **@tanstack/react-query** — API query management
- **react-hook-form** — forms
- **@mantine/core** + **@mantine/hooks** — UI components
- **@radix-ui/** — Shadcn/ui components
- **tailwindcss** — styling
- **react-hot-toast** — notifications
- **@react-oauth/google** — Google login
- **@fortawesome/** — icons
- **react-qr-code** — QR codes on tickets
- **vitest** + **@testing-library/** — tests
- **@beatriz/shared** — shared types and schemas
