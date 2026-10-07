import { apiClient } from "@/services/apiClient"

export interface CropRecommendationRequest {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
}

export interface CropRecommendationResponse {
  recommended_crop: string
}

export async function getCropRecommendation(
  data: CropRecommendationRequest,
): Promise<CropRecommendationResponse> {
  return apiClient.post<CropRecommendationResponse>(
    "/crop-recommendation/predict",
    data,
  )
}
