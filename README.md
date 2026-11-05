# FundMe!

🏆 **1st place at the Ethereum Argentina Hackathon 2026** (Adoption, Impact & DAOs track)

A transparent crowdfunding **Mini App for Lemon**, the Argentine crypto wallet. Anyone can start a campaign for a cause, and anyone with Lemon can fund it in a couple of taps, paying in USDC from their wallet. The idea behind it: **money donated to a campaign shouldn't sit idle.** While a campaign is active, its funds go to a vault that earns DeFi yield, and they are released to the beneficiary when the goal is reached.

Built during the hackathon by a team of three.

<!-- Screenshots: add images to docs/ and uncomment
![Campaign list](docs/projects.png) ![Campaign detail](docs/project.png) ![Funding dialog](docs/fund.png)
-->

## The problem

Online fundraising in Argentina usually runs through bank transfers or platforms that hold the money until the campaign ends. Donors can't see where their money is, organizers pay high fees, and funds lose value to inflation while they wait.

Many Argentines already hold crypto in their **Lemon** wallet. A Mini App inside Lemon removes most of the friction: no sign-up, no card, no bank. The user's wallet is their identity and their payment method.

## What it does

- **Browse campaigns:** a list of active campaigns with title, description, goal, amount raised and progress.
- **Create a campaign:** title, description, goal (in USDC), deadline and the vault address where the funds go.
- **Fund a campaign:** sign in with the Lemon wallet (Sign-In with Ethereum) and deposit USDC through the Lemon SDK. The donation is recorded and linked to the campaign.
- **Track your activity:** "My campaigns" and "My donations" pages, with every donation's status.
- **Share:** a share button and a **QR scanner** to open a campaign from a poster or a phone.
- **Moderation:** the API supports reviewing campaigns (approve / reject) before they can receive funds.

### Domain model

The backend models the full lifecycle of a campaign and its donations:

```
Project:   PENDING_REVIEW ─► APPROVED ─► ACTIVE ─► SUCCESSFUL
                │                          └─────► FAILED
                └─► REJECTED

Donation:  PENDING ─► COMPLETED ─► REFUNDED
               └────► FAILED
```

Each state transition is a method on the domain entity (`approve()`, `activate()`, `complete()`...) that validates the current state, so an invalid transition (for example, activating a rejected campaign) fails in the domain layer, not in the UI.

## Architecture

- **Next.js 16 (App Router)** for both the UI and the API: the frontend only talks to `/api/**` routes through typed API clients (`lib/services/api`).
- **Layered backend:**
  - `lib/domain`: entities with business rules (`Project`, `Campaign`, `Donation`, `User`, `Beneficiary`) and custom errors;
  - `lib/infrastructure`: Sequelize models and PostgreSQL repositories behind repository interfaces;
  - `app/api`: route handlers that validate input and call the repositories.
- **PostgreSQL** (hosted on Neon) through **Sequelize**.
- **Lemon Mini App SDK:** authentication (SIWE) and USDC deposits. To develop and demo outside the Lemon app, we wrote `lib/lemon-sdk-mock.ts`, a mock with **the same interface as the real SDK**. Swapping it for the real one is a one-line import change.
- **UI:** React 19, Tailwind CSS, shadcn/ui (Radix), mobile-first, with Lemon's color palette.

```
app/
├── api/              # REST endpoints: projects, campaigns, donations, users, beneficiaries
├── projects/         # list, detail, new, mine
├── donations/me/     # my donations
└── qr/               # QR scanner
components/           # fund dialog, project card, create form, share button, tab bar
lib/
├── domain/           # entities + business rules
├── infrastructure/   # Sequelize models, PostgreSQL repositories
├── services/api/     # typed API clients used by the frontend
└── lemon-sdk-mock.ts # Lemon SDK mock with the real interface
scripts/              # DB sync and connection test
```

The full API is documented in [`app/api/README.md`](app/api/README.md).

## Running it locally

Requires Node.js 18+ and a PostgreSQL database (local or [Neon](https://neon.tech)).

```bash
npm install
echo "DATABASE_URL=postgres://user:password@host:5432/fundme" > .env.local
npm run db:test   # check the connection
npm run db:sync   # create the tables
npm run dev       # http://localhost:3000
```

Outside the Lemon app, authentication and deposits go through the SDK mock, so the whole flow can be tried in a regular browser.

## Hackathon scope and next steps

This is a hackathon build. What the repo covers and what it doesn't:

- ✅ Campaigns, donations, users and beneficiaries, with their full lifecycle and API
- ✅ Funding flow with Lemon authentication and USDC deposits (against the SDK mock)
- ✅ Mobile UI adapted to Lemon's Mini App guidelines
- ⏳ **DeFi yield:** each campaign stores the address of its vault, and the yield strategy was part of our design and pitch. The vault contracts and the yield integration are not in this repo yet.
- ⏳ **Real Lemon SDK:** replace the mock and test inside the Lemon app.
- ⏳ Automatic payout to the beneficiary when the goal is reached, and refunds when a campaign fails.

## Team

Ramiro Cardelli · Santiago Fabián Sosa · Facundo Inza
