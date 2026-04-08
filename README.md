# StreetConnect Backend

Node.js + Express + MongoDB backend for the StreetConnect hackathon problem statement.

## Features

- Vendor onboarding and vendor discovery with geospatial search
- Order creation and order status updates
- Delivery partner data model and registration endpoint
- Centralized error handling and environment-based config

## Project Structure

```txt
streetconnect-backend/
  config/
    db.js
  controllers/
    deliveryPartnerController.js
    orderController.js
    vendorController.js
  middleware/
    errorMiddleware.js
  models/
    DeliveryPartner.js
    Order.js
    Vendor.js
  routes/
    deliveryPartnerRoutes.js
    orderRoutes.js
    vendorRoutes.js
  app.js
  server.js
  .env.example
  package.json
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from template:

   ```bash
   cp .env.example .env
   ```

3. Update `MONGODB_URI` in `.env`.

4. Run development server:

   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/vendors/register`
- `GET /api/vendors/nearby?lat=<latitude>&lng=<longitude>`
- `POST /api/orders/create`
- `PATCH /api/orders/:id/status`
- `POST /api/delivery-partners/register`

## Example Payloads

### Register Vendor

`POST /api/vendors/register`

```json
{
  "name": "Ravi Chaat Corner",
  "stallType": "chaat",
  "menu": [
    {
      "nameEnglish": "Pani Puri",
      "nameRegional": "Pani Puri",
      "descriptionEnglish": "Crispy puris with spicy water",
      "descriptionRegional": "Crispy puri with spiced water",
      "price": 40,
      "isAvailable": true
    }
  ],
  "latitude": 28.6139,
  "longitude": 77.209,
  "isOnline": true
}
```

### Create Order

`POST /api/orders/create`

```json
{
  "customer": {
    "name": "Aman",
    "phone": "9999999999",
    "address": "Sector 18, Noida"
  },
  "vendorId": "663f2adf1a6c8f4fdcb7cb16",
  "items": [
    {
      "itemName": "Pani Puri",
      "quantity": 2,
      "price": 40
    }
  ],
  "totalPrice": 80
}
```

### Update Order Status

`PATCH /api/orders/:id/status`

```json
{
  "status": "preparing"
}
```
"# StreetConnect" 
