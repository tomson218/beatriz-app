# Backend — API Server

An API server built with Express.js + Mongoose that handles events, users, orders, Stripe payments and discount codes.

## Quick Start

### Requirements

- **Node.js** 22.18+ (the backend runs TypeScript natively, without compilation or Babel)
- **MongoDB** — a local instance or MongoDB Atlas
- **Stripe** — an account and API keys

### Installation

From the project root:

```bash
npm install
```

### Configuration

Create a `backend/.env.local` file (template: `backend/.env.example`):

```env
DATABASE=mongodb://localhost:27017/beatriz
DATABASE_PASSWORD=your_password
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
STRIPE_SK=sk_test_...
STRIPE_ENDPOINT_SECRET=whsec_...
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
GOOGLE_MAIL_USERNAME=your_email@gmail.com
GOOGLE_MAIL_PASSWORD=your_app_password
```

### Running

```bash
# From the project root
npm run dev:backend

# Or from backend/
npm start
```

The server starts on the port set in `PORT` in `.env.local` (default `3000`).

### Stripe Webhook (development mode)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/v2/webhooks/stripe
```

## Structure

```text
backend/
├── modules/            # Domain modules: <name>.routes, .controller, .service, .model, .mapper, .type
│   ├── auth/           # Sign-up and login
│   ├── users/          # User management
│   ├── events/         # Events CRUD
│   ├── orders/         # Orders
│   ├── tickets/        # Tickets and seats
│   ├── posts/          # Event forum
│   ├── discountCodes/  # Discount codes
│   ├── payments/       # Stripe checkout sessions
│   └── webhooks/       # Stripe webhook
├── utils/              # Helpers (prices and discounts, checkout validation, JWT, email, PDF, formatting)
├── scripts/            # One-off scripts (e.g. database migrations)
├── tests/
│   ├── helpers/        # Shared test helpers (mockQuery, catchError)
│   └── unit/           # Unit tests, mirroring the source layout (utils/, modules/<module>/)
├── app.ts              # Express app (middleware and routes)
├── index.ts            # Entry point (database connection and server start)
├── vitest.config.ts    # Test configuration
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication (`/api/v2/auth`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Log in |
| POST | `/auth/refresh` | Refresh the access token |
| POST | `/auth/logout` | Log out |
| POST | `/auth/google` | Log in with Google |
| POST | `/auth/facebook` | Log in with Facebook |

### Users (`/api/v2/users`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | Get all users (admin) |
| GET | `/users/me` | Get your own profile |
| PATCH | `/users/me` | Update your own details |
| DELETE | `/users/me` | Deactivate your own account |
| PUT | `/users/me/cart` | Replace your own cart |
| GET | `/users/me/favourites` | Get favourite events |
| POST | `/users/me/favourites` | Add an event to favourites |
| DELETE | `/users/me/favourites/:eventId` | Remove an event from favourites |
| GET | `/users/me/orders` | Get your own orders |
| GET | `/users/me/tickets` | Get your own tickets |
| GET | `/users/:id` | Get a user (owner or admin) |
| PATCH | `/users/:id` | Edit a user (admin) |
| DELETE | `/users/:id` | Delete a user (admin) |
| GET | `/users/:id/orders` | Get a user's orders (owner or admin) |
| GET | `/users/:id/tickets` | Get a user's tickets (owner, admin or employee) |

### Events (`/api/v2/events`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | Get upcoming events |
| POST | `/events` | Create an event (admin, employee) |
| GET | `/events/:id` | Get event details |
| PATCH | `/events/:id` | Update an event (admin, employee) |
| DELETE | `/events/:id` | Delete an event (admin, employee) |
| GET | `/events/:eventId/posts` | Get the event's posts |
| POST | `/events/:eventId/posts` | Add a post to the event |
| GET | `/events/:eventId/availability` | Get free seats per sector |
| GET | `/events/:eventId/occupied-seats?sector=&block=` | Get occupied seats |

### Orders, tickets and posts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/orders?status=` | Get orders, optionally filtered by status (admin) |
| POST | `/orders` | Place an order with offline payment (expires if unpaid after 48 hours) |
| PATCH | `/orders/:id` | Approve (`paid`) or reject (`rejected`) an offline payment (admin) |
| GET | `/tickets` | Get all tickets (admin, employee) |
| GET | `/posts` | Get all posts |

### Discount Codes (`/api/v2/discount-codes`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/discount-codes` | Get discount codes (admin) |
| POST | `/discount-codes` | Add a discount code (admin) |
| POST | `/discount-codes/apply` | Apply a discount code |

### Payments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/checkout-sessions` | Create a Stripe checkout session |
| POST | `/webhooks/stripe` | Stripe webhook (payment confirmation) |

## Payment Flow

```text
Frontend (OrderSummary)
    ↓ POST /checkout-sessions { products: CartTicket[] }
Backend (paymentController)
    ↓ Saves the tickets in user.cart
    ↓ Creates a Stripe session
    ↓ Returns session.url
Frontend → Redirect to Stripe Checkout
    ↓ User pays
Stripe → POST /webhooks/stripe { event: checkout.session.completed }
Backend (webhookController)
    ↓ Creates the Order
    ↓ Creates the Tickets
    ↓ Marks the discount code as used
    ↓ Generates a PDF
    ↓ Sends a confirmation email
    ↓ Clears the cart
Frontend → /success (user sees a confirmation message)
```

### Webhook Controller

After receiving the `checkout.session.completed` event:

1. **Load the user** — by `userId` from the session metadata
2. **Mark the discount code** as used (`appliedDiscount.isUsed = true`)
3. **Create the order** (`OrderModel.create`) with the ticket data
4. **Create the tickets** (`TicketModel.create`) for each ticket
5. **Generate a PDF** with the tickets
6. **Send an email** with the confirmation and the PDF attached
7. **Clear the cart** (`user.cart = []`)

## Middleware

- **`helmet`** — HTTP security headers
- **`cors`** — Cross-Origin Resource Sharing
- **`express-rate-limit`** — request rate limiting
- **`morgan`** — request logging
- **`body-parser`** — request body parsing
- **`swagger-ui-express`** — API documentation

## Tests

```bash
# From backend/
npm test             # single run
npm run test:watch   # watch mode
npm run lint         # ESLint
```

Unit tests are written with [Vitest](https://vitest.dev) and live in `tests/unit/`, mirroring the source layout:

- `tests/unit/utils/*.test.ts` — pure functions: prices and discounts, cart validation, JWT tokens, PDF, etc.
- `tests/unit/modules/<module>/<module>.service.test.ts` — service logic; Mongoose models are mocked (`vi.mock`), so the tests never touch the database, Stripe or email.
- `tests/unit/modules/mappers.test.ts` — mapping documents to DTOs.

Each test computes a `result` and compares it with an `expected` value. Errors are captured with the `catchError` / `catchAsyncError` helpers from `tests/helpers/catchError.ts`, so they are asserted the same way.

Environment variables for tests (e.g. `JWT_SECRET`) are set in `vitest.config.ts`, so `.env.local` is not needed.

## Dependencies

- **express** — web framework
- **mongoose** — ODM for MongoDB
- **stripe** — Stripe payments integration
- **jsonwebtoken** — JWT authorization
- **nodemailer** — sending emails
- **pdfkit** + **@react-pdf/renderer** — PDF generation
- **multer** — file uploads
- **bcryptjs** — password hashing
- **@beatriz/shared** — shared types and schemas
