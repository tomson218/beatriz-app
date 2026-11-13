# Backend API documentation

Base prefix: `/api/v2`

## Authentication

### 1) POST `/api/v2/auth/signup`

- Creates a new user.
- Returns `accessToken` in the response body.
- Sets `refreshToken` in an HTTP-only cookie.

### 2) POST `/api/v2/auth/login`

- Logs the user in.
- Returns `accessToken` in the response body.
- Sets `refreshToken` in an HTTP-only cookie.

### 3) POST `/api/v2/auth/refresh-token`

- Reads `refreshToken` from the cookie.
- Validates the token.
- Returns a new `accessToken` and user payload.
- Rotates the refresh token cookie.
- Frontend must send `credentials: 'include'` for cookies to work.

### 4) POST `/api/v2/auth/logout`

- Clears the `refreshToken` cookie.
- Returns:
    ```json
    {
    	"status": "success",
    	"data": null
    }
    ```

### 5) POST `/api/v2/auth/googleLogin`

- Google OAuth login flow.
- Returns `accessToken` plus user data.

### 6) POST `/api/v2/auth/facebookLogin`

- Facebook OAuth login flow.
- Returns `accessToken` plus user data.

### 7) POST `/api/v2/auth/forgetPassword`

- Sends reset-password email.

### 8) PATCH `/api/v2/auth/resetPassword/:token`

- Resets password using token from email.

### 9) PATCH `/api/v2/auth/updateMyPassword`

- Updates current user password.

## Security notes

- `accessToken` is sent in the Authorization header as a Bearer token.
- `refreshToken` is stored in an HTTP-only, secure cookie.
- In production, cookie security is enabled with `secure: true`.
