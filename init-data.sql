INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@example.com',
  '$2b$10$JTkHRFE1om0/JvvBIRGi4edH4NlSAfblu85WmankCc.3NiqfLuGfu',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
INSERT INTO gold_rates (rate_per_gram, entered_by)
VALUES (6500, 'seed')
ON CONFLICT DO NOTHING;
