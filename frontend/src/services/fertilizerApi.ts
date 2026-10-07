import { getAccessToken } from "@/lib/auth"

export interface FertilizerRecommendationRequest {
  crop: string
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
}

export interface FertilizerRecommendationResponse {
  crop: string
  nitrogen_required: number
  phosphorus_required: number
  potassium_required: number
  nitrogen_status: string
  phosphorus_status: string
  potassium_status: string
  ph_status: string
  recommendations: string[]
}

export async function getFertilizerRecommendation(
  request: FertilizerRecommendationRequest,
): Promise<FertilizerRecommendationResponse> {
  const token = getAccessToken()

  const response = await fetch(
    "http://localhost:8000/api/fertilizer/recommend",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      errorBody ||
        `Fertilizer recommendation failed with status ${response.status}`,
    )
  }

  return response.json() as Promise<FertilizerRecommendationResponse>
}
