1. NODE

Plik konfiguracyjny config.env

DATABASE=                     # URL lub nazwa bazy danych
DATABASE_PASSWORD=            # Hasło do bazy danych

NODE_ENV=                     # tryb działania aplikacji 'development'/ 'production'
PORT=                         # Port, na którym ma działać aplikacja

JWT_SECRET=                   # Klucz używany do generowania tokenów JWT
JWT_EXPIRES_IN=               # Czas wygaśnięcia tokenu JWT (np. '7d' lub '24h')

STRIPE_SK=                    # Klucz tajny Stripe
STRIPE_ENDPOINT_SECRET=       # Sekret webhooka Stripe

MAIL_USERNAME=                # Nazwa użytkownika do serwera poczty (np. email)
MAIL_PASSWORD=                # Hasło do serwera poczty
MAIL_HOST=                    # Host serwera poczty (np. smtp.gmail.com)
MAIL_PORT=                    # Port serwera poczty (np. 587 dla SMTP)

GOOGLE_MAIL_USERNAME=<email>  # Email do Google Mail
GOOGLE_MAIL_PASSWORD=<haslo>  # Hasło do Google Mail


instalacja zależności: 
npm install

uruchomienie aplikacji: nodemon. 
Aplikacja zostanie uruchomiona na porcie wskazanym w pliku config.env


uruchomienie webhooka
stripe login
stripe listen --forward-to localhost:<NAZWA_PORTU>/api/webhook



2. REACT

Plik konfiguracyjny .env
VITE_GOOGLE_CLIENT_ID=         # ID klienta Google dla logowania
VITE_FACEBOOK_APP_ID=          # ID aplikacji Facebook dla logowania


instalacja zależności: 
npm install

uruchomienie: 
npm run dev






