# BrochureGen: Project Walkthrough (v5.0)

This document serves as the primary technical and operational guide for the v5.0 "God Tier" platform.

## 1. Core Infrastructure Setup

### Environment Variables
Configure your `.env` files with these essential keys:

**Backend (`backend/.env`):**
```env
OPENAI_API_KEY=sk-...
CLERK_FRONTEND_API=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=sqlite:///./brochuregen.db # Or PostgreSQL URI
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRICE_STARTER_MONTHLY=price_...
PRICE_PRO_MONTHLY=price_...
PRICE_AGENCY_MONTHLY=price_...
```

**Frontend (`frontend/.env`):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 2. Authentication & Multi-Tenancy
This project uses **Clerk** for authentication and team management.
-   **Dashboard Protection**: Handled via Clerk's `<SignedIn>` components and custom `useAuth` guards.
-   **Team Workspaces**: Organizations are enabled. Users can switch between personal and business accounts using the `OrganizationSwitcher` in the Navbar.
-   **SSO Ready**: Enterprise users can enable SAML/SSO via the Clerk Dashboard.

---

## 3. Stripe & Credit Fulfillment
Credits are added automatically upon successful payment.

1.  **Stripe CLI Listener**:
    ```bash
    stripe listen --forward-to localhost:8000/api/v1/payment/webhook
    ```
2.  **Webhook Fulfillment**: The logic in `backend/api/api_v1/endpoints/payment.py` grants:
    -   **Starter**: 10 Credits
    -   **Professional**: 25 Credits
    -   **Agency**: 100 Credits

---

## 4. Platform Features Walkthrough

### 🎨 Theming Engine
Users can switch brochure styles instantly in the dashboard. The system currently supports:
-   **Modern**: Clean, whitespace-heavy design.
-   **Corporate**: Structured, high-trust layout.
-   **Creatives**: Vibrant, grid-based aesthetic.

### 📊 Advanced Analytics
The `/dashboard` features a visual analytics hub (built with Recharts) that tracks:
-   **Brochure Views**: Unique visits per brochure.
-   **QR Scans**: Interaction data from physical copies.
-   **Privacy**: All tracking uses anonymized IP hashing.

### 🧪 Developer Portal
Available at `/developers`, this hub provides:
-   **API Keys**: Generate and manage keys for external integration.
-   **Live Documentation**: Interactive cURL and JS examples.

### 🏢 Enterprise Solutions
The `/enterprise` page captures high-ticket leads and offers bespoke compliance features for global teams.

---

## 5. Operations & Admin Tools

### Granting Manual Credits
If you need to manually top-up a user's account, use the `admin_tools.py` script:
```bash
python admin_tools.py user@example.com --credits 500
```

### Scraping & Generation
The engine uses **Playwright** with a headless-optimized profile to bypass basic scraping blocks and extract high-resolution imagery and copy for the AI models.

---

<p align="center">
  <b>BrochureGen v5.0</b>: The Future of AI Marketing Materials.
</p>
