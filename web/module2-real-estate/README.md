# Módulo 2 - Real Estate React

## Frontend Single Page Application

> Portal inmobiliario con React 19, Zod, React Hook Form, Tailwind CSS y Shadcn UI.

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
| Lucide React | 0.469.0 |

> Ver [TECH_STACK.md](./TECH_STACK.md) para detalles completos.

---

## Descripción del Proyecto

**Real Estate React** es una aplicación web de bienes raíces que permite listar, buscar y gestionar propiedades inmobiliarias. El proyecto enseña conceptos fundamentales de desarrollo frontend moderno con React 19:

1. **Componentes React 19** con hooks modernos
2. **Formularios validados** con Zod + React Hook Form
3. **Shadcn UI** para componentes accesibles y estilizados
4. **React Router** para navegación cliente
5. **localStorage** para persistencia sin backend

---

## Contexto Pedagógico

Este módulo cubre los siguientes conceptos:

### 1. React 19 Core y Hooks

```tsx
// useState para estado local
const [properties, setProperties] = useState<Property[]>([]);

// useCallback para memorizar funciones
const loadProperties = useCallback(() => {
  const filtered = filterProperties(filters);
  setProperties(filtered);
}, [filters]);

// useEffect para efectos secundarios
useEffect(() => {
  loadProperties();
}, [loadProperties]);
```

### 2. Formularios con Zod + React Hook Form

```tsx
// Esquema de validación con Zod
const propertySchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
});

// Hook del formulario
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(propertySchema),
});
```

### 3. Shadcn UI y Componentes Reutilizables

```tsx
// Componentes Shadcn importados directamente
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Uso con variantes
<Button variant="destructive" size="lg">Eliminar</Button>
```

### 4. Routing con React Router

```tsx
// Definición de rutas
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/property/:id" element={<PropertyDetailPage />} />
</Routes>

// Navegación programática
const navigate = useNavigate();
navigate('/property/123');

// Parámetros de URL
const { id } = useParams<{ id: string }>();
```

### 5. Persistencia con localStorage

```tsx
// Guardando datos
localStorage.setItem('properties', JSON.stringify(properties));

// Leyendo datos
const data = localStorage.getItem('properties');
const properties = data ? JSON.parse(data) : [];
```

---

## Estructura del Proyecto

```
module2-real-estate/
├── index.html                 # Punto de entrada HTML
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
├── vite.config.ts             # Configuración Vite + Tailwind v4
├── eslint.config.js           # Reglas de linting
├── .prettierrc                # Formato de código
├── .gitignore                 # Archivos ignorados
├── README.md                  # Esta documentación
├── TECH_STACK.md              # Versiones de dependencias
└── src/
    ├── main.tsx               # Punto de entrada React
    ├── App.tsx                # Componente raíz con routing
    ├── index.css              # Estilos globales + Shadcn variables
    ├── vite-env.d.ts          # Tipos de Vite
    ├── components/
    │   ├── ui/                # Componentes Shadcn UI
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── select.tsx
    │   │   └── textarea.tsx
    │   ├── PropertyCard.tsx   # Tarjeta de propiedad
    │   └── PropertyForm.tsx   # Formulario con validación
    ├── pages/
    │   ├── HomePage.tsx       # Lista con filtros
    │   ├── NewPropertyPage.tsx # Crear propiedad
    │   └── PropertyDetailPage.tsx # Detalle
    ├── lib/
    │   ├── utils.ts           # Utilidades (cn, formatters)
    │   └── storage.ts         # Operaciones localStorage
    ├── types/
    │   └── property.ts        # Tipos y esquemas Zod
    └── data/
        └── sampleProperties.ts # Datos de ejemplo
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITECTURA                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌────────────────────────────────────────────────────────────────────┐   │
│    │                           App.tsx                                   │   │
│    │                    (Router + Layout)                                │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│          ┌─────────────────────────┼─────────────────────────┐              │
│          ▼                         ▼                         ▼              │
│    ┌───────────┐            ┌───────────┐            ┌───────────┐         │
│    │ HomePage  │            │NewProperty│            │ Property  │         │
│    │           │            │   Page    │            │DetailPage │         │
│    └─────┬─────┘            └─────┬─────┘            └─────┬─────┘         │
│          │                        │                        │                │
│          ▼                        ▼                        │                │
│    ┌───────────┐            ┌───────────┐                  │                │
│    │ Property  │            │ Property  │                  │                │
│    │   Card    │            │   Form    │                  │                │
│    └───────────┘            └─────┬─────┘                  │                │
│                                   │                        │                │
│                                   ▼                        │                │
│                             ┌───────────┐                  │                │
│                             │   Zod     │                  │                │
│                             │ Validation│                  │                │
│                             └───────────┘                  │                │
│                                                            │                │
│    ┌───────────────────────────────────────────────────────┴───────────┐   │
│    │                         storage.ts                                 │   │
│    │                    (CRUD + localStorage)                           │   │
│    └───────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Conceptos Clave

### Validación con Zod

| Característica           | Zod                        | TypeScript              |
| ------------------------ | -------------------------- | ----------------------- |
| Momento de validación    | Runtime (ejecución)        | Compile time            |
| Datos de usuario         | ✅ Valida                  | ❌ No valida            |
| Mensajes de error        | ✅ Personalizables         | ❌ Solo desarrollo      |
| Inferencia de tipos      | ✅ z.infer<typeof schema>  | N/A                     |

### Shadcn UI vs Librerías Tradicionales

| Aspecto                  | Shadcn UI                  | MUI/Chakra              |
| ------------------------ | -------------------------- | ----------------------- |
| Instalación              | Copias el código           | npm install             |
| Personalización          | Control total              | Override de temas       |
| Bundle size              | Solo lo que usas           | Todo el paquete         |
| Curva de aprendizaje     | Tailwind + Radix           | API propietaria         |

---

## Configuración y Ejecución

### Prerrequisitos

- Node.js 20.19+ o 22.12+
- npm 10+

### Instalacion

```bash
# Navegar al directorio del modulo
cd web/module2-real-estate

