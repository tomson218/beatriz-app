# Backend — Serwer API

Serwer API zbudowany na Express.js + Mongoose, obsługujący zarządzanie wydarzeniami, użytkownikami, zamówieniami, płatnościami Stripe i kodami rabatowymi.

## Szybki Start

### Wymagania

- **Node.js** 22.18+ (backend jest uruchamiany natywnie jako TypeScript, bez kompilacji i Babela)
- **MongoDB** — lokalna instancja lub MongoDB Atlas
- **Stripe** — konto i klucze API

### Instalacja

Z katalogu głównego projektu:

```bash
npm install
```

### Konfiguracja

Stwórz plik `backend/.env.local` (wzór: `backend/.env.example`):

```env
DATABASE=mongodb://localhost:27017/beatriz
DATABASE_PASSWORD=twoje_hasło
NODE_ENV=development
PORT=3000
JWT_SECRET=tajny_klucz_jwt
JWT_EXPIRES_IN=7d
STRIPE_SK=sk_test_...
STRIPE_ENDPOINT_SECRET=whsec_...
MAIL_USERNAME=twoj_email@gmail.com
MAIL_PASSWORD=hasło_aplikacji
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
GOOGLE_MAIL_USERNAME=twoj_email@gmail.com
GOOGLE_MAIL_PASSWORD=hasło_aplikacji
```

### Uruchomienie

```bash
# Z katalogu głównego projektu
npm run dev:backend

# Lub z katalogu backend/
npm start
```

Serwer uruchomi się na porcie wskazanym w `config.env` (domyślnie `3000`).

### Stripe Webhook (tryb deweloperski)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/v2/webhook
```

## Struktura

```
backend/
├── controllers/        # Logika biznesowa endpointów
│   ├── authController.ts        # Rejestracja, logowanie, reset hasła
│   ├── userController.ts        # Zarządzanie użytkownikami
│   ├── eventController.ts       # CRUD wydarzeń
│   ├── orderController.ts       # Zamówienia
│   ├── ticketController.ts      # Bilety i miejsca
│   ├── forumController.ts       # Forum wydarzeń
│   ├── discountCodeController.ts # Kody rabatowe
│   ├── paymentController.ts     # Sesje płatności Stripe
│   └── webhookController.ts     # Webhook Stripe
├── models/             # Modele Mongoose
│   ├── userModel.ts
│   ├── eventModel.ts
│   ├── orderModel.ts
│   ├── ticketModel.ts
│   ├── forumModel.ts
│   ├── discountCodeModel.ts
│   └── utils.ts
├── mappers/            # Mapowanie modeli na DTO
│   ├── orderMapper.ts
│   └── forumMapper.ts
├── utils/              # Funkcje pomocnicze
│   ├── appError.ts         # Klasa błędów
│   ├── emailTemplate.ts    # Szablony emaili
│   ├── formattings.ts      # Formatowanie danych
│   └── validateNumbers.ts  # Walidacja liczb
├── tests/              # Testy jednostkowe
├── capacityHall.ts     # Obliczanie pojemności hali
├── index.ts            # Punkt wejścia (Babel)
├── package.json
└── tsconfig.json
```

## Endpointy API

### Uwierzytelnianie (`/api/v2/auth`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/auth/signup` | Rejestracja nowego użytkownika |
| POST | `/auth/login` | Logowanie |
| POST | `/auth/logout` | Wylogowanie |
| POST | `/auth/forget-password` | Żądanie resetu hasła |
| POST | `/auth/reset-password` | Reset hasła |
| POST | `/auth/update-password` | Zmiana hasła |
| POST | `/auth/google-login` | Logowanie przez Google |
| POST | `/auth/facebook-login` | Logowanie przez Facebook |

