import { apiClient } from "@/services/apiClient"

export interface WeatherCurrent {
  temp: number
  feelslike: number
  humidity: number
  precip: number
  windspeed: number
  conditions: string
  icon: string
}

export interface WeatherDay {
  datetime: string
  tempmax: number
  tempmin: number
  precip: number
  conditions: string
}

export interface FarmWeather {
  currentConditions: WeatherCurrent
  days: WeatherDay[]
}

export function getFarmWeather(farmId: number, token?: string) {
  return apiClient.get<FarmWeather>(`/farms/${farmId}/weather`, token)
}
