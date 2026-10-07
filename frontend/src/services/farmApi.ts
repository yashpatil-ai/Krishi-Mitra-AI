import { apiClient } from "@/services/apiClient"
import type {
  Farm,
  FarmCreateInput,
  FarmUpdateInput,
} from "@/types/farm"

export function getFarms(token?: string) {
  return apiClient.get<Farm[]>("/farms", token)
}

export function getFarm(farmId: number, token?: string) {
  return apiClient.get<Farm>(`/farms/${farmId}`, token)
}

export function createFarm(data: FarmCreateInput, token?: string) {
  return apiClient.post<Farm>("/farms", data, token)
}

export function updateFarm(
  farmId: number,
  data: FarmUpdateInput,
  token?: string,
) {
  return apiClient.put<Farm>(`/farms/${farmId}`, data, token)
}

export function deleteFarm(farmId: number, token?: string) {
  return apiClient.delete<void>(`/farms/${farmId}`, token)
}