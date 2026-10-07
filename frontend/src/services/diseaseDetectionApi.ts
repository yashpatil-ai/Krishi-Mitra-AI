import { getAccessToken } from "@/lib/auth"

export interface DiseaseDetectionResponse {
  disease: string
  confidence: number
}

export async function detectDisease(
  image: File,
): Promise<DiseaseDetectionResponse> {
  const formData = new FormData()
  formData.append("image", image)

  const token = getAccessToken()

  const response = await fetch(
    "http://localhost:8000/api/disease-detection/predict",
    {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      body: formData,
    },
  )

  if (!response.ok) {
    const errorBody = await response.text()

    throw new Error(
      errorBody || `Disease detection failed with status ${response.status}`,
    )
  }

  return response.json() as Promise<DiseaseDetectionResponse>
}
