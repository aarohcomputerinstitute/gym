-- Add next_installment_date to store when the remaining balance is due
ALTER TABLE payments ADD COLUMN IF NOT EXISTS next_installment_date DATE;
