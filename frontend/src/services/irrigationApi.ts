import { apiClient } from "@/services/apiClient"

export interface Irrigation {
  id: number
  farm_id: number
  crop_id: number
  irrigation_date: string
  water_required_liters: number
  duration_minutes: number | null
  method: string | null
  status: string
  source: string
  created_at: string
  updated_at: string
}

export function getIrrigations(
  farmId: number,
  token?: string,
) {
  return apiClient.get<Irrigation[]>(
    `/farms/${farmId}/irrigations`,
    token,
  )
}

export function recommendIrrigation(
  farmId: number,
  cropId: number,
  token?: string,
) {
  return apiClient.post<Irrigation>(
    `/farms/${farmId}/irrigation/recommend/${cropId}`,
    {},
    token,
  )
}

export function deleteIrrigation(
  farmId: number,
  irrigationId: number,
  token?: string,
) {
  return apiClient.delete<void>(
    `/farms/${farmId}/irrigations/${irrigationId}`,
    token,
  )
}
