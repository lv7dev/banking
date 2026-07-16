# Horizon Banking

Horizon is a modern banking dashboard built with Next.js. It lets users create an account, connect bank accounts through Plaid, review balances and transaction history, and transfer funds through Dwolla-backed funding sources.

## Features

- User authentication with Appwrite email/password sessions.
- Secure sign-up flow that creates an Appwrite user profile and a Dwolla customer.
- Plaid Link integration for connecting US sandbox bank accounts.
- Automatic public-token exchange, Plaid access-token storage, Dwolla processor-token creation, and Dwolla funding-source setup.
- Protected dashboard routes that redirect unauthenticated users to sign in.
- Multi-bank overview with total connected banks and total current balance.
- Animated balance totals and a doughnut chart for account distribution.
- Bank cards with account names, masked account numbers, balances, and shareable account identifiers.
- Recent transactions view with account tabs, status badges, categories, and pagination.
- Full transaction-history page with selected-account details, current balance, and paginated transaction table.
- Transfer funds workflow with source-bank selection, recipient email, recipient shareable ID, transfer note, and amount.
- Dwolla transfer creation plus Appwrite transaction records for sent and received transfers.
- Top spending category summary in the account sidebar.
- Responsive desktop sidebar and mobile navigation.
- Form validation with React Hook Form and Zod.
- Reusable UI primitives built with Base UI, Tailwind CSS, and class-variance-authority.
- Sentry instrumentation for client, server, edge, request-error, and navigation monitoring.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Appwrite for authentication, sessions, users, banks, and transfer records
- Plaid for bank linking, account data, institutions, transactions, and processor tokens
- Dwolla for customers, funding sources, on-demand authorizations, and transfers
- Chart.js and react-chartjs-2 for account charts
- React Hook Form and Zod for typed form validation
- Sentry for observability

## App Routes

- `/sign-in` - sign in to an existing account.
- `/sign-up` - create an account, create the matching Dwolla customer, then connect a bank.
- `/` - authenticated dashboard with balances, account tabs, recent transactions, cards, and categories.
- `/my-banks` - view all connected bank cards.
- `/transaction-history` - inspect paginated transaction history for the selected bank account.
- `/payment-transfer` - send funds from a connected source bank to a recipient shareable ID.

## Project Structure

```text
app/                    Next.js route groups and pages
components/             Dashboard, auth, banking, transfer, and UI components
constants/              Navigation links, category styles, and sandbox constants
lib/actions/            Server actions for users, banks, transactions, and Dwolla
lib/appwrite.ts         Appwrite admin and session clients
lib/plaid.ts            Plaid API client
lib/utils.ts            Formatting, validation, query, category, and ID helpers
types/                  Shared TypeScript declarations
public/icons/           Brand, card, navigation, and transaction assets
```

## Environment Variables

Create a `.env` file with the values required by Appwrite, Plaid, and Dwolla:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_APPWRITE_KEY=
APPWRITE_DATABASE_ID=
APPWRITE_USER_COLLECTION_ID=
APPWRITE_BANK_COLLECTION_ID=
APPWRITE_TRANSACTION_COLLECTION_ID=

PLAID_CLIENT_ID=
PLAID_SECRET=

DWOLLA_ENV=sandbox
DWOLLA_KEY=
DWOLLA_SECRET=
```

The Plaid client is configured for the sandbox environment, and Dwolla expects `DWOLLA_ENV` to be either `sandbox` or `production`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # Start the Next.js development server
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Notes

- Appwrite collections must match the user, bank, and transaction fields used in `types/index.d.ts`.
- Plaid Link uses the `auth` and `transactions` products for US accounts.
- Transfers are recorded in Appwrite only after Dwolla returns a transfer location.
- Sentry is already wired through `next.config.ts`, `instrumentation.ts`, `instrumentation-client.ts`, and the server/edge config files.
