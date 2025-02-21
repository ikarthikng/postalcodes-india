/**
 * Represents information about a postal code location in India
 */
export interface PostalCodeInfo {
  /** 6-digit postal code */
  postalCode: string
  /** Place or locality name */
  placeName: string
  /** Full state/union territory name (e.g., "Andaman & Nicobar Islands") */
  stateName: string
  /** State/union territory numeric code (e.g., "01") */
  stateCode: string
  /** District name */
  districtName: string
  /** District numeric code */
  districtCode: string
  /** Sub-district/tehsil name */
  subDistrictName: string
  /** Latitude in decimal degrees */
  latitude: number
  /** Longitude in decimal degrees */
  longitude: number
}

/**
 * Internal representation of raw data from GeoNames file
 */
export interface RawPostalData {
  countryCode: string
  postalCode: string
  placeName: string
  stateName: string
  stateCode: string
  districtName: string
  districtCode: string
  subDistrictName: string
  communityCode: string // Empty in current data but kept for future compatibility
  latitude: number
  longitude: number
  accuracy: number
}

/**
 * Interface for standardized postal code lookup results
 */
export interface PostalLookupResult {
  state: string
  stateCode: string
  district: string
  subDistrict: string
  place: string
  latitude: number
  longitude: number
  isValid: boolean
}

/**
 * Interface for coordinates result
 */
export interface Coordinates {
  latitude: number
  longitude: number
  isValid: boolean
}

/**
 * Interface for state result
 */
export interface StateResult {
  state: string
  stateCode: string
  isValid: boolean
}

/**
 * Interface for district result
 */
export interface DistrictResult {
  district: string
  districtCode: string
  state: string
  stateCode: string
  isValid: boolean
}

/**
 * Interface for location hierarchy in India
 */
export interface LocationHierarchy {
  state: string
  stateCode: string
  district: string
  districtCode: string
  subDistrict: string
  place: string
  isValid: boolean
}
