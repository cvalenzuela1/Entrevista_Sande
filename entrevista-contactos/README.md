# Gestión de Contactos — Angular 18

Aplicación de gestión de contactos con autenticación, perfiles de usuario y CRUD completo.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Ejecución

```bash
ng serve
```

Abrir en el navegador: `http://localhost:4200`

## Credenciales de prueba

| Usuario   | Clave | Perfil | Permisos                    |
|-----------|-------|--------|-----------------------------|
| admin     | 123   | 1      | Crear, modificar, eliminar  |
| crea      | 123   | 2      | Crear, modificar            |
| consulta  | 123   | 3      | Solo lectura                |

## Rutas

| Ruta                      | Acceso                |
|---------------------------|-----------------------|
| `/login`                  | Pública               |
| `/contactos`              | Autenticado           |
| `/contactos/nuevo`        | Perfil 1 o 2          |
| `/contactos/:id/editar`   | Perfil 1 o 2          |

## Arquitectura

- **Angular 18** con componentes standalone y lazy loading
- **AuthGuard** — protege rutas privadas verificando el token en localStorage
- **ProfileGuard** — restringe rutas según el perfil del usuario
- **HttpInterceptor** — agrega `Authorization: Bearer <token>` en cada request
- **Sesión local** — token generado en Angular con `crypto.randomUUID()`, guardado en localStorage junto a `idUsuario` y `perfil`
- **Herencia (extends)** — `AuthService` y `ContactosService` extienden `BaseApiService`, que encapsula `HttpClient` y los métodos `get`/`post`
