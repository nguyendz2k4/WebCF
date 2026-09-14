export class ApiError extends Error {
  status: number;
  constructor(status: number, detail?: string) {
    super(detail ?? (status === 401 ? 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.'
      : status === 403 ? 'Bạn không có quyền thực hiện thao tác này.'
      : status === 409 ? 'Dữ liệu đã thay đổi hoặc bị trùng. Vui lòng tải lại và kiểm tra.'
      : status === 400 || status === 422 ? 'Thông tin chưa hợp lệ. Vui lòng kiểm tra các trường đã nhập.'
      : status === 429 ? 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.'
      : 'Không thể kết nối dịch vụ. Vui lòng thử lại sau.'));
    this.status = status;
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.';
}

export async function apiRequest<T = unknown>(path: string, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown; signal?: AbortSignal; idempotencyKey?: string;
} = {}): Promise<T> {
  if (!/^\/[a-z0-9/?=&_%.-]+$/i.test(path) || path.includes('..') || path.startsWith('//')) throw new ApiError(400);
  const method = options.method ?? 'GET';
  let response: Response;
  try {
    response = await fetch(`/api/backend${path}`, {
      method, credentials: 'same-origin', cache: 'no-store', redirect: 'error',
      signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(20000)]) : AbortSignal.timeout(20000),
      headers: { Accept: 'application/json', ...(method !== 'GET' ? {
        'Content-Type': 'application/json', 'X-Aura-Request': '1',
      } : {}), ...(options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}) },
      ...(method !== 'GET' ? { body: JSON.stringify(options.body ?? {}) } : {}),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(503);
  }
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/auth/') && typeof window !== 'undefined') window.dispatchEvent(new Event('aura:session-expired'));
    let detail: string | undefined;
    if ([400, 409, 422].includes(response.status)) {
      try { const value = await response.json(); if (typeof value.message === 'string' && value.message.length <= 1000) detail = value.message; } catch { }
    }
    throw new ApiError(response.status, detail);
  }
  if (response.status === 204) return undefined as T;
  if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError(502);
  try {
    const value: unknown = await response.json();
    if (value && typeof value === 'object' && 'success' in value) {
      if (value.success !== true || !('data' in value)) throw new ApiError(502);
      return value.data as T;
    }
    return value as T;
  } catch { throw new ApiError(502); }
}
