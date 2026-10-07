import { apiClient } from "@/services/apiClient"

import type {
  Crop,
  CropCreateInput,
  CropUpdateInput,
} from "@/types/crop"

export function getCrops(
  farmId: number,
  token?: string,
) {
  return apiClient.get<Crop[]>(
    `/farms/${farmId}/crops`,
    token,
  )
}

export function getCrop(
  farmId: number,
  cropId: number,
  token?: string,
) {
  return apiClient.get<Crop>(
    `/farms/${farmId}/crops/${cropId}`,
    token,
  )
}

export function createCrop(
  farmId: number,
  data: CropCreateInput,
  token?: string,
) {
  return apiClient.post<Crop>(
    `/farms/${farmId}/crops`,
    data,
    token,
  )
}

export function updateCrop(
  farmId: number,
  cropId: number,
  data: CropUpdateInput,
  token?: string,
) {
  return apiClient.put<Crop>(
    `/farms/${farmId}/crops/${cropId}`,
    data,
    token,
  )
}

export function deleteCrop(
  farmId: number,
  cropId: number,
  token?: string,
) {
  return apiClient.delete<void>(
    `/farms/${farmId}/crops/${cropId}`,
    token,
  )
}