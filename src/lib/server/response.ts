import { json }      from '@sveltejs/kit';
import type { ApiError } from '$lib/services/fetch.service';


/**
 * Convierte un ApiError lanzado por connectRequest en una Response JSON
 * con el mismo status HTTP y el body del backend, para que el cliente
 * pueda leer el `code` y actuar en consecuencia.
 */
export function forwardError( error: unknown ): Response {
    const err = error as ApiError;

    return json(
        {
            message : err.message || 'Error interno del servidor',
            code    : err.code    || 'INTERNAL_ERROR',
            data    : err.data    ?? null,
        },
        { status: err.status || 500 }
    );
}
