# NexusAI Hub - Laravel 11 + Inertia.js + React + MySQL

A full-stack, enterprise-grade AI subscription marketplace, in-app ChatGPT/Claude/Gemini workspace, reseller hub, private vault, and administrative control panel migrated to **Laravel 11 + MySQL + Inertia.js + React (TypeScript + Tailwind CSS)** with 100% design fidelity.

---

## 🚀 Quick Start

### 1. Requirements
- **PHP >= 8.2** (Installed)
- **Composer** (Installed)
- **Node.js & npm** (Installed)
- **MySQL / MariaDB** running on port `3306` (Database `nexusai_hub` created and seeded)

### 2. Run with One Command
You can double-click **`run-nexus-laravel.bat`** or run:
```bash
npm run start
```
This runs both `php artisan serve` (`http://127.0.0.1:8000`) and the `vite` development server concurrently.

---

## 👥 Seeded Test Credentials

| Role | Name | Email | Password | Phone |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Shishir Barai | `shishir@nexusai.hub` | `admin123456` | `01711000000` |
| **Reseller Partner** | Rahim Telecom & IT | `rahim@reseller.com` | `reseller123456` | `01822334455` |
| **Customer / Subscriber** | Tanvir Ahmed | `tanvir@gmail.com` | `user123456` | `01933445566` |

> You can also use the **One-Click Account Chooser** inside the Auth modal to switch roles instantly.

---

## 🌐 Routes & Pages

| URL | View / Tab | Description |
| :--- | :--- | :--- |
| `http://127.0.0.1:8000/` | **USA Feature Showcase** | High-converting OmniCraft AI landing page with interactive hero prompt box |
| `http://127.0.0.1:8000/store` | **Pricing & Store** | Digital Store with product cards, category filters, wishlist, and reviews |
| `http://127.0.0.1:8000/workspace` | **In-App AI Workspace** | Full-screen ChatGPT-4o, Claude 3.5 Sonnet, Gemini Flash, & Midjourney agent workspace |
| `http://127.0.0.1:8000/proxy` | **Domain Proxy Portal** | Direct access to official ChatGPT (`chatgpt.com`), Claude (`claude.ai`), and proxy gateways |
| `http://127.0.0.1:8000/dashboard` | **Customer Portal** | Active seat keys, subscription countdowns, credentials, and order history |
| `http://127.0.0.1:8000/reseller` | **Reseller Partner Hub** | Wholesale wallet balance, client sales list, profit calculator, issue client seat keys |
| `http://127.0.0.1:8000/vault` | **Private Vault** | Zero-knowledge secure file repository & AI document context injection |
| `http://127.0.0.1:8000/admin` | **Super Admin Dashboard** | 10 sub-sections: Analytics, Branding CMS, Plans CRUD, Orders, Resellers, Gateways |
| `http://127.0.0.1:8000/guides` | **SOP & Business Guide** | Bangladesh bKash/Nagad e-commerce operational manual & credit calculator |

---

## ⚡ API Endpoints

- `POST /api/ai/chat`: Google Gemini AI engine (`gemini-1.5-flash` or `gemini-3.8-flash`) with multi-persona prompting and private document context injection.
- `POST /api/payments/verify`: Real-time transaction ID (TrxID) verification for bKash, Nagad, Rocket, Upay with automated database order recording and seat key activation.
- `POST /api/settings`: Super Admin live branding & feature toggles.
- `POST /api/plans`: Create, update, or delete subscription plans.
- `POST /api/orders/{id}/status`: Approve or reject payment orders.
- `POST /api/reseller/sale`: Issue client seat key and deduct wholesale cost from wallet.
- `POST /api/vault/upload`: Save document to database.
- `POST /api/auth/switch-user`: Instant session switching for demo and role testing.

---

## 🗄️ MySQL Database Structure

- `users`: Roles (`super_admin`, `reseller`, `user`), wallet balances, tokens, active seat keys.
- `subscription_plans`: Category, pricing (BDT & USD), features JSON, stock, direct domain URLs.
- `payment_orders`: Orders, TrxIDs, methods (bKash, Nagad, Rocket, Upay), status, seat keys.
- `reseller_client_sales`: Reseller wholesale transactions, client details, duration, profit calculations.
- `chat_messages`: Multi-model chat conversation history.
- `user_documents`: Zero-knowledge vault documents for AI context injection.
- `system_settings`: Brand prefix/suffix, announcements, merchant numbers, currency, exchange rate.
- `customer_reviews`: Verified reviews and ratings.
- `faq_items`: Bengali FAQ items.
- `wishlists`: User favorite plans.
