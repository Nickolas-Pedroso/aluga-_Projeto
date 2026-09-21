const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  products: {
    list: () => request('/products'),
    create: (data: unknown) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number | string, data: unknown) => request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number | string) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  clients: {
    list: () => request('/clients'),
    create: (data: unknown) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number | string, data: unknown) => request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number | string) => request(`/clients/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: () => request('/orders'),
    create: (data: unknown) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  },
  uploads: {
    remote: (sourceUrl: string, fileName: string) => request('/uploads/remote', { method: 'POST', body: JSON.stringify({ sourceUrl, fileName }) }),
    file: (fileName: string, contentType: string, data: string) => request('/uploads', { method: 'POST', body: JSON.stringify({ fileName, contentType, data }) }),
  },
}
