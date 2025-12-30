# Modulo 3 - Frontend

## Frontend React con API REST

> Portal inmobiliario que consume la API del backend Express.

---

## Stack Tecnologico

| Dependencia | Version |
|-------------|---------|
| React | 19.2.1 |
| React Router DOM | 7.1.1 |
| TypeScript | 5.9.3 |
| Vite | 7.3.0 |
| Tailwind CSS | 4.1.8 |
| Zod | 4.1.9 |
| React Hook Form | 7.54.2 |

---

## Diferencias con Modulo 2

Este frontend es una version refactorizada del Modulo 2 que:

1. **Usa fetch() en lugar de localStorage** - Todas las operaciones CRUD llaman a la API
2. **Funciones async/await** - Las operaciones de datos son asincronas
3. **Filtrado en el backend** - Los query params se envian al servidor
4. **Estados de carga** - Se muestran indicadores mientras se cargan datos

### Cambio principal: De localStorage a API

```typescript
// Modulo 2: localStorage (sincrono)
export function getAllProperties(): Property[] {
  const data = localStorage.getItem('properties');
  return data ? JSON.parse(data) : [];
}

// Modulo 3: API REST (async)
export async function getAllProperties(): Promise<Property[]> {
  const response = await fetch('http://localhost:3002/api/properties');
  const result = await response.json();
  return result.data;
}
```

### Arquitectura

```
Frontend (React)          Backend (Express)          Database (SQLite)
     |                          |                          |
     |  GET /api/properties     |                          |
     |------------------------->|                          |
     |                          |  SELECT * FROM properties|
     |                          |------------------------->|
     |                          |<-------------------------|
     |<-------------------------|                          |
     |  { data: [...] }         |                          |
```

---

## Estructura

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api.ts          # Nuevo: llamadas a la API REST
│   │   ├── storage.ts      # Original: localStorage (no usado)
│   │   └── utils.ts
│   ├── pages/
│   │   ├── HomePage.tsx    # Modificado: async operations
│   │   ├── NewPropertyPage.tsx
│   │   └── PropertyDetailPage.tsx
│   └── components/
│       ├── PropertyCard.tsx
│       └── PropertyForm.tsx
└── package.json
```

---

## Configuracion

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+
- **Backend corriendo en puerto 3002**

### Instalacion

```bash
# Desde el directorio frontend/
npm install --legacy-peer-deps
```

> **Nota sobre --legacy-peer-deps**: Este flag es necesario porque algunas dependencias
> aun no declaran soporte para las versiones mas recientes de Vite 7 y TypeScript 5.9.

### Comandos

```bash
# Servidor de desarrollo (puerto 3001)
npm run dev

# Build de produccion
npm run build

# Type check
npm run type-check
```

---

## Uso

1. **Primero**, inicia el backend desde `../backend/`:
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Luego**, inicia el frontend:
   ```bash
   npm run dev
   ```

3. Abre http://localhost:3001 en tu navegador

---

## Notas Educativas

### Manejo de estados asincronos

```typescript
// Estado de carga para UX
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    try {
      const data = await getAllProperties();
      setProperties(data);
    } finally {
      setIsLoading(false);
    }
  }
  void loadData();
}, []);
```

### Errores de red

```typescript
// Siempre manejar errores de fetch
try {
  const result = await createProperty(data);
  if (result) navigate('/');
} catch (error) {
  alert('Error de conexion con el servidor');
}
```

---

## Licencia

Este proyecto es de uso educativo.
