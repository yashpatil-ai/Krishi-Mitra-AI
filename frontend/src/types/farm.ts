export interface Farm {
  id: number
  name: string
  area_acres: number

  village: string
  taluka: string
  district: string
  state: string

  pincode?: string | null
  latitude?: number | null
  longitude?: number | null

  soil_type?: string | null
  irrigation_type?: string | null
  water_source?: string | null

  created_at: string
  updated_at: string
}

export interface FarmCreateInput {
  name: string
  area_acres: number

  village: string
  taluka: string
  district: string
  state: string

  pincode?: string
  latitude?: number
  longitude?: number

  soil_type?: string
  irrigation_type?: string
  water_source?: string
}

export interface FarmUpdateInput {
  name?: string
  area_acres?: number

  village?: string
  taluka?: string
  district?: string
  state?: string

  pincode?: string
  latitude?: number
  longitude?: number

  soil_type?: string
  irrigation_type?: string
  water_source?: string
}