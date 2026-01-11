# Automation Engine Design

## Overview
The automation engine allows users to create rules that automatically perform actions based on triggers and conditions. This enables efficient workflows with minimal manual intervention.

## Architecture

### Components

1. **Rule Engine** (`app/lib/automation/engine.ts`)
   - Evaluates triggers and conditions
   - Executes actions
   - Handles errors and retries

2. **Trigger System** (`app/lib/automation/triggers.ts`)
   - Event-based triggers (database changes, API calls)
   - Scheduled triggers (cron-like)
   - Webhook triggers

3. **Action System** (`app/lib/automation/actions.ts`)
   - Email sending
   - Status updates
   - Task creation
   - Notification sending
   - Webhook calls

4. **Scheduler** (`app/lib/automation/scheduler.ts`)
   - Runs scheduled rules
   - Checks reminders
   - Processes queue

## Trigger Types

### Event Triggers

- `ENQUIRY_CREATED` - New enquiry received
- `ENQUIRY_STATUS_CHANGED` - Enquiry status updated
- `QUOTE_SENT` - Quote sent to client
- `QUOTE_ACCEPTED` - Quote accepted by client
- `BOOKING_CONFIRMED` - Booking confirmed
- `INVOICE_CREATED` - Invoice created
- `INVOICE_DUE` - Invoice due date approaching
- `PAYMENT_RECEIVED` - Payment received
- `TASK_COMPLETED` - Task marked as complete

### Scheduled Triggers

- Daily at specified time
- Weekly on specific day
- Monthly on specific date
- Custom cron expressions

### Webhook Triggers

- HTTP POST to webhook URL
- Custom event triggers

## Condition System

Conditions are stored as JSON and can evaluate:

```typescript
{
  field: "status",
  operator: "equals",
  value: "NEW"
}

// Complex conditions
{
  operator: "AND",
  conditions: [
    { field: "status", operator: "equals", value: "NEW" },
    { field: "priority", operator: "equals", value: "HIGH" },
    { field: "eventDate", operator: "lessThan", value: "2024-06-01" }
  ]
}
```

**Operators:**
- `equals`, `notEquals`
- `contains`, `notContains`
- `greaterThan`, `lessThan`
- `in`, `notIn`
- `isEmpty`, `isNotEmpty`

## Action Types

### Email Actions

```typescript
{
  type: "SEND_EMAIL",
  templateId: "template-id",
  to: "{{contact.email}}",
  subject: "Quote for {{enquiry.subject}}",
  variables: {
    companyName: "{{company.name}}",
    quoteTotal: "{{quote.total}}"
  }
}
```

### Status Update Actions

```typescript
{
  type: "UPDATE_STATUS",
  entityType: "ENQUIRY",
  entityId: "{{enquiry.id}}",
  status: "CONTACTED"
}
```

### Task Creation Actions

```typescript
{
  type: "CREATE_TASK",
  title: "Follow up with {{company.name}}",
  assignedTo: "{{user.id}}",
  dueDate: "+7 days",
  priority: "MEDIUM",
  enquiryId: "{{enquiry.id}}"
}
```

### Reminder Actions

```typescript
{
  type: "CREATE_REMINDER",
  title: "Invoice due reminder",
  dueDate: "{{invoice.dueDate}}",
  reminderType: "INVOICE_DUE",
  invoiceId: "{{invoice.id}}"
}
```

### Notification Actions

```typescript
{
  type: "SEND_NOTIFICATION",
  userId: "{{user.id}}",
  title: "New high-priority enquiry",
  message: "{{enquiry.subject}}",
  type: "alert"
}
```

### Webhook Actions

```typescript
{
  type: "CALL_WEBHOOK",
  url: "https://example.com/webhook",
  method: "POST",
  headers: {
    "Authorization": "Bearer token"
  },
  body: {
    event: "booking.confirmed",
    bookingId: "{{booking.id}}"
  }
}
```

## Variable System

Variables allow dynamic data insertion using template syntax:

**Entity Variables:**
- `{{enquiry.subject}}` - Enquiry subject
- `{{company.name}}` - Company name
- `{{contact.firstName}}` - Contact first name
- `{{quote.total}}` - Quote total amount
- `{{booking.eventDate}}` - Booking event date

**System Variables:**
- `{{user.name}}` - Current user name
- `{{user.email}}` - Current user email
- `{{now}}` - Current date/time
- `{{+7 days}}` - Date 7 days from now

## Implementation Example

### Rule Definition

```typescript
{
  name: "Auto-send quote confirmation",
  triggerType: "QUOTE_ACCEPTED",
  triggerConditions: {
    operator: "AND",
    conditions: [
      { field: "quote.total", operator: "greaterThan", value: 1000 }
    ]
  },
  actions: [
    {
      type: "SEND_EMAIL",
      templateId: "quote-accepted",
      to: "{{contact.email}}",
      variables: {
        quoteNumber: "{{quote.quoteNumber}}",
        total: "{{quote.total}}"
      }
    },
    {
      type: "CREATE_BOOKING",
      enquiryId: "{{enquiry.id}}",
      quoteId: "{{quote.id}}"
    },
    {
      type: "UPDATE_STATUS",
      entityType: "ENQUIRY",
      entityId: "{{enquiry.id}}",
      status: "WON"
    }
  ]
}
```

### Execution Flow

1. **Trigger Detection**
   - Event occurs (e.g., quote accepted)
   - Engine checks all active rules with matching trigger type
   - Filters by trigger conditions

2. **Condition Evaluation**
   - Evaluates all conditions using entity data
   - Proceeds if conditions match

3. **Action Execution**
   - Executes actions sequentially
   - Resolves variables
   - Handles errors gracefully
   - Logs execution in `AutomationExecution` table

4. **Error Handling**
   - Retries failed actions (configurable)
   - Logs errors
   - Sends notifications on critical failures

## Scheduled Jobs

The scheduler runs periodically to:

1. **Process Scheduled Rules**
   - Evaluate scheduled triggers
   - Execute matching rules

2. **Process Reminders**
   - Check reminders due to be sent
   - Send reminder emails
   - Update reminder status

3. **Process Overdue Items**
   - Mark overdue invoices
   - Create follow-up tasks
   - Send notifications

## API Endpoints

### Create Rule
`POST /api/automation/rules`
```json
{
  "name": "Rule name",
  "triggerType": "ENQUIRY_CREATED",
  "triggerConditions": {...},
  "actions": [...],
  "isActive": true
}
```

### List Rules
`GET /api/automation/rules`

### Update Rule
`PATCH /api/automation/rules/[id]`

### Delete Rule
`DELETE /api/automation/rules/[id]`

### Execute Rule Manually
`POST /api/automation/rules/[id]/execute`

### Get Execution History
`GET /api/automation/rules/[id]/executions`

## Security Considerations

- Rules can only be created/edited by users with appropriate permissions
- Actions are validated before execution
- Webhook URLs must be whitelisted (configurable)
- Rate limiting on webhook calls
- Audit logging for all rule executions

## Performance Considerations

- Rules evaluated asynchronously where possible
- Batch processing for scheduled rules
- Caching of frequently accessed rule data
- Queue system for high-volume events
