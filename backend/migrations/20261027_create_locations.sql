BEGIN;

CREATE TABLE IF NOT EXISTS "locations" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "locations_nombre_nonempty" CHECK (length(btrim("nombre")) > 0),
    CONSTRAINT "locations_descripcion_nonempty" CHECK (length(btrim("descripcion")) > 0),
    CONSTRAINT "locations_latitud_range" CHECK ("latitud" BETWEEN -90 AND 90),
    CONSTRAINT "locations_longitud_range" CHECK ("longitud" BETWEEN -180 AND 180),
    CONSTRAINT "locations_userId_users_fk"
        FOREIGN KEY ("userId") REFERENCES "users" ("id")
        ON UPDATE CASCADE ON DELETE CASCADE
);

COMMIT;
