-- Update existing payments table to support partial payments natively
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS next_installment_date DATE;

-- Add an index since this column might be queried frequently for "due payments" dashboard widgets
CREATE INDEX IF NOT EXISTS idx_payments_next_installment ON payments(gym_id, next_installment_date);
