import { useMutation } from "@tanstack/react-query"
import {
  getCropRecommendation,
  type CropRecommendationRequest,
} from "@/services/cropRecommendationApi"

export function useCropRecommendation() {
  return useMutation({
    mutationFn: (data: CropRecommendationRequest) =>
      getCropRecommendation(data),
  })
}
