import { getAccessToken } from "@/lib/auth"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api"

interface ApiRequestOptions extends RequestInit {
  token?: string
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options

  const accessToken = token ?? getAccessToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()

    throw new Error(
      errorBody || `API request failed with status ${response.status}`,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get<T>(endpoint: string, token?: string) {
    return apiRequest<T>(endpoint, { method: "GET", token })
  },

  post<T>(endpoint: string, body: unknown, token?: string) {
    return apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    })
  },

  put<T>(endpoint: string, body: unknown, token?: string) {
    return apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    })
  },

  patch<T>(endpoint: string, body: unknown, token?: string) {
    return apiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      token,
    })
  },

  delete<T>(endpoint: string, token?: string) {
    return apiRequest<T>(endpoint, {
      method: "DELETE",
      token,
    })
  },
}