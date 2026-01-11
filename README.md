# Entertainment CRM

A comprehensive CRM system designed for UK entertainment companies managing performers booking gigs. Built with Next.js, PostgreSQL, Prisma, and Tailwind CSS.

## Features

- 🎭 **Enquiry Pipeline** - Manage leads from initial contact to booking
- 💷 **Quote Management** - Quick quote generation with line items
- 📅 **Booking System** - Track gigs, events, and performances
- 📝 **Contract Management** - E-signature support for contracts
- 💰 **Invoicing & Payments** - Complete financial workflow
- 📧 **Email Integration** - Gmail sync and email templates
- ⚡ **Automation Engine** - Rules-based automation for workflows
- 📊 **Dashboard & Analytics** - Real-time insights and reporting
- 📱 **Mobile-First Design** - Optimized for mobile workflows
- 🔒 **GDPR Compliant** - Full audit logging and data protection

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: NextAuth.js (to be implemented)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd entertainment-crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/entertainment_crm"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
entertainment-crm/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   ├── page.tsx          # Dashboard
│   ├── enquiries/        # Enquiries page
│   ├── bookings/         # Bookings page
│   ├── calendar/         # Calendar page
│   └── invoices/         # Invoices page
├── prisma/
│   └── schema.prisma     # Database schema
├── docs/                 # Documentation
│   ├── AUTOMATION_ENGINE.md
│   ├── PERMISSIONS_ROLES.md
│   └── MVP_ROADMAP.md
└── README.md
```

## Key Concepts

### Terminology (Entertainer-First)

- **Enquiry** - Initial contact/lead from a client
- **Quote** - Price proposal sent to client
- **Booking** - Confirmed gig/performance
- **Contract** - Legal agreement with e-signature
- **Invoice** - Bill sent to client
- **Gig** - Performance/event

### Workflow

1. **Enquiry** → Client contacts about a gig
2. **Quote** → Send pricing proposal
3. **Booking** → Client accepts, booking confirmed
4. **Contract** → E-signature required
5. **Invoice** → Bill sent (deposit first, then balance)
6. **Payment** → Track received payments
7. **Reminder** → Automated follow-ups

## API Routes

- `GET /api/enquiries` - List enquiries
- `POST /api/enquiries` - Create enquiry
- `GET /api/enquiries/[id]` - Get enquiry
- `PATCH /api/enquiries/[id]` - Update enquiry
- `GET /api/companies` - List companies
- `POST /api/companies` - Create company
- `GET /api/quotes` - List quotes
- `POST /api/quotes` - Create quote
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/calendar` - Get calendar events
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/contracts` - List contracts
- `POST /api/contracts` - Create contract

## Database Schema

See `prisma/schema.prisma` for complete schema definition.

**Key Models:**
- User, Company, Contact
- Enquiry, Quote, Booking
- Contract, Invoice, Payment
- Task, Reminder, CalendarEvent
- EmailTemplate, EmailThread, EmailMessage
- AutomationRule, AutomationExecution
- Note, AuditLog

## Permissions & Roles

- **ADMIN** - Full system access
- **MANAGER** - Team management, full operational access
- **AGENT** - Standard user, limited to assigned records
- **VIEWER** - Read-only access

See `docs/PERMISSIONS_ROLES.md` for details.

## Automation Engine

Create rules that automatically perform actions based on triggers:

- Event triggers (enquiry created, quote accepted, etc.)
- Scheduled triggers (daily, weekly, custom)
- Actions (send email, update status, create task, etc.)

See `docs/AUTOMATION_ENGINE.md` for complete documentation.

## MVP Roadmap

See `docs/MVP_ROADMAP.md` for detailed phased development plan.

**Phase 1 (MVP)**: Core CRM functionality - 4 weeks
**Phase 2**: Automation & Email - 4 weeks
**Phase 3**: Gmail Sync & Contracts - 4 weeks
**Phase 4**: Advanced Features - 4 weeks
**Phase 5**: Reporting & Analytics - 4 weeks
**Phase 6**: Mobile App & Polish - 4 weeks

## Design Principles

1. **Ultra-fast workflow** - Minimal clicks to complete tasks
2. **Mobile-first** - Optimized for mobile devices
3. **Entertainer-first terminology** - Industry-specific language
4. **Strong automation** - Rules and scheduled emails
5. **GDPR compliant** - Full audit logging

## Development

### Database Commands

```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema changes to database
npm run db:migrate     # Create migration
npm run db:studio      # Open Prisma Studio
```

### Build

```bash
npm run build
npm start
```

## Environment Variables

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_SERVICE_API_KEY=...
ESIGNATURE_SERVICE_API_KEY=...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
