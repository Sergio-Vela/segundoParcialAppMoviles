BEGIN;

CREATE TYPE "enum_censos_origenCarga" AS ENUM ('NORMAL', 'MASIVA');

CREATE TABLE "censos" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(255) NOT NULL,
    "apellido" VARCHAR(255) NOT NULL,
    "totalMiembros" INTEGER NOT NULL,
    "cantidadTelevisiones" INTEGER NOT NULL,
    "latitud" DECIMAL(9, 6) NOT NULL,
    "longitud" DECIMAL(10, 7) NOT NULL,
    "creadoPor" INTEGER NULL,
    "origenCarga" "enum_censos_origenCarga" NOT NULL DEFAULT 'NORMAL',
    "fechaCreacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "censos_nombre_nonempty" CHECK (length(btrim("nombre")) > 0),
    CONSTRAINT "censos_apellido_nonempty" CHECK (length(btrim("apellido")) > 0),
    CONSTRAINT "censos_totalMiembros_positive" CHECK ("totalMiembros" > 0),
    CONSTRAINT "censos_cantidadTelevisiones_nonnegative" CHECK ("cantidadTelevisiones" >= 0),
    CONSTRAINT "censos_latitud_range" CHECK ("latitud" BETWEEN -90 AND 90),
    CONSTRAINT "censos_longitud_range" CHECK ("longitud" BETWEEN -180 AND 180),
    CONSTRAINT "censos_creadoPor_users_fk"
        FOREIGN KEY ("creadoPor") REFERENCES "users" ("id")
        ON UPDATE CASCADE ON DELETE SET NULL
);

COMMIT;
