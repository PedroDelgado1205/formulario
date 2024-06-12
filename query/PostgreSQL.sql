CREATE TABLE "countries" (
  "codigo_verificacion" varchar PRIMARY KEY,
  "numero_legalizacion" varchar,
  "fecha_emision" varchar,
  "titular" varchar,
  "descargas_PDF" INT DEFAULT 0
);
