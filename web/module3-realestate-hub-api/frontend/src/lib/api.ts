// =============================================================================
// API SERVICE - Module 3: Frontend con API REST
// =============================================================================
// Servicio para conectar con el backend API.
//
// ## De localStorage a API REST
// Este modulo reemplaza las operaciones de localStorage del Modulo 2
// con llamadas HTTP al backend Express del Modulo 3.
//
// ## Cambios principales:
// 1. Todas las funciones son async (devuelven Promises)
// 2. Usamos fetch() para comunicarnos con el servidor
// 3. El filtrado ahora lo hace el backend, no el frontend
// =============================================================================

import type { Property, PropertyFilters, CreatePropertyInput } from '@/types/property';

// URL base del backend API
const API_BASE_URL = 'http://localhost:3002/api';

// =============================================================================
// TIPOS DE RESPUESTA API
// =============================================================================

interface ApiResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// =============================================================================
// OPERACIONES CRUD
// =============================================================================

/**
 * Obtiene todas las propiedades desde la API.
 *
 * @param filters - Filtros opcionales para la busqueda
 * @returns Promise con array de propiedades
 */
export async function getAllProperties(filters?: PropertyFilters): Promise<Property[]> {
  try {
    // Construir query params desde los filtros
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.propertyType) params.append('propertyType', filters.propertyType);
    if (filters?.operationType) params.append('operationType', filters.operationType);
    if (filters?.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters?.minBedrooms !== undefined) params.append('minBedrooms', String(filters.minBedrooms));
    if (filters?.city) params.append('city', filters.city);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    const result: ApiResult<Property[]> = await response.json();

    if (!result.success) {
      console.error('Error al obtener propiedades:', result.error.message);
      return [];
    }

    return result.data;
  } catch (error) {
    console.error('Error de conexion con la API:', error);
    return [];
  }
}

/**
 * Obtiene una propiedad por su ID.
 *
 * @param id - ID de la propiedad
 * @returns Promise con la propiedad o undefined si no existe
 */
export async function getPropertyById(id: string): Promise<Property | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);

    if (response.status === 404) {
      return undefined;
    }

    const result: ApiResult<Property> = await response.json();

    if (!result.success) {
      console.error('Error al obtener propiedad:', result.error.message);
      return undefined;
    }

    return result.data;
  } catch (error) {
    console.error('Error de conexion con la API:', error);
    return undefined;
  }
}

/**
 * Crea una nueva propiedad.
 *
 * @param input - Datos de la nueva propiedad
 * @returns Promise con la propiedad creada o null si hay error
 */
export async function createProperty(input: CreatePropertyInput): Promise<Property | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const result: ApiResult<Property> = await response.json();

    if (!result.success) {
      console.error('Error al crear propiedad:', result.error.message);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error de conexion con la API:', error);
    return null;
  }
}

/**
 * Actualiza una propiedad existente.
 *
 * @param id - ID de la propiedad a actualizar
 * @param input - Datos a actualizar
 * @returns Promise con la propiedad actualizada o null si no existe
 */
export async function updateProperty(
  id: string,
  input: Partial<CreatePropertyInput>
): Promise<Property | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (response.status === 404) {
      return null;
    }

    const result: ApiResult<Property> = await response.json();

    if (!result.success) {
      console.error('Error al actualizar propiedad:', result.error.message);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Error de conexion con la API:', error);
    return null;
  }
}

/**
 * Elimina una propiedad.
 *
 * @param id - ID de la propiedad a eliminar
 * @returns Promise con true si se elimino, false si no existia
 */
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      return false;
    }

    const result: ApiResult<{ message: string }> = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error de conexion con la API:', error);
    return false;
  }
}

// =============================================================================
// ALIAS PARA COMPATIBILIDAD
// =============================================================================
// Estas funciones mantienen compatibilidad con el codigo existente
// que usaba filterProperties y initializeWithSampleData

/**
 * Filtra propiedades usando la API.
 * Nota: El filtrado ahora lo hace el backend.
 */
export async function filterProperties(filters: PropertyFilters): Promise<Property[]> {
  return getAllProperties(filters);
}

/**
 * Ya no es necesario inicializar datos de ejemplo.
 * El backend tiene su propia base de datos con seed.
 */
export function initializeWithSampleData(): void {
  // No-op: El backend ya tiene datos sembrados
  console.log('Conectando con API backend...');
}
