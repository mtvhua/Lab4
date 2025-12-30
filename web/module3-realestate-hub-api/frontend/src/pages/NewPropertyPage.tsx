// =============================================================================
// PAGINA: NUEVA PROPIEDAD - Frontend con API REST
// =============================================================================
// Pagina para crear una nueva propiedad inmobiliaria.
//
// ## Diferencias con Module 2
// - createProperty es async (llama a la API)
// - Manejamos errores de red
// =============================================================================

import type React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyForm } from '@/components/PropertyForm';
import { createProperty } from '@/lib/api';
import type { CreatePropertyInput } from '@/types/property';

/**
 * Pagina para crear una nueva propiedad.
 *
 * ## Navegacion programatica
 * Usamos useNavigate() para redirigir despues de guardar.
 */
export function NewPropertyPage(): React.ReactElement {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Maneja el envio del formulario (async).
   *
   * ## Flujo:
   * 1. Marcar como "enviando" para deshabilitar el boton
   * 2. Crear la propiedad via API
   * 3. Redirigir a la pagina principal
   */
  const handleSubmit = async (data: CreatePropertyInput): Promise<void> => {
    setIsSubmitting(true);

    try {
      const result = await createProperty(data);
      if (result) {
        // Redirigimos al home despues de crear
        navigate('/');
      } else {
        alert('Error al guardar la propiedad. Intenta de nuevo.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      alert('Error de conexion con el servidor. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header con boton de volver */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al listado
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Nueva Propiedad</h1>
        <p className="text-muted-foreground">
          Completa el formulario para publicar una nueva propiedad
        </p>
      </div>

      {/* Formulario */}
      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
