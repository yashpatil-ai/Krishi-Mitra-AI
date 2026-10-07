import { useMutation } from "@tanstack/react-query"
import {
  getFertilizerRecommendation,
  type FertilizerRecommendationRequest,
} from "@/services/fertilizerApi"

export function useFertilizerRecommendation() {
  return useMutation({
    mutationFn: (data: FertilizerRecommendationRequest) =>
      getFertilizerRecommendation(data),
  })
}
