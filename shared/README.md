# @beatriz/shared — Wspólne Typy i Schematy

Moduł współdzielony między backendem a frontendem, zawierający typy TypeScript, schematy Mongoose, enumy i stałe.

## Opis

Moduł `@beatriz/shared` stanowi **jedno źródło prawdy** dla typów danych używanych w całej aplikacji. Dzięki temu backend i frontend korzystają z tych samych definicji, co eliminuje błędy wynikające z niezgodności typów.

## Struktura

```
shared/
├── types/            # Typy TypeScript
│   ├── auth.ts       # Typy związane z uwierzytelnianiem
│   ├── common.ts     # Typy ogólne (SuccessItem, SuccessList)
│   ├── discountCodes.ts # Typy kodów rabatowych
│   ├── events.ts     # Typy wydarzeń
│   ├── forums.ts     # Typy forów
│   ├── orders.ts     # Typy zamówień
│   ├── payments.ts   # Typy płatności
│   ├── tickets.ts    # Typy biletów
│   ├── users.ts      # Typy użytkowników
│   ├── webhooks.ts   # Typy webhooków
│   └── index.ts      # Agregacja eksportów
├── schemas/          # Schematy Mongoose
│   ├── userSchema.ts
│   ├── eventSchema.ts
│   ├── orderSchema.ts
│   ├── ticketSchema.ts
│   ├── forumSchema.ts
│   ├── discountCodeSchema.ts
│   └── utils.ts      # Pod-schematy (seating, prices, sector, itp.)
├── enums/            # Enumy
│   ├── blockTypes.ts    # Bloki: blue, green, yellow, black
│   ├── currencies.ts    # Waluty: PLN
│   ├── eventTypes.ts    # Typy wydarzeń: koncert, warsztat, konferencja, festiwal
│   ├── sectors.ts       # Sektory hali
│   ├── ticketTypes.ts   # Typy biletów: normal, child, VIP
│   └── userRoles.ts     # Role: user, worker, admin
├── constants/        # Stałe
│   ├── eventTypes.ts    # Opcje UI z polskimi labelami
│   ├── faq.ts           # Pytania FAQ
│   ├── hallCapacity.ts  # Pojemność hali (COUNT_BLOCKS, COUNT_SEAT)
│   └── misc.ts          # Inne stałe
├── package.json      # Konfiguracja modułu npm
└── tsconfig.json     # Konfiguracja TypeScript
```

## Typy i Interfejsy

### Strategia `type` vs `interface`

- **`type`** — dla aliasów, typów z utility types (`Pick`, `Omit`, `Partial`), `InferSchemaType` z Mongoose, union types
- **`interface`** — dla typów rozszerzalnych (DTO z `extends Omit<Model, ...>`, requesty z dodatkowymi polami)

### Główne Modele

| Model | Opis |
|-------|------|
| `User` | Użytkownik (inferowany z Mongoose) |
| `Event` | Wydarzenie (inferowany z Mongoose) |
| `Order` | Zamówienie (inferowany z Mongoose) |
| `Ticket` | Bilet (inferowany z Mongoose) |
| `ForumPost` | Post na forum (inferowany z Mongoose) |
| `DiscountCode` | Kod rabatowy (inferowany z Mongoose) |

### DTO

| DTO | Opis |
|-----|------|
| `UserDto` | Dane użytkownika do odpowiedzi API |
| `EventDto` | Dane wydarzenia do odpowiedzi API |
| `OrderDto` | Dane zamówienia do odpowiedzi API |
| `TicketDto` | Dane biletu do odpowiedzi API |
| `ForumPostDto` | Dane posta do odpowiedzi API |
| `DiscountCodeDto` | Dane kodu rabatowego do odpowiedzi API |

## Schematy Mongoose

Schematy definiują strukturę dokumentów w MongoDB i są używane przez backend do tworzenia modeli:

- **`userSchema`** — dane użytkownika, hasło, role, logowanie społecznościowe
- **`eventSchema`** — szczegóły wydarzenia, ceny, sektory, wymagane miejsca
- **`orderSchema`** — zamówienie z biletami, kwotą, walutą
- **`ticketSchema`** — bilet z typem, ceną, miejscem
- **`forumSchema`** — post na forum wydarzenia
- **`discountCodeSchema`** — kod rabatowy z procentem, limitem, datami

### Pod-schematy (`schemas/utils.ts`)

- **`seatingSchema`** — sektor, blok, miejsce
- **`pricesSchema`** — ceny biletów po typach
- **`sectorSchema`** — sektor hali z pojemnością
- **`ticketTypeSchema`** — typ biletu z ceną
- **`ticketSubSchema`** — podstruktura biletu
- **`appliedDiscountCodeSchema`** — zastosowany kod rabatowy

## Użycie

Moduł jest importowany przez alias `@beatriz/shared/*`:

```typescript
// Przykłady importów
import type { User, UserDto } from '@beatriz/shared/users';
import type { Event, EventDto } from '@beatriz/shared/events';
import { SECTORS } from '@beatriz/shared/enums/sectors';
import { userSchema } from '@beatriz/shared/schemas/userSchema';
import type { SuccessItem, SuccessList } from '@beatriz/shared/common';
```

## Zależności

- **mongoose** — schematy i typy bazy danych
- **bcryptjs** — hashowanie haseł
- **validator** — walidacja danych
- **axios** — typy HTTP

## Skrypty

```bash
npm run typecheck  # Sprawdzenie typów TypeScript
```
