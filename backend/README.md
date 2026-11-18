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
stripe listen --forward-to localhost:3000/api/v2/webhooks/stripe
```

## Struktura

```
backend/
├── modules/            # Moduły domenowe: <nazwa>.routes, .controller, .service, .model, .mapper, .type
│   ├── auth/           # Rejestracja i logowanie
│   ├── users/          # Zarządzanie użytkownikami
│   ├── events/         # CRUD wydarzeń
│   ├── orders/         # Zamówienia
│   ├── tickets/        # Bilety i miejsca
│   ├── posts/          # Forum wydarzeń
│   ├── discountCodes/  # Kody rabatowe
│   ├── payments/       # Sesje płatności Stripe
│   └── webhooks/       # Webhook Stripe
├── utils/              # Funkcje pomocnicze
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
| POST | `/auth/refresh` | Odświeżenie access tokena |
| POST | `/auth/logout` | Wylogowanie |
| POST | `/auth/google` | Logowanie przez Google |
| POST | `/auth/facebook` | Logowanie przez Facebook |

### Użytkownicy (`/api/v2/users`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/users` | Pobierz wszystkich użytkowników (admin) |
| GET | `/users/me` | Pobierz własny profil |
| PATCH | `/users/me` | Zaktualizuj własne dane |
| DELETE | `/users/me` | Dezaktywuj własne konto |
| PUT | `/users/me/cart` | Zastąp własny koszyk |
| GET | `/users/me/favourites` | Pobierz ulubione wydarzenia |
| POST | `/users/me/favourites` | Dodaj wydarzenie do ulubionych |
| DELETE | `/users/me/favourites/:eventId` | Usuń wydarzenie z ulubionych |
| GET | `/users/me/orders` | Pobierz własne zamówienia |
| GET | `/users/me/tickets` | Pobierz własne bilety |
| GET | `/users/:id` | Pobierz użytkownika (właściciel lub admin) |
| PATCH | `/users/:id` | Edytuj użytkownika (admin) |
| DELETE | `/users/:id` | Usuń użytkownika (admin) |
| GET | `/users/:id/orders` | Pobierz zamówienia użytkownika (właściciel lub admin) |
| GET | `/users/:id/tickets` | Pobierz bilety użytkownika (właściciel, admin lub pracownik) |

### Wydarzenia (`/api/v2/events`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/events` | Pobierz nadchodzące wydarzenia |
| POST | `/events` | Stwórz wydarzenie (admin, pracownik) |
| GET | `/events/:id` | Pobierz szczegóły wydarzenia |
| PATCH | `/events/:id` | Zaktualizuj wydarzenie (admin, pracownik) |
| DELETE | `/events/:id` | Usuń wydarzenie (admin, pracownik) |
| GET | `/events/:eventId/posts` | Pobierz posty wydarzenia |
| POST | `/events/:eventId/posts` | Dodaj post do wydarzenia |
| GET | `/events/:eventId/availability` | Pobierz wolne miejsca w sektorach |
| GET | `/events/:eventId/occupied-seats?sector=&block=` | Pobierz zajęte miejsca |

### Zamówienia, bilety i posty

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/orders?status=` | Pobierz zamówienia, opcjonalnie według statusu (admin) |
| POST | `/orders` | Złóż zamówienie z płatnością offline (nieopłacone wygasa po 48 godzinach) |
| PATCH | `/orders/:id` | Zatwierdź (`paid`) lub odrzuć (`rejected`) wpłatę offline (admin) |
| GET | `/tickets` | Pobierz wszystkie bilety (admin, pracownik) |
| GET | `/posts` | Pobierz wszystkie posty |

### Kody Rabatowe (`/api/v2/discount-codes`)

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| GET | `/discount-codes` | Pobierz kody rabatowe (admin) |
| POST | `/discount-codes` | Dodaj kod rabatowy (admin) |
| POST | `/discount-codes/apply` | Zastosuj kod rabatowy |

### Płatności

| Metoda | Ścieżka | Opis |
|--------|---------|------|
| POST | `/checkout-sessions` | Stwórz sesję płatności Stripe |
| POST | `/webhooks/stripe` | Webhook Stripe (potwierdzenie płatności) |

## Przepływ Płatności

```
Frontend (OrderSummary)
    ↓ POST /checkout-sessions { products: CartTicket[] }
Backend (paymentController)
    ↓ Zapisuje bilety w user.cart
    ↓ Tworzy sesję Stripe
    ↓ Zwraca session.url
Frontend → Przekierowanie do Stripe Checkout
    ↓ Użytkownik płaci
Stripe → POST /webhooks/stripe { event: checkout.session.completed }
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
