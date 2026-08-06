# StakePro API Reference

This project is a route-based PHP API. The public entry point is:

- /index.php?route=...
- or, if Apache rewrite is active, /route-name

Base URL examples:

- https://stakepro.org/index.php?route=login
- https://stakepro.org/index.php?route=admin/login

Authentication:

- Most endpoints require a Bearer token in the Authorization header.
- Example:

  Authorization: Bearer YOUR_ACCESS_TOKEN

Response format:

- JSON only
- Success responses return data objects or arrays
- Errors return a JSON object with an error field and an HTTP status code

Example error:

```json
{
  "error": "Invalid credentials"
}
```

---

## 1) Auth APIs

### 1.1 Login

Route:

- GET/POST: /index.php?route=login

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Success response: 200

```json
{
  "access_token": "eyJ...",
  "user": {
    "id": 12,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "role": "user",
    "image": "",
    "image_url": null,
    "referral_code": "ABC123",
    "referred_by": null,
    "state": 0,
    "created_at": "2026-08-02 12:00:00"
  }
}
```

Error response: 400 or 401

```json
{
  "error": "Email and password required"
}
```

---

### 1.2 Register

Route:

- POST: /index.php?route=register

Request body:

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "Password123!",
  "ref": "ABC123"
}
```

Success response: 200

```json
{
  "message": "Registration successful"
}
```

Error response:

```json
{
  "error": "Email already registered"
}
```

---

### 1.3 Get current user profile

Route:

- GET: /index.php?route=me

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Success response: 200

```json
{
  "user": {
    "id": 12,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "image": "",
    "image_url": null,
    "balance": "1250.00",
    "referral_code": "ABC123",
    "referred_by": null,
    "state": 0
  },
  "stats": {
    "active_staking": 500,
    "total_profits": 18.75
  }
}
```

---

### 1.4 Refresh token

Route:

- POST: /index.php?route=refresh

Request body:

```json
{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

Success response: 200

```json
{
  "access_token": "NEW_JWT",
  "user": {
    "id": 12,
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### 1.5 Logout

Route:

- POST: /index.php?route=logout

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Success response: 200

```json
{
  "message": "Logged out"
}
```

---

### 1.6 Update profile

Route:

- POST: /index.php?route=update-profile

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request payload:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "new@example.com"
}
```

Success response: 200

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 12,
    "email": "new@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

### 1.7 Change password

Route:

- POST: /index.php?route=change-password

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass123!",
  "confirm_password": "NewPass123!"
}
```

Success response: 200

```json
{
  "message": "Password changed successfully"
}
```

---

## 2) Balance API

This is the single balance model used by the staking app. The app keeps one balance table and does not use a separate staking balance table in active logic.

### 2.1 Get current balance

Route:

- GET: /index.php?route=balance

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Success response: 200

```json
{
  "balance": 1250.25,
  "user_id": 12
}
```

---

### 2.2 Add money to balance

Route:

- POST: /index.php?route=balance

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "amount": 200
}
```

Success response: 201

```json
{
  "message": "Balance updated",
  "balance": 1450.25,
  "previous_balance": 1250.25,
  "amount_added": 200
}
```

---

### 2.3 Remove money from balance

Route:

- PUT: /index.php?route=balance

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "amount": 150
}
```

Success response: 200

```json
{
  "message": "Balance updated",
  "balance": 1300.25,
  "previous_balance": 1450.25,
  "amount_removed": 150
}
```

Error response:

```json
{
  "error": "Insufficient balance",
  "balance": 1300.25
}
```

---

## 3) Staking APIs

### 3.1 Create staking

Route:

- POST: /index.php?route=usdt-staking

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "amount": 500
}
```

Success response: 200

```json
{
  "message": "USDT Staking created successfully",
  "staking": {
    "id": 42,
    "amount": 500,
    "max_return": 1000,
    "profit_earned": 0,
    "total_earned": 0,
    "state": "active",
    "created_at": "2026-08-02 12:00:00",
    "next_profit_at": "2026-08-03 12:00:00"
  }
}
```

Error response:

```json
{
  "error": "Insufficient staking balance"
}
```

---

### 3.2 List user staking history

Route:

- GET: /index.php?route=usdt-staking

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Success response: 200

```json
{
  "stakings": [
    {
      "id": 42,
      "amount": 500,
      "profit_percentage": 0.0018,
      "max_return": 1000,
      "total_earned": 15.5,
      "profit_earned": 15.5,
      "completion_percentage": 1.55,
      "state": "active",
      "created_at": "2026-08-02 12:00:00",
      "completed_at": null
    }
  ],
  "total_active": 500,
  "current_balance": 750.5
}
```

---

## 4) Withdrawal Request APIs

### 4.1 Create withdrawal request

Route:

- POST: /index.php?route=usdt-staking/withdraw-request

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "amount": 100,
  "wallet_address": "TQGx4b6dM5w8iK9yP2nLrF1sQ3tV9mC6"
}
```

Success response: 201

```json
{
  "message": "Withdrawal request created and balance deducted",
  "withdraw_id": 78
}
```

Error response:

```json
{
  "error": "Insufficient balance for withdrawal",
  "available": 0,
  "locked_in_staking": 500,
  "total_balance": 800
}
```

---

### 4.2 List user withdraw requests

Route:

- GET: /index.php?route=usdt-staking/withdraw-requests

Headers:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Success response: 200

```json
{
  "withdraw_requests": [
    {
      "id": 78,
      "amount": 100,
      "wallet_address": "TQGx...mC6",
      "wallet_address_full": "TQGx4b6dM5w8iK9yP2nLrF1sQ3tV9mC6",
      "status": "pending",
      "reason": null,
      "created_at": "2026-08-02 12:00:00",
      "approved_at": null,
      "completed_at": null,
      "rejected_at": null
    }
  ],
  "total": 1
}
```

---

## 6) General error format

All API errors follow this style:

```json
{
  "error": "Some error message"
}
```

Some endpoints also include extra fields:

```json
{
  "error": "missing_param",
  "param": "amount"
}
```

or

```json
{
  "error": "Insufficient balance",
  "balance": 1200.5
}
```

---

## 7) Current active production routes

The working app currently exposes these active routes:

- login
- register
- refresh
- logout
- me
- update-profile
- change-password
- balance
- usdt-staking
- usdt-staking/withdraw-request
- usdt-staking/withdraw-requests
- usdt-staking/transactions

This file reflects the current staking-only implementation and therefore intentionally excludes the old investment/product APIs.
