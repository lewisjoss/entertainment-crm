# API Routes Documentation

## Overview

All API routes are prefixed with `/api` and return JSON responses.

## Authentication

All routes (except public endpoints) require authentication. Include JWT token in `Authorization` header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "pagination": {...} // Only for list endpoints
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Enquiries

### List Enquiries
`GET /api/enquiries`

**Query Parameters:**
- `status` - Filter by status (NEW, CONTACTED, QUOTED, etc.)
- `userId` - Filter by assigned user
- `companyId` - Filter by company
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "subject": "...",
      "status": "NEW",
      "company": {...},
      "contact": {...},
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Enquiry
`GET /api/enquiries/[id]`

### Create Enquiry
`POST /api/enquiries`

**Body:**
```json
{
  "companyId": "...",
  "contactId": "...",
  "userId": "...",
  "subject": "Wedding enquiry",
  "description": "...",
  "enquiryType": "WEDDING",
  "eventDate": "2024-06-15",
  "eventLocation": "...",
  "estimatedGuests": 150,
  "budget": 2500,
  "status": "NEW",
  "priority": "HIGH"
}
```

### Update Enquiry
`PATCH /api/enquiries/[id]`

### Delete Enquiry
`DELETE /api/enquiries/[id]` (soft delete)

## Companies

### List Companies
`GET /api/companies`

**Query Parameters:**
- `status` - Filter by status
- `search` - Search by name, email, or company number
- `page` - Page number
- `limit` - Items per page

### Get Company
`GET /api/companies/[id]`

### Create Company
`POST /api/companies`

**Body:**
```json
{
  "name": "Company Name",
  "companyNumber": "...",
  "vatNumber": "...",
  "email": "...",
  "phone": "...",
  "addressLine1": "...",
  "city": "...",
  "postcode": "...",
  "country": "GB",
  "contact": {
    "firstName": "...",
    "lastName": "...",
    "email": "...",
    "phone": "..."
  }
}
```

## Quotes

### List Quotes
`GET /api/quotes`

**Query Parameters:**
- `status` - Filter by status
- `companyId` - Filter by company
- `page` - Page number
- `limit` - Items per page

### Create Quote
`POST /api/quotes`

**Body:**
```json
{
  "enquiryId": "...",
  "companyId": "...",
  "contactId": "...",
  "userId": "...",
  "title": "Quote for Wedding",
  "description": "...",
  "quoteDate": "2024-01-10",
  "validUntil": "2024-01-24",
  "eventDate": "2024-06-15",
  "location": "...",
  "lineItems": [
    {
      "description": "Performance fee",
      "quantity": 1,
      "unitPrice": 2000,
      "vatRate": 0.20,
      "total": 2000
    }
  ],
  "paymentTerms": "50% deposit, 50% on completion"
}
```

## Bookings

### List Bookings
`GET /api/bookings`

**Query Parameters:**
- `status` - Filter by status
- `userId` - Filter by assigned performer
- `companyId` - Filter by company
- `startDate` - Filter by event date (from)
- `endDate` - Filter by event date (to)
- `page` - Page number
- `limit` - Items per page

### Create Booking
`POST /api/bookings`

**Body:**
```json
{
  "enquiryId": "...",
  "quoteId": "...",
  "companyId": "...",
  "contactId": "...",
  "userId": "...",
  "title": "Wedding - Smith & Jones",
  "eventDate": "2024-06-15T18:00:00Z",
  "eventTime": "18:00",
  "eventDuration": 240,
  "setupTime": 30,
  "location": "...",
  "locationDetails": "...",
  "postcode": "...",
  "serviceType": "...",
  "specialRequests": "...",
  "requirements": "...",
  "status": "CONFIRMED",
  "agreedPrice": 2500,
  "depositAmount": 1250,
  "depositPaid": true
}
```

## Invoices

### List Invoices
`GET /api/invoices`

**Query Parameters:**
- `status` - Filter by status
- `companyId` - Filter by company
- `overdue` - Filter overdue invoices (true/false)
- `page` - Page number
- `limit` - Items per page

### Create Invoice
`POST /api/invoices`

**Body:**
```json
{
  "bookingId": "...",
  "quoteId": "...",
  "companyId": "...",
  "contactId": "...",
  "userId": "...",
  "title": "Invoice for Wedding",
  "description": "...",
  "invoiceDate": "2024-01-10",
  "dueDate": "2024-01-24",
  "lineItems": [
    {
      "description": "Performance fee",
      "quantity": 1,
      "unitPrice": 2000,
      "vatRate": 0.20,
      "total": 2000
    }
  ],
  "paymentTerms": "Net 14 days",
  "bankDetails": "..."
}
```

