BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "products" (
	"id"	TEXT,
	"name"	TEXT,
	"type"	TEXT,
	"price"	INTEGER,
	PRIMARY KEY("id")
);
COMMIT;
