export interface Crop {
  id: number
  farm_id: number
  name: string
  variety?: string | null
  area_acres: number
  sowing_date?: string | null
  expected_harvest_date?: string | null
  season?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface CropCreateInput {
  name: string
  variety?: string
  area_acres: number
  sowing_date?: string
  expected_harvest_date?: string
  season?: string
}

export interface CropUpdateInput {
  name?: string
  variety?: string
  area_acres?: number
  sowing_date?: string
  expected_harvest_date?: string
  season?: string
  status?: string
}