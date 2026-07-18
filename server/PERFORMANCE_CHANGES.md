# Backend Performance & Scalability Improvements

This document outlines the 6 performance and scalability improvements made to the FitCraft backend.

### 1. Pagination for Workouts
- **Gap:** `GET /api/workouts` returned all workouts for a user unbounded, which would degrade performance and memory as history grows.
- **Change:** Modified `server/routes/workouts.js` to accept `page` and `limit` query parameters, and used Mongoose `.skip()` and `.limit()` for the query. Also updated frontend calls in `History.jsx` and `Dashboard.jsx`.
- **Why:** Bounding the result set is a fundamental scalability requirement to prevent massive DB scans and large JSON payloads.
- **Verification:** Call `/api/workouts?page=2&limit=5` and confirm the `pagination` object in the response.

### 2. Caching Layer for AI Generation
- **Gap:** Each request to `/api/generate` resulted in a paid, high-latency call to the Gemini API, even for identical prompt parameters.
- **Change:** Implemented an in-memory LRU cache in `server/utils/generationCache.js` using a custom Map with TTL and max size limits. The cache key normalizes the goal, duration, and equipment arrays. `server/routes/generate.js` now checks this cache before calling Gemini.
- **Why:** Avoids external dependency on Redis while effectively handling the most likely cache hits at this project scale.
- **Verification:** Generate a workout with the same parameters twice. The second response will be instantaneous and include a `cached: true` flag in the payload.

### 3. Centralized Error Handling & Logging
- **Gap:** Error handling was duplicated across routes using `console.error` and `res.status(500)`, leaking internal errors to clients and making debugging hard.
- **Change:** Added `pino` and `pino-pretty` for logging. Created `server/utils/logger.js` and `server/middleware/errorHandler.js`, routing all `next(error)` calls through a central middleware that sanitizes output in production.
- **Why:** Centralization makes the API robust, logs easily searchable in production, and abstracts try/catch noise out of routes.
- **Verification:** Intentionally throw an error in a route (e.g. `auth.js`) and observe the pretty-printed Pino log in the terminal, while the client receives a generic sanitized error message.

### 4. Test Suite
- **Gap:** Zero test coverage meant "it works" couldn't be guaranteed across refactors or deployments.
- **Change:** Added `jest`, `supertest`, and `mongodb-memory-server`. Created `server/tests/setup.js` for an in-memory test database, and wrote `auth.test.js` and `workouts.test.js` to cover auth flows, CRUD, ownership scoping, and pagination.
- **Why:** `mongodb-memory-server` provides realistic tests without hitting or polluting the production Atlas cluster.
- **Verification:** Run `npm run test` from the `server/` directory and see the auth + ownership suite pass.

### 5. API Documentation
- **Gap:** New developers or frontend engineers had to read every route file to understand the API surface.
- **Change:** Wrote an OpenAPI 3.0 specification (`server/docs/openapi.yaml`) and exposed it via `swagger-ui-express` at `/api-docs`.
- **Why:** An interactive Swagger UI is the industry standard for documenting and testing APIs visually.
- **Verification:** Start the server (`npm run dev` or `node server.js`) and visit `http://localhost:5000/api-docs` in the browser.

### 6. Mongoose Schema Update
- **Gap:** The `exercises` field in the `Workout` model used Mongoose's `Mixed` type, providing zero structure or validation for the Gemini output.
- **Change:** Replaced `Mixed` with an explicit array of `exerciseSchema` (containing `name`, `sets`, `reps`, `rest`, and `notes`) in `server/models/Workout.js`.
- **Why:** Ensures strict schema validation so any drift in the Gemini output structure is caught by the database before being saved.
- **Verification:** Generate and save a new workout, and observe that it saves correctly without validation errors. (I mapped the schema directly to the generated `properties` array required by Gemini).

---

## Before / After Summary

| Feature | Before | After |
| :--- | :--- | :--- |
| **Workouts Listing** | Unbounded list; O(N) payload size | Paginated response via `.skip()/.limit()` |
| **AI Generation** | Expensive, high latency on every call | Instant, free via in-memory Map cache |
| **Error Handling** | Duplicated `res.status(500)` calls | Centralized Pino logger & error middleware |
| **Testing** | 0 tests | 9 integration tests with `mongodb-memory-server` |
| **API Docs** | None | Interactive Swagger UI at `/api-docs` |
| **Data Integrity** | `Mixed` (any JSON allowed) | Strict `exerciseSchema` validation |

## How to run this project's tests and view API docs

**Tests**
1. `cd server`
2. `npm install`
3. `npm run test`

**API Docs**
1. `cd server`
2. `node server.js`
3. Open `http://localhost:5000/api-docs` in your browser.
