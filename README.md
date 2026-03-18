# WatchShop Frontend

A **Next.js (App Router)** frontend for an e-commerce watch store. This project includes a public-facing storefront and an admin dashboard for managing products, orders, users, and site settings.

---

## ✅ Key Features

- **Public Shop**: product listing, product detail, cart, checkout, user account, order history.
- **Admin Panel**: manage products, categories, banners, orders, users, posts, settings, and store data.
- **Next.js App Router** (React 19) with optimized routing and layouts.
- **API integration** via Axios to a backend API (configurable via environment variables).
- **Responsive UI** with Tailwind CSS, Framer Motion, and slick/swiper carousels.

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Axios** for API requests
- **Framer Motion** for animations
- **React Slick / Swiper** for carousels
- **FontAwesome** icons

---

## 🚀 Getting Started

### 1) Prerequisites

- Node.js 18+ (recommended)
- npm (bundled with Node.js)

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env.local` file at the project root (this file is typically gitignored) and set the API base URLs:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_IMAGE_URL=http://127.0.0.1:8000/images
```

> The defaults in `src/api/config.js` fall back to `http://127.0.0.1:8000`, but using env vars is recommended for staging/production.

### 4) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5) Build / Start

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
src/
  app/
    (site)/            # Public-facing storefront routes
      layout.js
      page.js
      about/page.js
      products/         # Product listing + detail
      cart/
      checkout/
      contact/
      login/            # Auth routes
      register/
      profile/          # User profile + orders

    (admin)/           # Admin dashboard routes
      admin/            # Admin UI pages (products, orders, users, etc.)

  api/                 # API clients (axios wrappers)
  components/          # Shared UI components
  context/             # React context providers (AuthContext)
  ui/                  # Themes, toggles, layout helpers

postcss.config.mjs     # Tailwind CSS setup
package.json           # Scripts + dependencies
```

---

## 🔌 API Configuration

The frontend expects a REST API that provides endpoints for:

- Products, categories, banners, sales
- Orders, carts, checkout
- Users, authentication
- Posts, topics, contacts, settings

The API base URL is configured in `src/api/config.js` and can be overridden with:

- `NEXT_PUBLIC_API_URL` (API base URL)
- `NEXT_PUBLIC_IMAGE_URL` (images CDN/base path)

---

## 📦 Deployment

This project can be deployed anywhere that supports Node.js. Common choices:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **DigitalOcean App Platform / App Service**
- Custom Docker container

---

## 🧩 Notes / Tips

- The Admin side is under `src/app/(admin)/admin` and uses a separate layout (`layout.js`) so it can have its own sidebar/navigation.
- The public site lives under `src/app/(site)` and includes product browsing, cart, checkout, and profile pages.
- If you add new API endpoints, add/update the corresponding file under `src/api/`.

---

## 🙌 Contribution

Feel free to open issues or pull requests. When contributing:

1. Follow existing folder conventions (`app/(site)` vs `app/(admin)`).
2. Keep API clients in `src/api/`.
3. Keep UI components reusable and stateless when possible.

---

## 📄 License

This repository does not include a license file. Add one (e.g., MIT) if you intend to open source it.

