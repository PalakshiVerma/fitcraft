# Security Changes

Here is a summary of the 6 security fixes implemented for the Fitcraft application.

### Fix 1 — Remove the hardcoded JWT fallback secret
* **What was vulnerable:** The application used a publicly known, hardcoded string as a fallback for the JWT secret, allowing anyone to forge authentication tokens if the environment variable was missing in production.
* **What was changed:** Moved JWT secret validation to a new shared config (`server/config/env.js`) that throws an error on boot if the secret is unset. Imported this config in `server/routes/auth.js` and `server/middleware/authMiddleware.js`.
* **Why this approach:** Fail-fast on startup ensures the application never runs in an insecure state, forcing the developer to provide a secure secret.
* **How to verify it:** Temporarily remove `JWT_SECRET` from `server/.env` and start the server (`node server.js`); it should crash immediately with a clear error message.

### Fix 2 — Add server-side password validation on register
* **What was vulnerable:** The registration API accepted any non-empty string for a password, meaning attackers could bypass client-side checks and create accounts with dangerously weak passwords.
* **What was changed:** Added manual password validation in `server/routes/auth.js` (at least 8 characters, one letter, and one number), returning a `400` status code with a standard error message on failure.
* **Why this approach:** A lightweight regex validation keeps the registration logic simple and avoids adding additional dependencies for just a single string check, while still significantly improving account security.
* **How to verify it:** Send a POST request to `/api/auth/register` with the password `"12345"`; it should fail with a `400 Bad Request` and an error detailing the password requirements.

### Fix 3 — Lock down CORS to a known origin
* **What was vulnerable:** The server allowed cross-origin requests from any domain, exposing the API to Cross-Site Request Forgery (CSRF) and unwanted access from malicious websites.
* **What was changed:** Updated `server/server.js` to read an allowed origins list from the `CLIENT_ORIGIN` environment variable and passed it to the `cors` middleware with `credentials: true`.
* **Why this approach:** Using an environment variable allows flexibility across different environments (local vs. staging vs. production) without hardcoding values in the source code.
* **How to verify it:** Send an API request with an `Origin: http://malicious.com` header; the response should not include the `Access-Control-Allow-Origin` header for that domain.

### Fix 4 — Address JWT-in-localStorage XSS exposure
* **What was vulnerable:** JWT tokens were stored in `localStorage`, making them easily accessible to any malicious JavaScript (XSS) injected into the application.
* **What was changed:** Updated `server/routes/auth.js` to set the token as an `httpOnly` cookie and added `cookie-parser` to `server/server.js`. Updated `server/middleware/authMiddleware.js` to read the token from cookies. Configured the client's axios instance (`client/src/config/api.js`) to use `withCredentials: true` and removed raw token storage from `client/src/services/authService.js`.
* **Why this approach:** `httpOnly` cookies cannot be read by JavaScript, completely neutralizing the threat of token theft via XSS, which is much more secure than `localStorage`.
* **How to verify it:** Log in via the client UI and inspect the browser's DevTools under Application > Storage; the `token` should appear as an `HttpOnly` cookie and should not be present in `localStorage`.

### Fix 5 — Validate workout input server-side
* **What was vulnerable:** The server accepted raw request bodies for workout creation and updates without validating their shape or types, potentially leading to database pollution or NoSQL injection.
* **What was changed:** Created a `zod` schema in `server/validators/workoutValidator.js` and applied it as validation middleware to the `POST /` and `PUT /:id` routes in `server/routes/workouts.js`.
* **Why this approach:** `zod` is a robust schema declaration and validation library that ensures the data perfectly matches the Mongoose schema before hitting the database, providing clear error details.
* **How to verify it:** Send a POST request to `/api/workouts` with an invalid payload (e.g., `duration_minutes: -5`); it should return a `400` status with validation error details.

### Fix 6 — Shorten JWT lifetime + add basic revocation
* **What was vulnerable:** JWTs were valid for 7 days and could not be revoked, meaning a stolen token granted an attacker uninterrupted access for a full week even if the user logged out.
* **What was changed:** Shortened token lifespan to 1 hour in `server/routes/auth.js`. Added a new `POST /logout` route that saves the token to a new `RevokedToken` model (which auto-clears via a TTL index). Added a check in `server/middleware/authMiddleware.js` to reject revoked tokens.
* **Why this approach:** While a full refresh-token system is the industry standard for long-lived sessions, this lightweight blocklist combined with shorter expiries drastically reduces the attack window while maintaining a simple architecture suitable for this project size.
* **How to verify it:** Log in to get a token, then log out (hitting the `/api/auth/logout` endpoint). Any subsequent request with that same token should fail with a `401 Unauthorized: Token revoked`.

---

## Before / After Summary

| Fix | Before | After |
| :--- | :--- | :--- |
| **1. JWT Secret** | Hardcoded, publicly known fallback secret used if env var was missing. | Server crashes on boot if secret is missing, preventing insecure deployments. |
| **2. Password Validation** | Server accepted any non-empty string for a password. | Server enforces minimum 8 characters, 1 letter, and 1 number. |
| **3. CORS Policy** | Accepted cross-origin requests from any domain (`*`). | Restricted to a specific origin list defined via environment variables. |
| **4. Token Storage (XSS)** | JWTs stored in XSS-vulnerable `localStorage`. | JWTs stored in secure, `httpOnly` cookies that JavaScript cannot access. |
| **5. Payload Validation** | Workout data saved blindly to the database. | Strict `zod` schema validation applied before database operations. |
| **6. Token Lifetime & Revocation** | Tokens lived for 7 days and couldn't be invalidated. | Tokens expire in 1 hour and can be revoked explicitly upon logout. |
