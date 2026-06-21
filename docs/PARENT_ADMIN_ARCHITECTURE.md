# Parent & Admin Only Architecture

## Overview

The GSTAT eLearning Platform has been redesigned to operate with only two user roles: **Parents** and **Admins**. This eliminates the need for separate Student and Teacher accounts, streamlining the system while maintaining full functionality for learning management.

## Key Architectural Changes

### 1. Authentication System

**Before:**
- Four roles: Student, Parent, Teacher, School Admin
- Complex role management and dashboards
- Student login with separate credentials
- Teacher curriculum management

**After:**
- Two roles: Parent, Admin
- Simplified login with role selection
- Parents manage all children through a single account
- Admins handle payment verification and platform management

### 2. Database Schema

#### New Tables Added:
- `subscription_packages` - Pricing tiers (Starter, Family, Premium)
- `parent_subscriptions` - Active parent subscriptions with limits
- `payments` - Bank transfer payment tracking and verification
- `admin_roles` - Detailed admin permission management

#### Modified Tables:
- `profiles` - Added `is_admin` boolean flag
- `students` - Now represents child profiles only (no auth users)

#### Removed Relationships:
- No more Teacher-Course assignments
- No more Student-Class enrollments
- Simplified parent-child relationship (profile-based only)

### 3. User Roles & Permissions

#### Parent Role:
- Create and manage multiple children (limited by subscription tier)
- Access children's learning progress
- Make payments for subscriptions
- View and download certificates
- Manage account settings

#### Admin Role:
- View all parent accounts
- Verify and approve/reject bank transfer payments
- Manage subscription status
- View platform analytics
- Access admin settings

### 4. Child Management

**Key Change**: Children are now **profiles without auth accounts**.

Previously:
- Each child had separate Supabase auth account
- Separate login credentials
- Child logged in independently
- Unique student ID and profile

Now:
- Children are stored as profiles in the `profiles` table
- No separate auth accounts
- Parents access children's learning center for them
- Linked via `parent_id` in students table

### 5. Payment System

#### Bank Transfer Workflow:
1. Parent selects subscription package
2. System generates bank details and transaction reference
3. Parent makes bank transfer using reference
4. Parent uploads proof (screenshot)
5. Admin reviews and verifies payment
6. Payment approved → Subscription activated

#### Payment Status Flow:
- `pending` → Parent submitted proof, awaiting verification
- `approved` → Admin verified payment, subscription active
- `rejected` → Payment invalid or issue found
- `refunded` → Payment reversed

### 6. Subscription Packages

Three tier structure:

| Package | Price | Max Children | Features |
|---------|-------|--------------|----------|
| Starter | $29/mo | 1 | All courses for 1 child |
| Family | $59/mo | 3 | All courses for up to 3 children |
| Premium | $99/mo | Unlimited | All courses, priority support |

## API Endpoints

### Parent Endpoints:
```
GET  /api/parent/profile          - Get parent info
POST /api/parent/children          - Create child profile
GET  /api/parent/children          - List children
PUT  /api/parent/children/:id      - Update child
DELETE /api/parent/children/:id    - Delete child
GET  /api/parent/subscription      - Current subscription
POST /api/payment/initiate         - Start payment
```

### Admin Endpoints:
```
GET  /api/admin/parents           - List all parents
GET  /api/admin/payments          - List all payments
PUT  /api/admin/payments/:id      - Verify payment
GET  /api/admin/subscriptions     - List subscriptions
GET  /api/admin/analytics        - Platform analytics
```

## Dashboard Structure

### Parent Dashboard
- **Children Management** - Add, edit, delete children
- **Learning Center** - Access courses FOR children (parent-controlled)
- **Progress Tracking** - View child learning metrics
- **Subscription** - Manage payment and plan
- **Certificates** - Download completed certificates

### Admin Dashboard
- **Overview** - KPIs: total parents, payments, revenue
- **Parents** - Parent account management
- **Payments** - Bank transfer verification workflow
- **Subscriptions** - Active subscriptions view
- **Analytics** - Platform growth and revenue trends

## Migration Path for Existing Data

1. **Profiles**: Keep existing parent profiles unchanged
2. **Students**: Keep student profiles but remove auth accounts
3. **Payments**: New payment records for existing paid accounts
4. **Subscriptions**: Map existing accounts to appropriate tier
5. **Children**: Existing students become child profiles under parents

## Security Considerations

### Row Level Security (RLS)
- Parents can only view their own children
- Parents can only view their own payments
- Admins can view payments with admin role verification
- Admin-only endpoints protected at DB level

### Authentication Flow
1. Login with Parent/Admin role
2. Supabase validates auth
3. RLS policies enforce data access
4. Child access via parent's profile

## Benefits of This Architecture

1. **Simplified UX** - Single parent account for family
2. **Cost Efficient** - No need for per-child subscriptions
3. **Easier Admin** - No teacher account management
4. **Scalable** - Fewer auth accounts to manage
5. **Flexible** - Support multiple pricing tiers
6. **Payment Ready** - Built-in payment verification

## Next Steps

1. ✅ Database schema updates
2. ✅ Auth system modifications
3. ✅ Admin dashboard creation
4. ⏳ Parent dashboard redesign with learning center
5. ⏳ Update learning experience for parent-controlled access
6. ⏳ Remove old dashboards (Student, Teacher, School)
7. ⏳ Payment verification API endpoints
