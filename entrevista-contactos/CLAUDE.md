# Prueba técnica Angular 18 — Gestión de Contactos

## Contexto

Aplicación para una prueba técnica de entrevista laboral. El código debe verse como trabajo de un desarrollador senior: sin comentarios obvios, sin texto genérico, sin rastros de generación automática.

## Comandos esenciales

```bash
npm install       # instalar dependencias
ng serve          # levantar en http://localhost:4200
ng build          # compilar producción
```

## Credenciales de prueba

| Usuario  | Clave | Perfil | Permisos                   |
|----------|-------|--------|----------------------------|
| admin    | 123   | 1      | Crear, modificar, eliminar |
| crea     | 123   | 2      | Crear, modificar           |
| consulta | 123   | 3      | Solo lectura               |

## API

Base URL: `https://sandeonline.cl:2082/taskfocus/maestros/api/Test`

| Operación        | Método | Endpoint                                  |
|------------------|--------|-------------------------------------------|
| Login            | POST   | `/Login`                                  |
| Listar contactos | GET    | `/ListarContactos/{idUsuario}`            |
| Obtener contacto | GET    | `/ListaContacto/{idUsuario}/{idContacto}` |
| Crear contacto   | POST   | `/CreaContacto`                           |
| Modificar        | POST   | `/UpdateContacto`                         |
| Eliminar         | POST   | `/DeleteContacto`                         |

### Cuerpos de request relevantes

**Login**
```json
{ "usuario": "admin", "clave": "123" }
```
Respuesta: array — usar siempre `response[0]`.

**CreaContacto**
```json
{ "idUsuario": "", "idContacto": "0", "rutContacto": "", "nombreContacto": "", "abreviacion": "", "telefono": "", "email": "" }
```

**UpdateContacto** — no incluye `rutContacto`
```json
{ "idUsuario": "", "idContacto": "", "nombreContacto": "", "abreviacion": "", "telefono": "", "email": "" }
```

**DeleteContacto**
```json
{ "idUsuario": "", "idContacto": "" }
```

## Arquitectura

```
src/app/
  core/
    base/base-api.service.ts          # clase abstracta — BaseApiService
    guards/auth.guard.ts              # verifica token en localStorage
    guards/profile.guard.ts           # factory guard: profileGuard([1, 2])
    interceptors/auth.interceptor.ts  # agrega Authorization: Bearer <token>
    models/                           # Session, UsuarioApi, Contacto
    services/
      session.service.ts              # lectura/escritura de localStorage
      auth.service.ts                 # extends BaseApiService
      contactos.service.ts            # extends BaseApiService
  features/
    auth/login/                       # LoginComponent
    contactos/list/                   # ContactosListComponent
    contactos/form/                   # ContactoFormComponent (nuevo y editar)
  app.routes.ts                       # rutas con lazy loading
  app.config.ts                       # providers: router, httpClient + interceptor
```

## Reglas de negocio críticas

**Token:** la API no entrega token. Angular genera uno con `crypto.randomUUID()` tras login exitoso y lo guarda en localStorage junto a `idUsuario` y `perfil`.

**Permisos por perfil:**
- Perfil 1 → puede crear, modificar y eliminar
- Perfil 2 → puede crear y modificar (sin eliminar)
- Perfil 3 → solo lectura (sin botones de acción)

**Botones en el listado:**
- "Nuevo": visible para perfiles 1 y 2
- "Editar": visible para perfiles 1 y 2
- "Eliminar": visible solo para perfil 1

**Formulario editar:** el campo `rutContacto` se deshabilita (no se envía en `UpdateContacto`). Se carga el detalle con `GET /ListaContacto/{idUsuario}/{idContacto}`.

**Formulario nuevo:** `idContacto` siempre va como `"0"` en el body.

## Rutas

| Ruta                    | Guard                              |
|-------------------------|------------------------------------|
| `/login`                | ninguno (pública)                  |
| `/contactos`            | `authGuard`                        |
| `/contactos/nuevo`      | `authGuard` + `profileGuard([1,2])`|
| `/contactos/:id/editar` | `authGuard` + `profileGuard([1,2])`|

## Decisiones de implementación

- Componentes standalone con lazy loading (`loadComponent`)
- `HttpInterceptorFn` funcional registrado con `withInterceptors` en `app.config.ts`
- `BaseApiService` es clase abstracta (no `@Injectable`) — la herencia la hacen `AuthService` y `ContactosService`
- `inject()` en field initializers (patrón Angular 14+)
- Sesión persiste en localStorage con clave `app_session`; se rehidrata en el constructor de `SessionService`
- `profileGuard` es una factory function que devuelve un `CanActivateFn` para reutilización
