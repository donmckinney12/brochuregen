# Stripe Integration Walkthrough

## 1. Environment Setup
To make the "Upgrade to Pro" button work, you need to configure your Stripe keys.

1.  Copy `.env.example` to `.env` (if you haven't already).
2.  Add your Stripe keys to `.env`:
    ```env
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    STRIPE_PRICE_ID=price_...
    ```
    > **Note:** Create a product in your Stripe Dashboard (e.g., "Pro Subscription") and copy the **API ID** for the price (starts with `price_`).

## 2. Verification Steps
1.  **Start the Backend**: Ensure `backend/app.py` is running (`uvicorn app:app --reload`).
2.  **Start the Frontend**: Ensure `frontend` is running (`npm run dev`).
3.  **Test the Flow**:
    -   Log in to the app.
    -   Click "Upgrade to Pro" (or trigger "Limit Reached").
    -   You should be redirected to Stripe Checkout.
    -   Complete the payment with a test card (e.g., `4242 4242 4242 4242`).
    -   You will be redirected back to the dashboard.
    
## 3. Webhook Verification (Crucial for Credits)
Stripe needs to reach your localhost to tell it "Payment Success". Since localhost is not public, we use the Stripe CLI.

1.  **Download Stripe CLI**: [https://docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli)
2.  **Login**: Run `stripe login` in your terminal.
3.  **Start Listener**:
    ```bash
    stripe listen --forward-to localhost:8002/api/webhook
    ```
4.  **Get Webhook Secret**:
    -   The command above will print a secret starting with `whsec_...`.
    -   **Copy this secret** and paste it into your `.env` file as `STRIPE_WEBHOOK_SECRET=whsec_...`.
    -   **Restart the backend** one last time.

Now, when you pay, Stripe CLI receives the event -> forwards to your backend -> your backend adds credits!

### Troubleshooting
-   **"Webhook Error: Invalid Signature"**: This means `STRIPE_WEBHOOK_SECRET` in `.env` does not match the one from `stripe listen`.
### Branding & Dark Mode
The Stripe Checkout page is hosted by Stripe. To match your app's look (e.g., enable Dark Mode):
1.  Go to **Stripe Dashboard > Settings > Branding**.
2.  Upload your logo and icon.
3.  Set the **Theme** to **"Dark"** or **"Match browser system"**.
4.  Save changes. The payment page will instantly update detailed in the `walkthrough.md`.

### 4. Authentication (Important)
This project uses **Supabase SSR** (Server-Side Rendering) for authentication.
-   **Why?** Next.js Middleware needs to read cookies to protect the `/dashboard` route.
-   **How it works**:
    -   `utils/supabaseClient.ts` uses `createBrowserClient` to manage cookies.
    -   `app/auth/callback/route.ts` handles the exchange of the login code for a session cookie.
    -   **If login loops:** Ensure your `NEXT_PUBLIC_SUPABASE_` keys are correct and you are using `https` or `localhost`.

### 5. Admin Tools (God Mode)
To grant unlimited credits to any user (like yourself), run this command in the `backend/` terminal:

```bash
# General Usage
python admin_tools.py user@example.com --credits 1000000 --name "Super User"

# Windows
.\venv\Scripts\python.exe admin_tools.py user@example.com --credits 1000000

# Mac/Linux
./venv/bin/python admin_tools.py user@example.com --credits 1000000
```

### 6. User Guide: Generating a Brochure
1.  **Login** to the Dashboard.
2.  **Enter a URL** (e.g., `https://stripe.com`) in the Input box.
3.  Click **Generate**. The AI will scrape the site and write the copy.
4.  **Edit** any text in the Preview mode (Headline, Features, etc.).
5.  Click **Download PDF** (Costs 1 Credit).
6.  The PDF will download automatically.

### 7. Legal & Support Pages
Your app comes pre-built with these standard pages:
-   **Privacy Policy**: `/privacy`
-   **Terms of Service**: `/terms`
-   **Refund Policy**: `/refund-policy`
-   **Contact Page**: `/contact`
-   **About Page**: `/about`

You can edit the content of these pages in `frontend/src/app/[page-name]/page.tsx`.