## Contracts

### List Contracts
`GET /api/contracts`

**Query Parameters:**
- `status` - Filter by status
- `bookingId` - Filter by booking

### Create Contract
`POST /api/contracts`

**Body:**
```json
{
  "bookingId": "...",
  "companyId": "...",
  "contactId": "...",
  "title": "Performance Contract",
  "content": "Contract terms...",
  "templateId": "...",
  "status": "DRAFT"
}
```

### Sign Contract
`PATCH /api/contracts/[id]/sign`

**Body:**
```json
{
  "signature": "...", // Base64 encoded signature or signature data
  "signedBy": "CLIENT" // or "PERFORMER"
}
```

## Tasks

### List Tasks
`GET /api/tasks`

**Query Parameters:**
- `userId` - Filter by assigned user
- `isCompleted` - Filter by completion status (true/false)
- `dueDate` - Filter by due date

### Create Task
`POST /api/tasks`

**Body:**
```json
{
  "enquiryId": "...",
  "bookingId": "...",
  "userId": "...",
  "title": "Follow up with client",
  "description": "...",
  "priority": "HIGH",
  "dueDate": "2024-01-20"
}
```

### Update Task
`PATCH /api/tasks/[id]`

**Body:**
```json
{
  "isCompleted": true,
  "title": "...",
  "priority": "...",
  "dueDate": "..."
}
```

## Calendar

### Get Calendar Events
`GET /api/calendar`

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `eventType` - Filter by event type (GIG, MEETING, etc.)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "title": "...",
      "startDateTime": "2024-01-15T18:00:00Z",
      "endDateTime": "2024-01-15T22:00:00Z",
      "location": "...",
      "eventType": "GIG",
      "booking": {...}
    }
  ]
}
```

## Payments

### List Payments
`GET /api/payments`

**Query Parameters:**
- `invoiceId` - Filter by invoice
- `companyId` - Filter by company
- `status` - Filter by status
- `page` - Page number
- `limit` - Items per page

### Create Payment
`POST /api/payments`

**Body:**
```json
{
  "invoiceId": "...",
  "companyId": "...",
  "amount": 1250,
  "paymentDate": "2024-01-15",
  "paymentMethod": "BANK_TRANSFER",
  "reference": "TXN123456",
  "status": "COMPLETED"
}
```

## Email Templates

### List Email Templates
`GET /api/email-templates`

**Query Parameters:**
- `templateType` - Filter by type
- `category` - Filter by category
- `isActive` - Filter by active status

### Create Email Template
`POST /api/email-templates`

**Body:**
```json
{
  "name": "Quote Template",
  "subject": "Quote for {{enquiry.subject}}",
  "body": "Dear {{contact.firstName}}, ...",
  "templateType": "QUOTE",
  "category": "Quote",
  "variables": ["enquiry.subject", "contact.firstName", "quote.total"]
}
```

## Automation Rules

### List Automation Rules
`GET /api/automation/rules`

### Create Automation Rule
`POST /api/automation/rules`

**Body:**
```json
{
  "name": "Auto-send quote confirmation",
  "description": "...",
  "triggerType": "QUOTE_ACCEPTED",
  "triggerConditions": {
    "operator": "AND",
    "conditions": [
      {
        "field": "quote.total",
        "operator": "greaterThan",
        "value": 1000
      }
    ]
  },
  "actions": [
    {
      "type": "SEND_EMAIL",
      "templateId": "...",
      "to": "{{contact.email}}",
      "variables": {
        "quoteNumber": "{{quote.quoteNumber}}"
      }
    }
  ],
  "isActive": true
}
```

### Execute Rule Manually
`POST /api/automation/rules/[id]/execute`

**Body:**
```json
{
  "entityId": "...", // Entity to trigger rule with
  "entityType": "QUOTE"
}
```

## Audit Logs

### List Audit Logs
`GET /api/audit-logs`

**Query Parameters:**
- `entityType` - Filter by entity type
- `entityId` - Filter by entity ID
- `userId` - Filter by user
- `action` - Filter by action
- `startDate` - Filter by date range (from)
- `endDate` - Filter by date range (to)
- `page` - Page number
- `limit` - Items per page

## Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

## Rate Limiting

API requests are rate-limited:
- Authenticated users: 100 requests/minute
- Unauthenticated users: 10 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```
