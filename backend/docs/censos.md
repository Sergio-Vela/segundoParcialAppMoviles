# Módulo de censos

## Estructura y relación

- `src/infrastructure/models/censoModel.ts`: modelo Sequelize `Censo` y validaciones.
- `src/domain/services/CensoService.ts` y `src/infrastructure/services/CensoServiceImpl.ts`: contrato y consultas/creación.
- `src/interfaces/controllers/CensoController.ts`: validación del cuerpo, proyección de respuestas y códigos HTTP.
- `src/interfaces/routes/CensoRoutes.ts`: rutas y protección por rol.
- `migrations/20261025_create_censos.sql`: migración PostgreSQL transaccional.

`Censo` se almacena en `censos` y contiene `id`, `nombre`, `apellido`, `totalMiembros`, `cantidadTelevisiones`, `latitud`, `longitud`, `creadoPor`, `origenCarga` y `fechaCreacion`. Sequelize también mantiene `createdAt` y `updatedAt`. `creadoPor` es nullable para permitir los registros MASIVA futuros y tiene FK a `users.id` con `ON DELETE SET NULL`. La asociación se llama `User.censos` / `Censo.creador`. No se devuelve el modelo de usuario asociado.

## Autenticación y roles

Se reutiliza el JWT existente: el `sub` identifica al usuario. El middleware valida el token y busca ese usuario en la base de datos en cada petición protegida; el rol actual no se lee del token ni del cuerpo. La falta de token, token inválido o usuario ya inexistente produce 401. Un usuario autenticado con rol `NULL`, desconocido o insuficiente recibe 403. El login conserva su respuesta actual.

| Método y ruta | Rol | Resultado |
|---|---|---|
| `POST /api/censos` | `censista` | Crea con `creadoPor` autenticado y `origenCarga=NORMAL`; ignora cualquier valor de esos campos que envíe el cliente. |
| `GET /api/censos` | `administrador` | Lista censos. |
| `GET /api/censos/:id` | `administrador` | Devuelve el censo identificado. |
| `GET /api/censos/mapa` | `administrador` | Devuelve sólo los campos necesarios para el mapa. |
| `GET /api/censos/normales` | `administrador` | Lista sólo `origenCarga=NORMAL`. |
| `GET /api/censos/masivos` | `administrador` | Lista sólo `origenCarga=MASIVA`. |

Los nombres y apellidos deben ser cadenas no vacías de hasta 255 caracteres; `totalMiembros` debe ser entero positivo; `cantidadTelevisiones`, entero no negativo; latitud y longitud deben ser números finitos dentro de sus rangos. Se rechazan números enviados como texto.

## Ejemplos de Postman

Usa `http://localhost:3000` como base local. Primero inicia sesión mediante `POST /api/login` con `{"usuario":"...","password":"..."}` y copia `body.token` de la respuesta. En cada ejemplo protegido configura el encabezado `Authorization` con el valor `Bearer <token>`.

**Censista: crear censo**

`POST /api/censos`, `Content-Type: application/json`:

```json
{
  "nombre": "Ana",
  "apellido": "López",
  "totalMiembros": 4,
  "cantidadTelevisiones": 2,
  "latitud": 19.432608,
  "longitud": -99.133209
}
```

La respuesta exitosa es 201 y contiene el censo creado. Aunque se agreguen `"creadoPor": 999` u `"origenCarga": "MASIVA"` al cuerpo, el servidor no usa esos valores: asigna la identidad autenticada y `NORMAL`.

**Administrador: consultas**

- `GET /api/censos`
- `GET /api/censos/1`
- `GET /api/censos/mapa`
- `GET /api/censos/normales`
- `GET /api/censos/masivos`

Todas requieren el token de un usuario cuyo rol actual sea `administrador`. Las respuestas mantienen el envoltorio del proyecto: `standardResponse` y `body`. El endpoint de mapa proyecta únicamente `id`, `nombre`, `apellido`, `totalMiembros`, `cantidadTelevisiones`, `latitud`, `longitud`, `origenCarga` y `fechaCreacion`.

## Respuestas esperadas

- **200:** consulta correcta; `body` contiene el registro o una lista (también `[]` si no hay resultados).
- **201:** censo creado correctamente por un censista.
- **400:** cuerpo inválido o id de detalle inválido.
- **401:** falta token, token inválido/expirado o usuario del token inexistente.
- **403:** token válido, pero rol nulo/desconocido o sin permiso para la operación.
- **404:** id válido cuyo censo no existe.

Las respuestas de consulta y creación usan el envoltorio estándar. Ejemplo de creación (201):

```json
{
  "standardResponse": { "httpCode": 201, "message": "Censo creado exitosamente" },
  "body": {
    "id": 1,
    "nombre": "Ana",
    "apellido": "López",
    "totalMiembros": 4,
    "cantidadTelevisiones": 2,
    "latitud": 19.432608,
    "longitud": -99.133209,
    "creadoPor": 12,
    "origenCarga": "NORMAL",
    "fechaCreacion": "2026-10-25T22:00:00.000Z"
  }
}
```

Una consulta exitosa (200) conserva la misma estructura con el mensaje del endpoint y `body` como registro o arreglo. Los errores de validación 400 usan el envoltorio estándar con `body: null`. La autenticación/autorización conserva el formato del middleware existente: 401/403 con `{ "message": "..." }`.

Para comprobar permisos, usa un token de censista en `GET /api/censos/mapa`: debe responder 403. Usa un token de administrador en `POST /api/censos` con un cuerpo válido: también debe responder 403. Un censista sólo puede crear y un administrador sólo puede consultar este módulo.

## Migración y despliegue

La aplicación ya no ejecuta `sync({ alter: true })` en cada arranque; ejecuta `sync()` para crear tablas que falten sin alterar tablas existentes. La migración versionada crea únicamente `censos` y su tipo ENUM, sin modificar ni borrar registros previos. Haz respaldo antes del despliegue y aplica primero la migración en la base PostgreSQL de destino:

```sh
psql -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -W \
  -v ON_ERROR_STOP=1 -f migrations/20261025_create_censos.sql
```

Carga previamente en la shell los valores de conexión usados por la aplicación; `-W` solicita la contraseña sin ponerla en el historial del comando.

Después despliega el código TypeScript y dependencias, ejecuta `npm ci` y `npm run build`, y reinicia el servicio systemd existente. Nginx no requiere cambios si ya reenvía `/api` al backend. Verifica `/health`, el login actual, y las respuestas de los endpoints con cuentas de ambos roles. No se añadió todavía el script de datos de prueba MASIVA: se desarrollará después de validar los endpoints, como fase posterior.
