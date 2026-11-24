# @beatriz/shared — Shared Types and Schemas

A module shared by the backend and the frontend, containing TypeScript types, Mongoose schemas, enums and constants.

## Overview

The `@beatriz/shared` module is the **single source of truth** for the data types used across the whole app. Thanks to it, the backend and the frontend use the same definitions, which eliminates bugs caused by mismatched types.

## Structure

```text
shared/
├── types/            # TypeScript types
│   ├── auth.ts       # Authentication types
│   ├── common.ts     # General types (SuccessItem, SuccessList)
│   ├── discountCodes.ts # Discount code types
│   ├── events.ts     # Event types
│   ├── forums.ts     # Forum types
│   ├── orders.ts     # Order types
│   ├── payments.ts   # Payment types
│   ├── tickets.ts    # Ticket types
│   ├── users.ts      # User types
│   ├── webhooks.ts   # Webhook types
│   └── index.ts      # Aggregated exports
├── schemas/          # Mongoose schemas
│   ├── userSchema.ts
│   ├── eventSchema.ts
│   ├── orderSchema.ts
│   ├── ticketSchema.ts
│   ├── forumSchema.ts
│   ├── discountCodeSchema.ts
│   └── utils.ts      # Sub-schemas (seating, prices, sector, etc.)
├── enums/            # Enums
│   ├── blockTypes.ts    # Blocks: blue, green, yellow, black
│   ├── currencies.ts    # Currencies: PLN
│   ├── eventTypes.ts    # Event types: concert, workshop, conference, festival
│   ├── sectors.ts       # Hall sectors
│   ├── ticketTypes.ts   # Ticket types: normal, child, VIP
│   └── userRoles.ts     # Roles: user, worker, admin
├── constants/        # Constants
│   ├── eventTypes.ts    # UI options with Polish labels
│   ├── faq.ts           # FAQ questions
│   ├── hallCapacity.ts  # Hall capacity (COUNT_BLOCKS, COUNT_SEAT)
│   └── misc.ts          # Other constants
├── package.json      # npm module configuration
└── tsconfig.json     # TypeScript configuration
```

## Types and Interfaces

### `type` vs `interface` strategy

-   **`type`** — for aliases, types built with utility types (`Pick`, `Omit`, `Partial`), Mongoose `InferSchemaType`, union types
-   **`interface`** — for extensible types (DTOs with `extends Omit<Model, ...>`, requests with extra fields)

### Main Models

| Model          | Description                            |
| -------------- | -------------------------------------- |
| `User`         | User (inferred from Mongoose)          |
| `Event`        | Event (inferred from Mongoose)         |
| `Order`        | Order (inferred from Mongoose)         |
| `Ticket`       | Ticket (inferred from Mongoose)        |
| `Post`         | Forum post (inferred from Mongoose)    |
| `DiscountCode` | Discount code (inferred from Mongoose) |

### DTOs

| DTO               | Description                          |
| ----------------- | ------------------------------------ |
| `UserDto`         | User data for API responses          |
| `EventDto`        | Event data for API responses         |
| `OrderDto`        | Order data for API responses         |
| `TicketDto`       | Ticket data for API responses        |
| `PostDto`         | Post data for API responses          |
| `DiscountCodeDto` | Discount code data for API responses |

## Mongoose Schemas

The schemas define the structure of MongoDB documents and are used by the backend to create models:

-   **`userSchema`** — user data, password, roles, social login
-   **`eventSchema`** — event details, prices, sectors, required seats
-   **`orderSchema`** — order with tickets, amount and currency
-   **`ticketSchema`** — ticket with type, price and seat
-   **`forumSchema`** — event forum post
-   **`discountCodeSchema`** — discount code with percentage, limit and dates

### Sub-schemas (`schemas/utils.ts`)

-   **`seatingSchema`** — sector, block, seat
-   **`pricesSchema`** — ticket prices by type
-   **`sectorSchema`** — hall sector with capacity
-   **`ticketTypeSchema`** — ticket type with price
-   **`ticketSubSchema`** — ticket sub-structure
-   **`appliedDiscountCodeSchema`** — an applied discount code

## Usage

The module is imported via the `@beatriz/shared/*` alias:

```typescript
// Example imports
import type { User, UserDto } from '@beatriz/shared/users';
import type { Event, EventDto } from '@beatriz/shared/events';
import { SECTORS } from '@beatriz/shared/enums/sectors';
import { userSchema } from '@beatriz/shared/schemas/userSchema';
import type { SuccessItem, SuccessList } from '@beatriz/shared/common';
```

## Dependencies

-   **mongoose** — database schemas and types
-   **bcryptjs** — password hashing
-   **validator** — data validation
-   **axios** — HTTP types

## Scripts

```bash
npm run typecheck  # TypeScript type check
```
