# 1Fi — Product EMI Platform

> Full-stack e-commerce app where users can browse products across categories (Smartphones, Laptops, Audio, Tablets), pick color/storage variants, choose mutual fund-backed EMI plans, and place orders with a complete checkout flow.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

## Features

- **Product Catalog** — 10 products across 4 categories, each with multiple color + storage variants
- **Image Gallery** — 3 images per color (front/back/side), changes when you switch colors
- **Color & Storage Selectors** — color circles change images, storage rectangles change price only
- **EMI Plans** — 7 plans per variant (0% up to 24mo, 10.5% for 36-60mo), all with ₹7,500 cashback
- **End-to-End Checkout** — select plan → review order → enter details → place order → confirmation page with EMI schedule
- **Order History** — view all past orders at `/orders`
- **Dynamic Categories** — all categories come from the DB via API, no hardcoding
- **Responsive** — works on mobile, tablet, and desktop

## Tech Stack

| Layer | Tech | Reason |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 | Fast builds, component architecture, utility CSS |
| Backend | Node.js, Express | Simple REST API |
| Database | PostgreSQL, Prisma ORM | Relational data (products → variants → plans → orders), type-safe queries |
| Images | DummyJSON CDN | Reliable product images |

## Database Schema

```
Product (1) ──→ ProductVariant (N) ──→ EMIPlan (N)
                                   
Order (standalone, stores snapshot of product + emi details)
```

### Models

**Product** — name, slug, brand, category, description

**ProductVariant** — color, colorHex, storage, price, mrp, imageUrl, images[] (gallery), inStock

**EMIPlan** — tenure, monthlyAmount, interestRate, totalAmount, cashback, isNoCost

**Order** — orderNumber, customer info (name/email/phone/address), product snapshot, emi details, status

Seed data: 10 products × 36 variants × 252 EMI plans

## Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL running locally
- npm

### 1. Clone
```bash
git clone https://github.com/FearSmoker/1Fi.git
cd 1Fi
```

### 2. Backend
```bash
cd server
npm install

# create .env file with your postgres connection string
echo 'DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/onefi_db"' > .env
echo 'PORT=5001' >> .env

# create the database first (if it doesn't exist)
createdb onefi_db

# run migrations
npx prisma migrate dev

# seed products
npx prisma db seed

# start
npm run dev
```
Backend runs on `http://localhost:5001`

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All products (optional `?category=Smartphones` filter) |
| GET | `/api/products/:slug` | Single product with all variants + EMI plans |
| GET | `/api/categories` | All categories with slugs (from DB) |
| POST | `/api/orders` | Create order (takes variantId, emiPlanId, customer info) |
| GET | `/api/orders` | All orders (optional `?email=` filter) |
| GET | `/api/orders/:orderNumber` | Single order by order number |
| GET | `/api/health` | Health check |

### GET /api/products
```json
[
  {
    "id": 1,
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "category": "Smartphones",
    "variantCount": 4,
    "defaultVariant": {
      "id": 67,
      "price": 127400,
      "mrp": 134900,
      "imageUrl": "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp",
      "color": "Silver",
      "storage": "256GB",
      "startingEMI": { "monthlyAmount": 42467, "tenure": 3 }
    }
  }
]
```

### GET /api/products/:slug
```json
{
  "id": 1,
  "name": "iPhone 17 Pro",
  "slug": "iphone-17-pro",
  "brand": "Apple",
  "category": "Smartphones",
  "description": "A19 Pro chip, 48MP Fusion camera...",
  "variants": [
    {
      "id": 67,
      "name": "iPhone 17 Pro - Silver, 256GB",
      "storage": "256GB",
      "color": "Silver",
      "colorHex": "#C0C0C0",
      "price": 127400,
      "mrp": 134900,
      "imageUrl": "https://cdn.dummyjson.com/...",
      "images": ["1.webp", "2.webp", "3.webp"],
      "slug": "iphone-17-pro-silver-256gb",
      "inStock": true,
      "emiPlans": [
        {
          "id": 463,
          "tenure": 3,
          "monthlyAmount": 42467,
          "interestRate": 0,
          "totalAmount": 127401,
          "cashback": 7500,
          "isNoCost": true
        }
      ]
    }
  ]
}
```

### GET /api/categories
```json
[
  { "name": "Audio", "slug": "audio", "productCount": 1 },
  { "name": "Laptops", "slug": "laptops", "productCount": 2 },
  { "name": "Smartphones", "slug": "smartphones", "productCount": 6 },
  { "name": "Tablets", "slug": "tablets", "productCount": 1 }
]
```

### POST /api/orders
```bash
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": 67,
    "emiPlanId": 463,
    "customerName": "Aryan Saxena",
    "customerEmail": "aryan@example.com",
    "customerPhone": "9876543210",
    "shippingAddress": "123 Main St, New Delhi 110001"
  }'
```
Response:
```json
{
  "id": 1,
  "orderNumber": "1FI-A3B2C1",
  "status": "confirmed",
  "customerName": "Aryan Saxena",
  "productName": "Apple iPhone 17 Pro",
  "variantColor": "Silver",
  "variantStorage": "256GB",
  "emiTenure": 3,
  "emiMonthlyAmount": 42467,
  "emiIsNoCost": true
}
```

## Project Structure
```
1Fi/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, EMIPlanList,
│   │   │                       # ProceedModal, LoadingSkeleton
│   │   ├── pages/              # HomePage, ProductPage, CategoryPage,
│   │   │                       # OrderConfirmationPage, MyOrdersPage, NotFoundPage
│   │   ├── services/api.js     # all API calls
│   │   ├── utils/              # formatCurrency helper
│   │   ├── App.jsx             # routes
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express backend
│   ├── prisma/
│   │   ├── schema.prisma       # Product, ProductVariant, EMIPlan, Order
│   │   ├── seed.js             # 10 products with variants + images
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/        # productController, orderController
│   │   ├── routes/             # productRoutes, orderRoutes
│   │   ├── middleware/         # errorHandler
│   │   └── index.js
│   └── .env                    # DATABASE_URL, PORT (not committed)
├── .gitignore
└── README.md
```

## User Flow

1. **Browse** — Home page shows all products, navbar has category links
2. **Filter** — Click a category to see only those products
3. **View** — Click a product card to see its detail page
4. **Customize** — Pick a color (images change) and storage (price changes)
5. **Choose EMI** — Select from 7 EMI plans (0% or 10.5% interest)
6. **Checkout** — Click "Buy on X months EMI" → review summary → enter shipping details
7. **Confirm** — Order is created, redirected to confirmation page with full EMI schedule
8. **History** — View all orders at `/orders`

## Author
Built by Aryan Saxena for the 1Fi SDE Assignment
