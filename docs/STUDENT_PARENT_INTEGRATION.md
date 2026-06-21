# Student-Parent Login Integration

This document describes the integrated student-parent login system for GSTAT.

## Overview

The system enables parents to create child accounts with automatic Supabase authentication. Each child receives unique login credentials and sees only their own learning data.

## How It Works

### 1. Parent Creates Child Account

When a parent adds a child from the Parent Dashboard:

1. Parent fills in child's name, birthdate, and grade level
2. System calls `POST /api/parent/children`
3. API automatically:
   - Generates unique credentials (username & password)
   - Creates Supabase auth account for the child
   - Creates child profile record
   - Creates student record linking to parent
4. Credentials are displayed to parent immediately for sharing with child

### 2. Child Login

Child can login using the credentials provided by parent:

1. Navigate to `/login`
2. Select "Student" role
3. Use `username@gstat-student.local` and password provided
4. System authenticates and redirects to `/dashboard/student`

### 3. Data Access Control

Each child's data is automatically filtered:

- Student dashboard queries use `auth.uid()` to fetch only current user's data
- Profile queries filter by `user_id = auth.uid()`
- Student progress queries filter by the authenticated user's student record
- RLS policies (in Supabase) enforce data isolation at database level

## Key Components

### API Endpoints

#### POST `/api/parent/children`
Create a new child account with auto-generated credentials.

**Request:**
```json
{
  "firstName": "Emma",
  "lastName": "Smith",
  "dateOfBirth": "2015-05-12",
  "gradeLevel": "3"
}
```

**Response:**
```json
{
  "success": true,
  "child": {...},
  "credentials": {
    "username": "emma.smith.abc123",
    "password": "BraveTiger1456",
    "email": "emma.smith.abc123@gstat-student.local"
  }
}
```

#### POST `/api/parent/children/[childId]/credentials`
Reset password or manage child account.

**Actions:**
- `reset_password` - Generate new credentials
- `deactivate` - Disable login
- `activate` - Re-enable login

### Components

#### `ChildCredentials`
Displays child login credentials with copy-to-clipboard functionality.

#### `ChildManagementModal`
Full child account management interface:
- View child stats and progress
- Reset password
- Deactivate/activate account
- Copy credentials

### Data Models

Each child has:
- **Supabase Auth Account** - Unique user_id, email, password
- **Profile Record** - first_name, last_name, avatar, linked to auth user_id
- **Student Record** - grade_level, progress, stars, linked to parent_id

## Credential Generation

Credentials are generated using `lib/auth/generate-credentials.ts`:

```typescript
{
  username: `{firstName}.{lastName}.{randomId}` 
  password: `{Adjective}{Animal}{Number}` (e.g., "BraveTiger1456")
  email: `{username}@gstat-student.local`
}
```

Passwords use an easy-to-remember format that children can type.

## Security Considerations

1. **Auto-confirmation** - Child auth accounts are automatically email-confirmed (no confirmation needed)
2. **Temporary Passwords** - Parents can reset passwords anytime from dashboard
3. **Account Deactivation** - Parents can disable accounts without deletion
4. **RLS Policies** - Database enforces data isolation (students see only own data)
5. **Parent Verification** - Child management only works if parent owns the child record

## Parent Dashboard Features

### Add/Manage Children
- Click "Add Child" to create new account
- Credentials displayed immediately
- Click key icon next to child name to manage

### Child Account Management Modal
- **Overview Tab**: View child's stats
- **Credentials Tab**: Copy/reset login credentials
- **Settings Tab**: Deactivate account if needed

### Child Selection
- Click child name to switch between children
- Each child selector has a key icon for account management
- View different child's progress by selecting them

## Student Dashboard Features

### Automatic Data Filtering
- Student sees only their own:
  - Progress records
  - Lessons and courses
  - Achievements and badges
  - Learning streak and stars
- Profile and dashboard data bound to logged-in `auth.uid()`

### Features Available
- View learning progress
- See assigned lessons
- Track achievements and badges
- Monitor learning streaks
- View earned stars and coins

## Database RLS Policies

RLS policies in Supabase (`lib/supabase/rls-policies.sql`) enforce:

1. **Students Table**
   - Students see only their own record
   - Parents see all their linked children

2. **Profiles Table**
   - Users see only their own profile
   - No cross-user access

3. **Student Progress Table**
   - Students see own progress
   - Parents see children's progress

4. **Lessons & Subjects Table**
   - Public read access for all authenticated users

## Testing the Integration

### Create a Child Account
1. Login as parent
2. Go to Parent Dashboard
3. Click "Add Child"
4. Fill in child details and submit
5. Copy/note the credentials shown

### Login as Child
1. Go to `/login`
2. Select "Student"
3. Use credentials from above
4. Should see only that child's data

### Reset Password
1. Go to Parent Dashboard
2. Click key icon next to child's name
3. Go to "Credentials" tab
4. Click "Reset Password"
5. New credentials displayed

### Deactivate Account
1. Go to Parent Dashboard
2. Click key icon next to child
3. Go to "Settings" tab
4. Click "Deactivate Account"
5. Child cannot login until re-activated

## Troubleshooting

### Child Cannot Login
- Verify credentials in Parent Dashboard
- Check if account is deactivated (reactivate if needed)
- Ensure using correct role (Student, not Parent)

### Child Sees Other Child's Data
- Not possible with current RLS setup
- Each auth account is isolated
- Check if right child is logged in

### Credentials Not Showing
- Credentials only shown when first created
- Use "Reset Password" to generate new ones
- Check parent dashboard child management

## Future Enhancements

- [ ] Bulk child import from CSV
- [ ] Child progress notifications to parent
- [ ] Scheduled learning reminders
- [ ] Parent-child learning goals
- [ ] Multi-language support for credentials
- [ ] Child profile customization (avatar, theme)
