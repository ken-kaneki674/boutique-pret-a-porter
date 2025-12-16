# KENOVARDY'Shop - Local Dev

Backend Express + SQLite has been added to this project to provide a small REST API for articles and orders.

Quick start (PowerShell):

1. Install dependencies:

   npm install

2. Start the server:

   npm run start

   Or in dev mode with auto-reload (if you have nodemon):

   npm run dev

3. Open the site in your browser at:

   <http://localhost:3000/>

Notes:

- API endpoints:
  - GET /api/articles
  - GET /api/articles/:id
  - POST /api/articles
  - PUT /api/articles/:id
  - DELETE /api/articles/:id
  - POST /api/orders
  - GET /api/orders

- Frontend scripts have been adapted to call the API where appropriate:
  - `articles.js` fetches `/api/articles` (with a fallback if the API is unavailable)
  - `admin.js` performs create/update/delete on `/api/articles`
  - `panier.js` keeps cart in localStorage and uses the API to submit orders (you can later adapt it to POST /api/orders)

If you want, I can run `npm install` and start the server here, or guide you through running it on your machine.
