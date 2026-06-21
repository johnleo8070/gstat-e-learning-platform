-- Subscription Packages table
CREATE TABLE IF NOT EXISTS subscription_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  max_children INTEGER NOT NULL,
  max_concurrent_learners INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parent Subscriptions table
CREATE TABLE IF NOT EXISTS parent_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES subscription_packages(id),
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(parent_id, package_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES parent_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_reference VARCHAR(255),
  bank_name VARCHAR(100),
  receipt_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES auth.users(id)
);

-- Admin Roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, role)
);

-- Modify profiles table to add admin flag (if not exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_parent_subscriptions_parent_id ON parent_subscriptions(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_subscriptions_status ON parent_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_parent_id ON payments(parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_roles_admin_id ON admin_roles(admin_id);

-- Enable RLS on new tables
ALTER TABLE subscription_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_packages (public read)
CREATE POLICY "Anyone can view active subscription packages"
  ON subscription_packages FOR SELECT
  USING (is_active = true);

-- RLS Policies for parent_subscriptions
CREATE POLICY "Parents can view their own subscriptions"
  ON parent_subscriptions FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their own subscriptions"
  ON parent_subscriptions FOR INSERT
  WITH CHECK (parent_id = auth.uid());

-- RLS Policies for payments
CREATE POLICY "Parents can view their own payments"
  ON payments FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    auth.uid() IN (
      SELECT admin_id FROM admin_roles WHERE role IN ('admin', 'payment_verifier')
    )
  );

CREATE POLICY "Admins can update payment status"
  ON payments FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT admin_id FROM admin_roles WHERE role IN ('admin', 'payment_verifier')
    )
  );

-- RLS Policies for admin_roles
CREATE POLICY "Admins can view admin roles"
  ON admin_roles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT admin_id FROM admin_roles WHERE role = 'admin'
    )
  );
