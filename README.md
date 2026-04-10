# Taller en clase: Auth + Roles

## Requisitos
- Node.js 18+

## Instalar
```bash
npm install
```

## Ejecutar
```bash
npm run dev
```

Por defecto corre en `http://localhost:3000`.

## Probar con HTML (formulario)
Abre en el navegador:
- `http://localhost:3000/`

## Si `npm` no aparece en Git Bash (Windows)
En Git Bash, dentro de esta carpeta:

```bash
source ./use-node-path.sh
which node
which npm
npm -v
```

## Endpoints

### `POST /login`
Body JSON:
```json
{ "username": "admin", "password": "admin123" }
```

Respuestas:
- `200` → `{ "token": "..." }`
- `400` → `{ "message": "invalid credential" }`

Usuarios demo:
- `admin / admin123` → rol `ADMIN`
- `user / user123` → rol `USER`

### `GET /request`
Header:
- `Authorization: Bearer <token>`

Respuestas:
- rol `ADMIN` → `200` `{ "message": "Hi from ADMIN" }`
- rol `USER` → `200` `{ "message": "Hi from USER" }`
- *cualquier otro caso* → `401` `{ "message": "You're not allowed to do this" }`

## Pruebas rápidas (curl)

Login ADMIN:
```bash
curl -s -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Login USER:
```bash
curl -s -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"user\",\"password\":\"user123\"}"
```

Request (reemplaza TOKEN):
```bash
curl -s http://localhost:3000/request -H "Authorization: Bearer TOKEN"
```

