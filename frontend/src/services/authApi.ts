import { apiClient } from "@/services/apiClient"
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "@/types/auth"

export function registerUser(data: RegisterRequest) {
  return apiClient.post<TokenResponse>("/auth/register", data)
}

export function loginUser(data: LoginRequest) {
  return apiClient.post<TokenResponse>("/auth/login", data)
}