# Instalar dependencias
npm install --legacy-peer-deps
```

> **Nota sobre --legacy-peer-deps**: Este flag es necesario porque algunas dependencias
> (como @tailwindcss/vite y typescript-eslint) aun no declaran soporte para las versiones
> mas recientes de Vite 7 y TypeScript 5.9. El flag permite instalar las dependencias
> ignorando conflictos de peer dependencies. En la practica, las dependencias funcionan
> correctamente con estas versiones.

### Comandos Disponibles

```bash
# Servidor de desarrollo (puerto 3001)
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Formatear código
npm run format

# Build de producción
npm run build

# Previsualizar build de producción
npm run preview
```

---

## Datos de Ejemplo

La aplicación incluye datos de ejemplo que se cargan automáticamente si localStorage está vacío. Incluyen:

- 6 propiedades variadas (casas, apartamentos, locales, oficinas, terrenos)
- Diferentes tipos de operación (venta y alquiler)
- Múltiples ciudades (Madrid, Barcelona, Valencia, Sevilla)
- Diversas amenidades

---

## Notas Educativas

### Componentes Controlados vs No Controlados

```tsx
// Controlado: React controla el valor
<input value={name} onChange={(e) => setName(e.target.value)} />

// No controlado: El DOM mantiene el valor (React Hook Form usa esto)
<input {...register('name')} />
```

### Patrón de Composición de Shadcn

```tsx
// Los componentes se componen como bloques
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Acciones</CardFooter>
</Card>
```

---

## Experimentos Sugeridos

1. **Favoritos**: Añade funcionalidad para marcar propiedades como favoritas
2. **Ordenamiento**: Implementa ordenar por precio, fecha, área
3. **Paginación**: Añade paginación a la lista de propiedades
4. **Modo oscuro**: Implementa toggle de tema claro/oscuro
5. **Edición**: Añade página para editar propiedades existentes

---

## Próximo Paso: Módulo 3

En el Módulo 3, reemplazaremos localStorage con una API REST real usando:
- Express.js como servidor
- Prisma ORM con SQLite
- Los mismos tipos de datos para compatibilidad

---

## Licencia

Este proyecto es de uso educativo y fue creado como material de aprendizaje.

---

## Créditos

> Este proyecto ha sido generado usando Claude Code y adaptado con fines educativos por Adrián Catalán.