### Użytkownicy (`/api/v2/users`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/users` | Pobierz wszystkich użytkowników (admin) |
| GET | `/users/:id` | Pobierz użytkownika po ID |
| PUT | `/users/me` | Zaktualizuj własne dane |
| DELETE | `/users/:id` | Usuń użytkownika (admin) |

### Wydarzenia (`/api/v2/events`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/events` | Pobierz wszystkie wydarzenia |
| GET | `/events/:id` | Pobierz szczegóły wydarzenia |
| POST | `/events` | Stwórz nowe wydarzenie (admin) |
| PUT | `/events/:id` | Zaktualizuj wydarzenie (admin) |
| DELETE | `/events/:id` | Usuń wydarzenie (admin) |

### Zamówienia (`/api/v2/orders`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/orders` | Pobierz wszystkie zamówienia |
| POST | `/orders` | Stwórz zamówienie |

### Bilety (`/api/v2/tickets`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/tickets` | Pobierz bilety użytkownika |
| GET | `/occupy-seats` | Pobierz zajęte miejsca (eventId, sector, block) |

### Forum (`/api/v2/forums`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/forums/:eventId` | Pobierz posty dla wydarzenia |
| POST | `/forums/:eventId` | Dodaj post do wydarzenia |

### Kody Rabatowe (`/api/v2/discountCodes`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/discountCodes/apply` | Zastosuj kod rabatowy |
| POST | `/discountCodes` | Dodaj kod rabatowy (admin) |

### Płatności

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/create-checkout-session` | Stwórz sesję płatności Stripe |
| POST | `/webhook` | Webhook Stripe (potwierdzenie płatności) |

## Przepływ Płatności

```
Frontend (OrderSummary)
    ↓ POST /create-checkout-session { products: CartTicket[] }
Backend (paymentController)
    ↓ Zapisuje bilety w user.cart
    ↓ Tworzy sesję Stripe
    ↓ Zwraca session.url
Frontend → Przekierowanie do Stripe Checkout
    ↓ Użytkownik płaci
Stripe → POST /webhook { event: checkout.session.completed }
Backend (webhookController)
    ↓ Tworzy Order
    ↓ Tworzy Tickets
    ↓ Oznacza kod rabatowy jako użyty
    ↓ Generuje PDF
    ↓ Wysyła email z potwierdzeniem
    ↓ Czyści koszyk
Frontend → /success (użytkownik widzi komunikat)
```

### Webhook Controller

Po otrzymaniu eventu `checkout.session.completed`:

1. **Pobranie użytkownika** — po `userId` z metadata sesji
2. **Oznaczenie kodu rabatowego** jako użytego (`appliedDiscount.isUsed = true`)
3. **Tworzenie zamówienia** (`OrderModel.create`) z danymi biletów
4. **Tworzenie biletów** (`TicketModel.create`) dla każdego biletu
5. **Generowanie PDF** z biletami
6. **Wysłanie emaila** z potwierdzeniem i załącznikiem PDF
7. **Wyczyszczenie koszyka** (`user.cart = []`)

## Middleware

- **`helmet`** — nagłówki bezpieczeństwa HTTP
- **`cors`** — Cross-Origin Resource Sharing
- **`express-rate-limit`** — limitowanie zapytań
- **`morgan`** — logowanie żądań
- **`body-parser`** — parsowanie ciała żądań
- **`swagger-ui-express`** — dokumentacja API

## Testy

```bash
# Z katalogu backend/
npm test
```

Testy są napisane w Jest z MongoDB Memory Server (wirtualna baza danych do testów).

## Zależności

- **express** — framework webowy
- **mongoose** — ODM dla MongoDB
- **stripe** — integracja z płatnościami Stripe
- **jsonwebtoken** — autoryzacja JWT
- **nodemailer** — wysyłanie emaili
- **pdfkit** + **@react-pdf/renderer** — generowanie PDF
- **multer** — upload plików
- **bcryptjs** — hashowanie haseł
- **@beatriz/shared** — wspólne typy i schematy
