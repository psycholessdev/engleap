<div align="center">
  <img src="./docs/engleap-logo.png" alt="hikka_mods" width="600">
</div>

<h1 align="center">🇺🇸 English Learning app</h1>

<p align="center">
  EngLeap is a powerful English learning app that helps you master the language naturally and effectively,
without relying on your native tongue.
</p>

---

Start thinking in English — not just translating it.
Make your next leap with EngLeap.

It’s built on the principles of English-only immersion, space repetition,
and contextual learning — to rewire your brain to think in English.

➡️ [Open website](https://engleap.psycholess.com/)

## 🚀 What is EngLeap?
EngLeap helps you learn and think in English directly
by replacing translations with English definitions and real-world context.

🧠 You’ll learn using:

- English-only **definitions** instead of translations
- A **Spaced Repetition System SM-2 (SRS)** that optimizes memory retention
- A **Recursive Vocabulary Builder** that grows your knowledge organically

This method trains your brain to understand English
**without using your native language as a crutch**, leading to faster fluency and better comprehension.

### 💡 How It Works

1. **Create a Deck**
Organize your vocabulary by topics, movies, shows, or personal goals.

2. **Create Cards with Real Context**
Add sentences you encounter in daily life — from YouTube, TikTok, movies, books, or conversations.
Select the word(s) you don’t know — and the app will automatically:
   - Extract the word
   - Generate simplified **English definitions**
   - Include part of speech, syllables, labels (e.g., Informal, British), audio pronunciation, and synonyms

3. **Review Daily with SRS**
EngLeap schedules your reviews using spaced repetition to move vocabulary into your long-term memory.
The more you review, the deeper your immersion.

4. **Learn from Others**
Browse or study decks created by other users for inspiration or specific themes
   (e.g., Business English, Movies, Slang).

### ✨ Features

- 🧩 **Target-Word Highlighting** — Learn new vocabulary in real context
- 📖 **English Definitions Only** — No translations; train your brain to think in English
- 🔁 **Spaced Repetition Engine** — Smart scheduling to boost long-term retention
- 🔊 **Pronunciation Audio** — Hear each word clearly with correct syllable breakdown
- 🌐 **Community Decks** — Learn collaboratively or share your own
- 🧠 **Recursive Growth** — New cards help reinforce and expand older vocabulary

## ✨ App architecture
### 🧠 Backend Architecture

**Stack**: [Node.js](https://nodejs.org/en), [TypeScript](https://www.typescriptlang.org/), [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/) (with [PostgreSQL](https://www.postgresql.org/)), [Zod](https://zod.dev/), [sequelize-typescript](https://github.com/sequelize/sequelize-typescript), [XSS sanitizer](https://www.npmjs.com/package/xss), [Docker](https://www.docker.com/)

Layers
- **Controllers** — Handle HTTP requests, perform authorization checks, and delegate logic to services. Thin and declarative.
- **Services** — Contain business logic. Designed to be pure and testable.
- **Models** — `Sequelize` ORM models. Define relations and encapsulate the data layer via `sequelize-typescript` to make it readable and easy to maintain.
- **Routes** — Bind routes to controllers. All requests are validated before they hit controllers.
- **Schemas** — Built with `Zod`. Used for validating and sanitizing request bodies, query params, and URL params.
- **Middlewares** — Includes custom middleware for auth checks, schema validation, and error handling.
- **Utils** — Utility functions and helpers that stay decoupled from the rest of the app (e.g., error formatting, normalization).
- **Dictionary Integration** — Abstracts external dictionary APIs. Definitions are fetched and parsed into a shared format via an adapter-registry pattern. Easy to plug in additional sources like Oxford.

🧾 Validation & Safety
- All user inputs are validated and sanitized using `Zod` and XSS protection.
- Middleware-level validation ensures type-safe and clean data at the controller level.
- Sequelize transactions ensure DB consistency in multi-step operations like deck duplication or bulk inserts.

### 🖼️ Frontend Architecture

**Stack**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Axios](https://axios-http.com/), [React Query](https://tanstack.com/query/latest), [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

Layers
- **Components** — Reusable components are designed with Tailwind and shadcn, using motion and transitions for responsiveness.
- **State Management** — Powered by React Query, making data fetching and caching predictable and scalable.
- **Forms & Validation** — Built using `react-hook-form` with `zodResolver` for schema-based validation.
- **Server Communication** — Uses Axios for API requests, with a centralized configuration for handling tokens and errors.

### ⚙️ Key Architectural Practices

- Separation of concerns between HTTP, business logic, and DB layers
- Explicit schema validation with `zod`
- Transactional operations for DB integrity
- Composable services and pure functions
- Expandable dictionary API layer (plug new sources easily)
- Modular file structure that scales well in teams and monorepos
- Clean error handling and response formatting

## License

This project is licensed under the [MIT License](./LICENSE.md).  
You're free to use, modify, and distribute the code, but **please include attribution** by keeping the original license text and a link to this repository.
