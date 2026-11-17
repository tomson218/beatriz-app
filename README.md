# Beatriz App — System Rezerwacji Biletów na Wydarzenia

Aplikacja do rezerwacji biletów na wydarzenia z płatnościami Stripe, kodami rabatowymi, forami i profilem użytkownika.

## Architektura

Projekt jest **monorepo** zarządzanym przez npm workspaces, składający się z trzech modułów:

| Moduł | Opis |
|-------|------|
| `shared/` | Wspólne typy TypeScript, schematy Mongoose, enumy i stałe |
| `backend/` | Serwer API (Express + Mongoose + Stripe) |
| `frontend/` | Aplikacja kliencka (React + Vite + TypeScript) |

## Szybki Start

### Wymagania

- **Node.js** 18+
- **MongoDB** — lokalna instancja lub MongoDB Atlas
- **Stripe** — konto i klucze API

### Instalacja

```bash
npm install
```

Instalacja zainstaluje zależności wszystkich trzech modułów jednocześnie (dzięki npm workspaces).

### Konfiguracja

#### Backend — `backend/config.env`

```
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

#### Frontend — `frontend/.env`

```
VITE_GOOGLE_CLIENT_ID=twoj_google_client_id
VITE_FACEBOOK_APP_ID=twoj_facebook_app_id
```

### Uruchomienie

```bash
# Uruchom backend (port 3000)
npm run dev:backend

# Uruchom frontend (port 5173)
npm run dev:frontend
```

Aplikacja frontendowa będzie dostępna pod adresem `http://localhost:5173`.

### Stripe Webhook (tryb deweloperski)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/v2/webhook
```

## Struktura Projektu

```
beatriz-app/
├── backend/          # Serwer API (Express)
│   ├── controllers/  # Logika biznesowa endpointów
│   ├── models/       # Modele Mongoose
│   ├── mappers/      # Mapowanie modeli na DTO
│   ├── utils/        # Pomocnicze funkcje
│   └── tests/        # Testy jednostkowe
├── frontend/         # Aplikacja React
│   └── src/
│       ├── api/      # Hooki React Query (zapytania i mutacje)
│       ├── components/ # Komponenty UI
│       ├── context/  # Konteksty (User, Order)
│       ├── pages/    # Strony aplikacji
│       └── utils/    # Funkcje pomocnicze
├── shared/           # Wspólny moduł
│   ├── types/        # Typy TypeScript
│   ├── schemas/      # Schematy Mongoose
│   ├── enums/        # Enumy
│   └── constants/    # Stałe
└── package.json      # Monorepo (npm workspaces)
```

## Kluczowe Technologie

- **Backend**: Express, Mongoose, Stripe, JWT, Nodemailer, Swagger
- **Frontend**: React 18, Vite, TypeScript, TanStack Query, React Router, Mantine, Shadcn/ui, TailwindCSS
- **Shared**: Mongoose (schematy), bcryptjs, validator

## Proces Zakupu Biletów

Pełny opis przepływu danych od strony głównej po zakupione bilety znajduje się w:

- **Frontend**: `frontend/README.md` — krok po kroku proces zakupu
- **Backend**: `backend/README.md` — endpointy i przepływ płatności

---

Więcej szczegółów w README poszczególnych modułów: [`shared/`](./shared/README.md), [`backend/`](./backend/README.md), [`frontend/`](./frontend/README.md).
