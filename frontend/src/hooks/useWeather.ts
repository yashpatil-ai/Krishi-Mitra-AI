import { useQuery } from "@tanstack/react-query"

import { getFarmWeather } from "@/services/weatherApi"

export function useFarmWeather(farmId?: number) {
  return useQuery({
    queryKey: ["farm-weather", farmId],
    queryFn: () => getFarmWeather(farmId as number),
    enabled: Boolean(farmId),
    staleTime: 10 * 60 * 1000,
  })
}
