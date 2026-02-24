import { z } from 'zod';
import { insertFichaSchema, fichas } from './schema';
export { insertFichaSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  fichas: {
    list: {
      method: 'GET' as const,
      path: '/api/fichas' as const,
      responses: {
        200: z.array(z.custom<typeof fichas.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/fichas/:id' as const,
      responses: {
        200: z.custom<typeof fichas.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/fichas' as const,
      input: insertFichaSchema,
      responses: {
        201: z.custom<typeof fichas.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/fichas/:id' as const,
      input: insertFichaSchema.partial(),
      responses: {
        200: z.custom<typeof fichas.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/fichas/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type FichaInput = z.infer<typeof api.fichas.create.input>;
export type FichaResponse = z.infer<typeof api.fichas.create.responses[201]>;
export type FichaUpdateInput = z.infer<typeof api.fichas.update.input>;
export type FichasListResponse = z.infer<typeof api.fichas.list.responses[200]>;
