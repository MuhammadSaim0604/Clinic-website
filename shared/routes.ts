import { z } from 'zod';
import { ClinicConfigSchema, LoginSchema, UserSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: LoginSchema,
      responses: {
        200: z.object({ token: z.string(), user: UserSchema }),
        401: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: UserSchema,
        401: z.object({ message: z.string() }),
      }
    }
  },
  clinic_info: {
    info: {
      method: 'GET' as const,
      path: '/api/clinic/info' as const,
      responses: {
        200: z.object({
          clinic_id: z.string(),
          domain: z.string().optional(),
          clinic_type: z.string(),
          license_status: z.string(),
          env_locked_clinic_type: z.string().optional()
        })
      }
    }
  },
  clinic: {
    config: {
      method: 'GET' as const,
      path: '/api/clinic/config' as const,
      responses: {
        200: z.object({ clinic_type: z.string(), config: ClinicConfigSchema })
      }
    },
    save: {
      method: 'PUT' as const,
      path: '/api/clinic/config' as const,
      input: z.object({ config: ClinicConfigSchema.partial() }),
      responses: {
        200: z.object({ success: z.boolean(), config: ClinicConfigSchema })
      }
    },
    schema: {
      method: 'GET' as const,
      path: '/api/clinic/schema' as const,
      responses: {
        200: z.any() // dynamic schema JSON
      }
    },
    render: {
      method: 'GET' as const,
      path: '/api/clinic/render' as const,
      responses: {
        200: z.object({ clinic_type: z.string(), config: ClinicConfigSchema })
      }
    }
  },
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments' as const,
      responses: {
        200: z.array(z.any())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments' as const,
      input: z.any(),
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/messages' as const,
      responses: {
        200: z.array(z.any())
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: z.any(),
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  }
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
