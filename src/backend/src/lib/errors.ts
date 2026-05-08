export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(opts: { code: string; message: string; statusCode?: number; details?: unknown }) {
    super(opts.message);
    this.name = 'AppError';
    this.code = opts.code;
    this.statusCode = opts.statusCode ?? 400;
    this.details = opts.details;
  }
}

export const NotFound = (resource: string, id?: string) =>
  new AppError({
    code: 'not_found',
    statusCode: 404,
    message: id ? `${resource} ${id} not found` : `${resource} not found`,
  });

export const Unauthorized = (message = 'Authentication required') =>
  new AppError({ code: 'unauthorized', statusCode: 401, message });

export const Forbidden = (message = 'Access denied') =>
  new AppError({ code: 'forbidden', statusCode: 403, message });

export const BadRequest = (message: string, details?: unknown) =>
  new AppError({ code: 'bad_request', statusCode: 400, message, details });

export const Conflict = (message: string) =>
  new AppError({ code: 'conflict', statusCode: 409, message });
