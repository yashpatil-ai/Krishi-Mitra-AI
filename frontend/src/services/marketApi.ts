import { apiClient } from "@/services/apiClient"

export interface MarketPrice {
  id: number
  state: string
  district: string | null
  market: string
  commodity: string
  variety?: string | null
  grade?: string | null
  arrival_date: string | null
  min_price: number | null
  max_price: number | null
  modal_price: number | null
  fetched_at?: string | null
}

export interface MarketFilters {
  commodity?: string
  state?: string
  district?: string
}

export function getMarketPrices(
  filters?: MarketFilters,
  token?: string,
) {
  const params = new URLSearchParams()

  if (filters?.commodity) {
    params.set("commodity", filters.commodity)
  }

  if (filters?.state) {
    params.set("state", filters.state)
  }

  if (filters?.district) {
    params.set("district", filters.district)
  }

  const query = params.toString()

  return apiClient.get<MarketPrice[]>(
    `/market/prices${query ? `?${query}` : ""}`,
    token,
  )
}
