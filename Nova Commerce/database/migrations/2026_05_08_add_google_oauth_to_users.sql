USE nova_commerce;

ALTER TABLE users
  ADD COLUMN google_id VARCHAR(120) NULL UNIQUE AFTER password,
  ADD COLUMN avatar VARCHAR(500) NULL AFTER google_id;

UPDATE users
SET email = 'admin@example.com'
WHERE email = 'admin@nova.test';
