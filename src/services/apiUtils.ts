const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiError {
  message?: string;
  detail?: string;
  [key: string]: any;
}

// 🔁 Utilitaire pour rafraîchir le token
async function refreshToken(): Promise<string | null> {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    const data = await res.json();

    if (res.ok && data.access) {
      localStorage.setItem('authToken', data.access);
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

// 🧠 Méthode générique
async function request<T>(
  endpoint: string,
  options: RequestInit,
  retry = true
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Si non autorisé, tente de refresh et retry
    if (response.status === 401 && retry) {
      const newToken = await refreshToken();
      if (newToken) {
        return request<T>(endpoint, options, false); // retry une seule fois
      } else {
        // Ne pas afficher "session expirée" sur les endpoints d'auth
        const isAuthEndpoint = endpoint.includes('/api/auth/');
        if (isAuthEndpoint) {
          // Pour les endpoints d'auth, on laisse l'erreur normale se propager
          return await handleResponse<T>(response);
        } else {
          // Pour les autres endpoints, on indique que la session a expiré
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          return { error: 'Session expirée. Veuillez vous reconnecter.' };
        }
      }
    }

    return await handleResponse<T>(response);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erreur réseau' };
  }
}

// 🔄 Gestion des réponses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    try {
      const errorData = await response.json() as ApiError;
      
      // Pour les erreurs de validation, on retourne l'objet complet
      // Cela permet au frontend de traiter les erreurs spécifiques par champ
      if (response.status === 400 && errorData) {
        // Si c'est un objet avec des champs d'erreur (ex: {"email": ["..."]})
        if (typeof errorData === 'object' && !errorData.message && !errorData.detail) {
          return { error: errorData };
        }
      }
      
      return { error: errorData.message || errorData.detail || 'Une erreur est survenue' };
    } catch {
      return { error: `Erreur HTTP ${response.status}` };
    }
  }

  try {
    const data = await response.json();
    return { data };
  } catch {
    return { error: 'Réponse JSON invalide' };
  }
}

// 📦 Fonctions API
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: 'GET' });
}

export async function post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'POST',
    body: formData,
    headers: {}, // ne surtout pas définir Content-Type pour FormData
  });
}

export async function put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: 'DELETE' });
}
