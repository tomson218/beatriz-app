# Frontend — Aplikacja React

Aplikacja kliencka zbudowana w React + TypeScript do rezerwacji biletów na wydarzenia.

## Szybki Start

### Wymagania

- **Node.js** 18+
- **Backend** — uruchomiony serwer API (patrz `backend/README.md`)

### Instalacja

Z katalogu głównego projektu:

```bash
npm install
```

### Konfiguracja

Stwórz plik `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=twoj_google_client_id
VITE_FACEBOOK_APP_ID=twoj_facebook_app_id
```

### Uruchomienie

```bash
# Z katalogu głównego projektu
npm run dev:frontend

# Lub z katalogu frontend/
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

### Build produkcyjny

```bash
npm run build
```

### Testy

```bash
npm test
```

Testy są napisane w Vitest z Testing Library.

## Architektura

Aplikacja jest zbudowana w **React + TypeScript** z następującymi kluczowymi technologiami:

- **React Router DOM** — routowanie stron
- **React Query (TanStack Query)** — zarządzanie zapytaniami i mutacjami API
- **React Context API** — globalny stan (użytkownik, zamówienie)
- **localStorage** — persistencja stanu między odświeżeniami
- **Mantine + Shadcn/ui** — komponenty UI
- **TailwindCSS** — stylowanie
- **React Hot Toast** — powiadomienia

## Struktura

```
frontend/src/
├── app/                # Start aplikacji
│   ├── App.tsx         # Providery
│   ├── Router.tsx      # Trasy
│   ├── layout/         # Navbar i LayoutWrapper
│   └── pages/          # Error404
├── features/           # Funkcje aplikacji (odpowiedniki modułów backendu)
│   ├── auth/           # Logowanie, rejestracja, ochrona tras, UserContext
│   ├── users/          # Profil i zarządzanie użytkownikami
│   ├── events/         # Wydarzenia i ulubione
│   ├── orders/         # Koszyk, płatność, historia zamówień, OrderContext
│   ├── tickets/        # Bilety, hala, sektory, strefy i miejsca
│   ├── posts/          # Forum wydarzeń
│   ├── discountCodes/  # Kody rabatowe
│   ├── admin/          # Panel administratora
│   └── faq/            # Pytania i odpowiedzi
├── shared/             # Kod niezależny od funkcji
│   ├── api/            # Klient HTTP i klucze zapytań
│   ├── components/     # ui (shadcn), libs, Form, FormInput, FormButton
│   ├── lib/            # Funkcja cn
│   ├── types/          # Typy wspólne
│   └── utils/          # localStorage, daty, odpowiedzi API
├── assets/             # Obrazy i ikony
├── test/               # Konfiguracja testów
└── __tests__/          # Testy

