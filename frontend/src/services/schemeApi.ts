import { apiClient } from "@/services/apiClient"

export interface Scheme {
  id: number
  name: string
  short_name: string | null
  description: string
  category: string
  level: string
  state: string | null
  target_beneficiaries: string | null
  eligible_crops: string | null
  benefits: string | null
  eligibility: string | null
  required_documents: string | null
  application_process: string | null
  official_url: string | null
  source_name: string | null
  application_start: string | null
  application_end: string | null
  is_active: boolean
  last_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface SchemeFilters {
  search?: string
  category?: string
  level?: string
  state?: string
  active_only?: boolean
}

export function getSchemes(
  filters: SchemeFilters = {},
  token?: string,
) {
  const params = new URLSearchParams()

  if (filters.search) params.set("search", filters.search)
  if (filters.category) params.set("category", filters.category)
  if (filters.level) params.set("level", filters.level)
  if (filters.state) params.set("state", filters.state)

  if (filters.active_only !== undefined) {
    params.set("active_only", String(filters.active_only))
  }

  const query = params.toString()

  return apiClient.get<Scheme[]>(
    `/schemes${query ? `?${query}` : ""}`,
    token,
  )
}

export function getScheme(schemeId: number, token?: string) {
  return apiClient.get<Scheme>(`/schemes/${schemeId}`, token)
}
