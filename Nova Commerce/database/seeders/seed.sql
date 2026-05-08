USE nova_commerce;

INSERT INTO users (name, email, password, role, google_id, avatar, email_verified_at, created_at, updated_at)
VALUES ('Admin Nova', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEaF9jiTqUgoV5wGkQ4f2NQ7eTO', 'admin', NULL, NULL, NOW(), NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO coupons (code, type, value, active, expires_at, created_at, updated_at)
VALUES ('NOVA15', 'percent', 15, 1, DATE_ADD(NOW(), INTERVAL 1 YEAR), NOW(), NOW())
ON DUPLICATE KEY UPDATE code = code;