Każda funkcja w features/ może mieć katalogi:
api/mutations/, api/queries/ (hooki React Query), components/, pages/, context/ i utils/.
```

## Konteksty i Zarządzanie Stanem

### UserContext
**Plik:** `context/UserContext.tsx`

Zarządza danymi użytkownika:
- `userId` — identyfikator zalogowanego użytkownika (z localStorage)
- `userProgress` — postęp w procesie zakupu

### OrderContext
**Plik:** `context/OrderContext.tsx`

Zarządza koszykiem i zamówieniem:
- `order: CartTicket[]` — tablica biletów w koszyku (persistowana w localStorage jako `ORDERS`)
- `totalPrice: number` — łączna cena (persistowana w localStorage jako `totalPrice`)
- `discountCode: string | number` — zastosowany kod rabatowy

## Routing

```
/                    → Login
/register            → Rejestracja
/home                → Strona główna (lista wydarzeń)
/event-details/:id   → Szczegóły wydarzenia
/hall                → Wybór sektora hali
/blocks              → Wybór strefy (bloku)
/seats               → Wybór miejsc (opcjonalnie)
/ticket-choice       → Wybór typu biletów
/summary             → Podsumowanie zamówienia
/success             → Sukces płatności
/cancel              → Anulowanie płatności
/tickets             → Moje bilety
/favourite           → Ulubione wydarzenia
/user-profile        → Profil użytkownika
/forum/:id           → Forum wydarzenia
/calendar            → Kalendarz wydarzeń
```

## Proces Zakupu Biletów — Krok po Kroku

### Krok 1: Strona Główna — Lista Wydarzeń

**Route:** `/home`
**Komponent:** `Home.tsx`
**API:** `useGetAllEventsQuery()` — pobiera wszystkie wydarzenia z backendu

Strona główna wyświetla listę wydarzeń jako karty `EventCard`. Każda karta zawiera:
- Obrazek wydarzenia
- Nazwę, gatunki (gwiazdy), datę i godzinę
- Przycisk „Szczegóły" → przekierowuje do `/event-details/:eventId`
- Przycisk „Forum" → przekierowuje do `/forum/:eventId`
- Przycisk „Ulubione" → dodaje/usuwa z ulubionych

**Filtrowanie:** Użytkownik może filtrować wydarzenia po:
- Dacie, nazwie, kategorii (koncert, warsztat, konferencja, festiwal)
- Gwiazdzie wydarzenia, zakresie cenowym, wymaganiu miejsc numerowanych

Filtrowanie odbywa się po stronie klienta na podstawie pobranych danych.

---

### Krok 2: Szczegóły Wydarzenia

**Route:** `/event-details/:eventId`
**Komponent:** `EventDetails.tsx`
**API:** `useGetEventByIdQuery(eventId)` — pobiera szczegóły wybranego wydarzenia

Strona wyświetla:
- Obrazek, nazwę, gatunki, datę, godzinę, opis wydarzenia
- Cenę biletów („Bilety już od: X PLN")
- Przycisk „Dodaj/Usuń z ulubionych"
- Przycisk „Przejdź na forum"
- **Przycisk „Wybierz sektor hali"** → przekierowuje do `/hall?eventId=${eventId}`

`eventId` jest zapisywany w localStorage jako `eventDetails`.

---

### Krok 3: Wybór Sektora Hali

**Route:** `/hall?eventId=...`
**Komponent:** `Hall.tsx`
**API:** `useGetEventByIdQuery(eventId)` — pobiera dostępne sektory wydarzenia

Strona wyświetla wizualizację hali z sektorami (z enum `SECTORS`). Każdy sektor:
- Jest klikalny, jeśli jest dostępny dla danego wydarzenia
- Po kliknięciu: sektor jest zapisywany w URL (`?eventId=...&sector=...`) i w localStorage
- Niedostępne sektory są zablokowane (szare)

**Przycisk „Wybierz strefę"** przekierowuje do `/blocks?eventId=...&sector=...`.
Jeśli sektor nie został wybrany, wyświetla się dialog ostrzegawczy.

---

### Krok 4: Wybór Strefy (Bloku)

**Route:** `/blocks?eventId=...&sector=...`
**Komponent:** `Blocks.tsx`
**API:** `useGetEventByIdQuery(eventId)` — sprawdza czy wydarzenie wymaga miejsc

Strona wyświetla 4 bloki (strefy): **blue, green, yellow, black**.
Po kliknięciu blok jest zapisywany w URL (`?eventId=...&sector=...&block=...`).

**Kluczowa logika:**
- Jeśli `eventDetails.seatRequired === true` → przycisk „Wybierz konkretne miejsce" → `/seats`
- Jeśli `eventDetails.seatRequired === false` → przycisk „Przejdź do wyboru biletów" → `/ticket-choice`

---

### Krok 5: Wybór Miejsc (Opcjonalnie)

**Route:** `/seats?eventId=...&sector=...&block=...`
**Komponent:** `Seats.tsx`
**API:** `useGetOccupiedSeatsQuery(eventId, sector, block)` — pobiera zajęte miejsca

Strona wyświetla siatkę 100 miejsc z legendą:
- 🟢 **Wolne** — można wybrać
- 🔵 **Wybrane** — zaznaczone przez użytkownika
- 🔴 **Zajęte** — już zakupione (z API)

Użytkownik klika na wolne miejsca, które są:
- Zapisywane w URL (`?seats=1,5,12`)
- Zapisywane w localStorage jako `selected-seats`

**Przycisk „Przejdź do wyboru biletów"** przekierowuje do `/ticket-choice?eventId=...&sector=...&block=...&seats=...`.
Jeśli żadne miejsce nie zostało wybrane, wyświetla się dialog ostrzegawczy.

---

### Krok 6: Wybór Typu Biletów

**Route:** `/ticket-choice?eventId=...&sector=...&block=...&seats=...`
**Komponent:** `TicketChoice.tsx`

Strona ma **dwa tryby** w zależności od tego, czy wydarzenie wymaga miejsc:

#### Tryb A: Z miejscami (`seats` jest zdefiniowany)
Dla każdego wybranego miejsca wyświetlany jest komponent `Order` z:
- Informacjami o wydarzeniu (nazwa, data, obrazek)
- Informacjami o miejscu (sektor, strefa, numer miejsca)
- **Selektorem typu biletu** — użytkownik wybiera: Normalny, Dziecięcy, VIP
- Cena biletu jest aktualizowana w `OrderContext` po zmianie typu

#### Tryb B: Bez miejsc (`seats` nie jest zdefiniowany)
Wyświetlany jest komponent `OrderWithOutSeats` z:
- **Licznikiem całkowitej liczby biletów** — przyciski „Zwiększ" / „Zmniejsz"
- **Przydziałem biletów po typach** — dla każdego typu (normal, child, VIP) użytkownik ustawia liczbę
- Walidacja: suma biletów po typach musi równać się całkowitej liczbie biletów

**Zapis stanu:**
- `order` (tablica `CartTicket`) → localStorage jako `ORDERS`
- `totalPrice` → localStorage jako `totalPrice`

**Przycisk „Przejdź do podsumowania"** przekierowuje do `/summary?eventId=...`.

---

### Krok 7: Podsumowanie Zamówienia

**Route:** `/summary?eventId=...`
**Komponent:** `OrderSummary.tsx`

Strona wyświetla:
- **Listę biletów** — każdy jako komponent `Order` (tylko do odczytu, bez zmiany typu)
- **Formularz kodu rabatowego** — komponent `DiscountCodeForm`
- **Łączną kwotę** — komponent `TotalAmount` (czyta z `OrderContext`)
- **Przycisk „Zapłać teraz"** — tworzy sesję płatności Stripe

#### Kod Rabatowy

**Komponent:** `DiscountCodeForm.tsx`
**API:** `useApplyDiscountCodeMutation()` → `POST /api/v2/discount-codes/apply`

Użytkownik wpisuje kod i klika „Użyj kodu". Backend zwraca procent rabatu. Frontend:
1. Obniża ceny wszystkich biletów w `OrderContext` o podany procent
2. Aktualizuje `totalPrice`
3. Zapisuje kod w localStorage jako `code`

**Obsługa błędów:**
- `400` — kod wygasł lub wartość zamówienia za mała
- `409` — kod już użyty
- `404` — kod niepoprawny

---

### Krok 8: Płatność Stripe

**API:** `useCreateCheckoutSessionMutation()` → `POST /api/v2/checkout-sessions`

Przycisk „Zapłać teraz" wysyła tablicę biletów (`CartTicket[]`) do backendu.

**Backend:**
1. Zapisuje bilety w `user.cart` w bazie danych
2. Tworzy sesję Stripe Checkout z produktami (biletami)
3. Ustawia `success_url` → `/success`
4. Ustawia `cancel_url` → `/cancel`
5. Zwraca URL sesji Stripe

**Frontend** przekierowuje użytkownika do strony płatności Stripe (zewnętrzna strona).

---

### Krok 9: Wynik Płatności

#### Sukces

**Route:** `/success`
**Komponent:** `Success.tsx`

Wyświetla komunikat: „Płatność została pomyślnie zakończona!" z informacją o emailu z potwierdzeniem. Przycisk „Powróć do ekranu głównego" → `/home`.

#### Anulowanie

**Route:** `/cancel`
**Komponent:** `Cancel.tsx`

Wyświetla komunikat: „Wysyłanie nieudane" z prośbą o sprawdzenie danych.

---

### Krok 10: Webhook Stripe — Finalizacja Zamówienia

Po pomyślnej płatności Stripe wysyła event `checkout.session.completed` do webhooka backendu:

1. **Pobranie użytkownika** — po `userId` z metadata sesji
2. **Oznaczenie kodu rabatowego** jako użytego
3. **Tworzenie zamówienia** z danymi biletów
4. **Tworzenie biletów** dla każdego biletu
5. **Generowanie PDF** z biletami
6. **Wysłanie emaila** z potwierdzeniem i załącznikiem PDF
7. **Wyczyszczenie koszyka**

---

### Krok 11: Moje Bilety

**Route:** `/tickets`
**Komponent:** `Tickets.tsx`
**API:** `useGetTicketsByUserQuery(userId)` — pobiera bilety użytkownika

Strona wyświetla zakupione bilety jako komponenty `Ticket` z:
- Informacjami o wydarzeniu, typem biletu, ceną
- Sektorem, strefą, miejscem (jeśli dotyczy)

**Filtry:**
- **„Nadchodzące"** — tylko bilety na wydarzenia w przyszłości
- **„Wszystkie"** — wszystkie zakupione bilety

---

## Podsumowanie — Pełna Ścieżka Użytkownika

```
1.  /home                          → Przegląda wydarzenia, filtruje
2.  /event-details/:eventId        → Widzi szczegóły, klika „Wybierz sektor hali"
3.  /hall?eventId=...              → Wybiera sektor na wizualizacji hali
4.  /blocks?eventId=...&sector=... → Wybiera strefę (blok)
5.  /seats?eventId=...&sector=...&block=...  → (Opcjonalnie) Wybiera miejsca
6.  /ticket-choice?eventId=...     → Wybiera typ biletów (Normalny/Dziecięcy/VIP)
7.  /summary?eventId=...           → Podsumowanie, kod rabatowy, „Zapłać teraz"
8.  Stripe Checkout (zewnętrzne)   → Płatność kartą
9.  /success                       → Potwierdzenie sukcesu
10. /tickets                       → Widzi zakupione bilety
```

### Kluczowe Mechanizmy

- **OrderContext** — przenosi koszyk przez cały proces zakupu
- **localStorage** — persistuje stan między odświeżeniami (`ORDERS`, `totalPrice`, `sector`, `selected-seats`)
- **URL params** — przenoszą `eventId`, `sector`, `block`, `seats` między krokami
- **Stripe Checkout** — zewnętrzna płatność z webhookiem do finalizacji
- **Webhook** — tworzy zamówienie, bilety, wysyła email z PDF

## Zależności

- **react** + **react-dom** — framework UI
- **react-router-dom** — routowanie
- **@tanstack/react-query** — zarządzanie zapytaniami API
- **react-hook-form** — formularze
- **@mantine/core** + **@mantine/hooks** — komponenty UI
- **@radix-ui/** — komponenty Shadcn/ui
- **tailwindcss** — stylowanie
- **react-hot-toast** — powiadomienia
- **@react-oauth/google** — logowanie przez Google
- **@fortawesome/** — ikony
- **react-qr-code** — kody QR na bilety
- **vitest** + **@testing-library/** — testy
- **@beatriz/shared** — wspólne typy i schematy
