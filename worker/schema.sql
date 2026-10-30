PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY,
 order_number TEXT NOT NULL UNIQUE,
 customer_name TEXT NOT NULL,
 customer_phone TEXT NOT NULL,
 customer_address TEXT NOT NULL,
 customer_note TEXT DEFAULT '',
 items_json TEXT NOT NULL,
 total INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
