// =============================================================================
// COMPONENTE EVENT FORM - Module 4: Event Pass
// =============================================================================
// Formulario para crear/editar eventos usando Server Actions.
//
// ## 'use client'
// Este componente DEBE ser un Client Component porque:
// 1. Usa useActionState (hook de React 19)
// 2. Usa useFormStatus para estados de carga
// 3. Maneja interactividad del formulario
//
// ## useActionState (React 19)
// Nuevo hook que reemplaza el patrón anterior de useFormState.
// Maneja automáticamente:
// - Estado del formulario
// - Errores de validación
// - Estados pendientes
// =============================================================================

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createEventAction } from '@/actions/eventActions';
import { EVENT_CATEGORIES, EVENT_STATUSES, CATEGORY_LABELS, STATUS_LABELS } from '@/types/event';
import type { FormState } from '@/types/event';

/**
 * Estado inicial del formulario.
 */
const initialState: FormState = {
  success: false,
  message: '',
};

/**
 * Botón de submit con estado de carga.
 *
 * ## useFormStatus
 * Hook de React DOM que proporciona el estado del formulario padre.
 * Debe usarse dentro de un <form> que use una Server Action.
 */
function SubmitButton(): React.ReactElement {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Creando evento...' : 'Crear Evento'}
    </Button>
  );
}

/**
 * Componente de error para campos.
 */
function FieldError({ errors }: { errors?: string[] }): React.ReactElement | null {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mt-1 text-sm text-destructive">
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
}

/**
 * Formulario para crear eventos.
 *
 * ## Arquitectura
 * 1. El formulario usa la action directamente (no onSubmit)
 * 2. useActionState maneja el estado entre submits
 * 3. Los errores se muestran por campo
 * 4. El botón muestra estado de carga automáticamente
 */
export function EventForm(): React.ReactElement {
  /**
   * useActionState conecta una Server Action con estado local.
   *
   * @param action - La Server Action a ejecutar
   * @param initialState - Estado inicial
   * @returns [state, formAction] - Estado actual y action modificada
   */
  const [state, formAction] = useActionState(createEventAction, initialState);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Crear Nuevo Evento</CardTitle>
        <CardDescription>
          Completa el formulario para publicar tu evento. Los campos marcados con * son
          obligatorios.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Mensaje de error general */}
        {!state.success && state.message && (
          <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
            <p>{state.message}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>

            {/* Titulo */}
            <div className="space-y-2">
              <Label htmlFor="title">Titulo del evento *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Conferencia de Desarrollo Web 2025"
                defaultValue={state.values?.title}
                required
              />
              <FieldError errors={state.errors?.title} />
            </div>

            {/* Descripcion */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripcion *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe tu evento en detalle (minimo 20 caracteres)"
                defaultValue={state.values?.description}
                rows={4}
                required
              />
              <FieldError errors={state.errors?.description} />
            </div>

            {/* Categoria y Estado */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select name="category" defaultValue={state.values?.category} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={state.errors?.category} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select name="status" defaultValue={state.values?.status ?? 'publicado'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={state.errors?.status} />
              </div>
            </div>
          </div>

          {/* Fecha y ubicacion */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fecha y Ubicacion</h3>

            {/* Fechas */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de inicio *</Label>
                <Input id="date" name="date" type="datetime-local" defaultValue={state.values?.date} required />
                <FieldError errors={state.errors?.date} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input id="endDate" name="endDate" type="datetime-local" defaultValue={state.values?.endDate} />
                <FieldError errors={state.errors?.endDate} />
              </div>
            </div>

            {/* Ubicacion */}
            <div className="space-y-2">
              <Label htmlFor="location">Lugar *</Label>
              <Input id="location" name="location" placeholder="Ej: Centro de Convenciones" defaultValue={state.values?.location} required />
              <FieldError errors={state.errors?.location} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Direccion completa *</Label>
              <Input
                id="address"
                name="address"
                placeholder="Ej: Calle Principal 123, 28001 Madrid"
                defaultValue={state.values?.address}
                required
              />
              <FieldError errors={state.errors?.address} />
            </div>
          </div>

          {/* Capacidad y precio */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Capacidad y Precio</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidad maxima *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="100"
                  defaultValue={state.values?.capacity}
                  required
                />
                <FieldError errors={state.errors?.capacity} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0 para eventos gratuitos"
                  defaultValue={state.values?.price}
                  required
                />
                <FieldError errors={state.errors?.price} />
              </div>
            </div>
          </div>

          {/* Imagen y tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Imagen y Etiquetas</h3>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                defaultValue={state.values?.imageUrl}
              />
              <FieldError errors={state.errors?.imageUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
              <Input id="tags" name="tags" placeholder="react, javascript, conferencia" defaultValue={state.values?.tags} />
              <p className="text-sm text-muted-foreground">Maximo 5 etiquetas</p>
              <FieldError errors={state.errors?.tags} />
            </div>
          </div>

          {/* Informacion del organizador */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informacion del Organizador</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organizerName">Nombre del organizador *</Label>
                <Input id="organizerName" name="organizerName" placeholder="Tu nombre o empresa" defaultValue={state.values?.organizerName} required />
                <FieldError errors={state.errors?.organizerName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizerEmail">Email del organizador *</Label>
                <Input
                  id="organizerEmail"
                  name="organizerEmail"
                  type="email"
                  placeholder="contacto@ejemplo.com"
                  defaultValue={state.values?.organizerEmail}
                  required
                />
                <FieldError errors={state.errors?.organizerEmail} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
