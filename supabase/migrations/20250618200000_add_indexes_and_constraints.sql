-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_onboarded ON profiles(is_onboarded);

-- Add soft delete columns to important tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add unique index for data integrity (email, only for non-deleted rows)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique ON profiles(email) WHERE deleted_at IS NULL;

-- Add check constraints
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin'));

ALTER TABLE notifications
  ADD CONSTRAINT notifications_title_length_check 
  CHECK (char_length(title) <= 100);

ALTER TABLE notifications
  ADD CONSTRAINT notifications_body_length_check 
  CHECK (char_length(body) <= 1000);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at columns and triggers
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 