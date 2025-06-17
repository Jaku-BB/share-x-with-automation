const API_BASE = typeof window !== 'undefined' && (window as any).location 
  ? 'http://localhost:8081' 
  : 'http://localhost:8081';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Ważne: wysyła ciasteczka sesji
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response;
}; 