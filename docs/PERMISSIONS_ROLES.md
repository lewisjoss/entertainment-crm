# Permissions & Roles System

## Overview
The CRM implements a role-based access control (RBAC) system with four predefined roles and granular permissions for GDPR compliance and security.

## Roles

### 1. ADMIN
Full system access and configuration capabilities.

**Permissions:**
- ✅ All permissions (implicit)
- ✅ User management (create, edit, delete users)
- ✅ System configuration
- ✅ Automation rule management
- ✅ Audit log access
- ✅ Data export
- ✅ GDPR data deletion

### 2. MANAGER
Team management with full operational access.

**Permissions:**
- ✅ View all companies, enquiries, bookings, invoices
- ✅ Create and edit all records
- ✅ Delete own records
- ✅ View and manage all quotes and contracts
- ✅ Access reports and analytics
- ✅ Manage email templates
- ✅ Create and manage automation rules
- ✅ View audit logs for assigned entities
- ✅ Export data for assigned entities
- ❌ User management
- ❌ System configuration
- ❌ Full audit log access

### 3. AGENT
Standard user with limited access based on assignments.

**Permissions:**
- ✅ View own assigned companies, enquiries, bookings
- ✅ Create new companies, enquiries, quotes, bookings
- ✅ Edit own assigned records
- ✅ View own quotes and invoices
- ✅ Create invoices for own bookings
- ✅ Create and manage tasks
- ✅ View calendar for own bookings
- ✅ Send emails using templates
- ✅ View own audit log entries
- ❌ Delete records (except own drafts)
- ❌ View all company data
- ❌ Manage automation rules
- ❌ Export data
- ❌ View full audit logs

### 4. VIEWER
Read-only access for reporting purposes.

**Permissions:**
- ✅ View all companies, enquiries, bookings (read-only)
- ✅ View reports and dashboards
- ✅ View calendar
- ❌ Create or edit any records
- ❌ Delete records
- ❌ Access sensitive data (payment details, contracts)
- ❌ Export data
- ❌ View audit logs

## Permission Model

### Entity-Level Permissions

Each entity (Company, Enquiry, Booking, Invoice, etc.) checks:

1. **Ownership/Assignment**
   - If user is assigned/created the entity
   - Agent can only edit own assignments

2. **Role Hierarchy**
   - ADMIN > MANAGER > AGENT > VIEWER
   - Higher roles inherit lower role permissions

3. **Explicit Permissions**
   - Role-based permission matrix
   - Field-level restrictions for sensitive data

### Field-Level Permissions

Sensitive fields require specific permissions:

**Financial Fields:**
- `Invoice.amountPaid`, `Payment.amount` - MANAGER+ only
- `Company.rating`, `Quote.total` - AGENT+ with assignment

**Personal Data (GDPR):**
- Contact details - Based on entity assignment
- Email threads - AGENT+ with assignment
- Notes marked as private - Creator only

**System Fields:**
- Audit logs - MANAGER+ (full), AGENT (own entries)
- Automation rules - MANAGER+ only
- User management - ADMIN only

## Implementation

### Permission Middleware

```typescript
// app/lib/permissions.ts
export function hasPermission(
  user: User,
  permission: Permission,
  resource?: Resource,
  resourceId?: string
): boolean {
  // Check role
  if (user.role === 'ADMIN') return true
  
  // Check role permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role]
  if (!rolePermissions.includes(permission)) return false
  
  // Check resource ownership/assignment for AGENT
  if (user.role === 'AGENT' && resource) {
    return checkResourceAccess(user.id, resource, resourceId)
  }
  
  return true
}
```

### API Route Protection

```typescript
// app/api/enquiries/route.ts
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request)
  
  if (!hasPermission(user, 'UPDATE_ENQUIRY', 'ENQUIRY', params.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Continue with update...
}
```

### UI Component Protection

```typescript
// app/components/PermissionGate.tsx
export function PermissionGate({ 
  permission, 
  resource, 
  resourceId, 
  children 
}) {
  const user = useUser()
  
  if (!hasPermission(user, permission, resource, resourceId)) {
    return null
  }
  
  return children
}

// Usage
<PermissionGate permission="DELETE_ENQUIRY" resource="ENQUIRY" resourceId={enquiry.id}>
  <Button variant="danger">Delete</Button>
</PermissionGate>
```

## GDPR Compliance

### Data Access

- **Right to Access**: Users can export their data via API
- **Right to Rectification**: Users can update their information
- **Right to Erasure**: ADMIN can soft-delete records (retained in audit log)
- **Right to Portability**: Export functionality for user data

### Data Minimization

- Only collect necessary data
- Soft deletes retain audit trail
- Field-level access controls
- Automatic data retention policies

### Audit Trail

All data access and modifications are logged:

```typescript
// Audit log entry
{
  userId: "user-id",
  entityType: "ENQUIRY",
  entityId: "enquiry-id",
  action: "VIEW" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT",
  oldValues: {...},
  newValues: {...},
  ipAddress: "...",
  userAgent: "...",
  createdAt: "..."
}
```

### Data Retention

- Active records: Indefinite (with soft delete)
- Audit logs: 7 years (legal requirement)
- Email threads: 2 years
- Deleted records: 30 days in audit log

## Permission Matrix

| Action | ADMIN | MANAGER | AGENT | VIEWER |
|--------|-------|---------|-------|--------|
| View all companies | ✅ | ✅ | ❌ | ✅ |
| View assigned companies | ✅ | ✅ | ✅ | ✅ |
| Create company | ✅ | ✅ | ✅ | ❌ |
| Edit company | ✅ | ✅ | ✅* | ❌ |
| Delete company | ✅ | ✅ | ❌ | ❌ |
| View all enquiries | ✅ | ✅ | ❌ | ✅ |
| View assigned enquiries | ✅ | ✅ | ✅ | ✅ |
| Create enquiry | ✅ | ✅ | ✅ | ❌ |
| Edit enquiry | ✅ | ✅ | ✅* | ❌ |
| Delete enquiry | ✅ | ✅ | ✅* | ❌ |
| Create quote | ✅ | ✅ | ✅ | ❌ |
| Send quote | ✅ | ✅ | ✅ | ❌ |
| Accept quote | ✅ | ✅ | ✅ | ❌ |
| Create booking | ✅ | ✅ | ✅ | ❌ |
| Edit booking | ✅ | ✅ | ✅* | ❌ |
| Create invoice | ✅ | ✅ | ✅* | ❌ |
| View payments | ✅ | ✅ | ✅* | ❌ |
| Record payment | ✅ | ✅ | ✅* | ❌ |
| Create contract | ✅ | ✅ | ✅* | ❌ |
| Sign contract | ✅ | ✅ | ✅* | ❌ |
| Create task | ✅ | ✅ | ✅ | ❌ |
| Manage automation | ✅ | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ✅* | ✅* | ❌ |
| Export data | ✅ | ✅* | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |

* = Limited to own assigned records or specific conditions

## Security Best Practices

1. **Always verify permissions server-side** (never trust client)
2. **Use parameterized queries** to prevent SQL injection
3. **Validate all inputs** before processing
4. **Rate limit** API endpoints
5. **Log all permission denials** for security monitoring
6. **Use HTTPS** for all communications
7. **Encrypt sensitive data** at rest (payment info, contracts)
8. **Implement session timeout** for inactive users
9. **Use JWT tokens** with expiration for API authentication
10. **Regular permission audits** to ensure compliance
