import {
  PostalCodeInfo,
  PostalLookupResult,
  StateResult,
  DistrictResult,
  Coordinates,
  LocationHierarchy
} from "./types"
import { loadPostalCodeData } from "./loader"

// Load postal code data during module initialization
const postalCodeMap = loadPostalCodeData()

/**
 * Normalized postal code lookup helper
 * @param postalCode Postal code to normalize and look up
 * @returns Tuple of [normalized postal code, lookup result]
 */
function normalizedLookup(postalCode: string): [string, PostalCodeInfo | null] {
  const normalizedPostal = postalCode.trim()

  // Indian postal codes are 6 digits
  if (!/^\d{6}$/.test(normalizedPostal)) {
    return [normalizedPostal, null]
  }

  return [normalizedPostal, postalCodeMap.get(normalizedPostal) || null]
}

/**
 * Finds complete information for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns Object with location data and validity flag
 */
export function find(postalCode: string): PostalLookupResult {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      state: "",
      stateCode: "",
      district: "",
      subDistrict: "",
      place: "",
      latitude: 0,
      longitude: 0,
      isValid: false
    }
  }

  return {
    state: info.stateName,
    stateCode: info.stateCode,
    district: info.districtName,
    subDistrict: info.subDistrictName,
    place: info.placeName,
    latitude: info.latitude,
    longitude: info.longitude,
    isValid: true
  }
}

/**
 * Finds state information for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns State name and code with validity flag
 */
export function findState(postalCode: string): StateResult {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      state: "",
      stateCode: "",
      isValid: false
    }
  }

  return {
    state: info.stateName,
    stateCode: info.stateCode,
    isValid: true
  }
}

/**
 * Finds district information for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns District information with validity flag
 */
export function findDistrict(postalCode: string): DistrictResult {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      district: "",
      districtCode: "",
      state: "",
      stateCode: "",
      isValid: false
    }
  }

  return {
    district: info.districtName,
    districtCode: info.districtCode,
    state: info.stateName,
    stateCode: info.stateCode,
    isValid: true
  }
}

/**
 * Finds place name for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns Place name or empty string with validity flag
 */
export function findPlace(postalCode: string): { place: string; isValid: boolean } {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      place: "",
      isValid: false
    }
  }

  return {
    place: info.placeName,
    isValid: true
  }
}

/**
 * Finds coordinates for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns Latitude and longitude with validity flag
 */
export function findCoordinates(postalCode: string): Coordinates {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      latitude: 0,
      longitude: 0,
      isValid: false
    }
  }

  return {
    latitude: info.latitude,
    longitude: info.longitude,
    isValid: true
  }
}

/**
 * Finds location hierarchy for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns Complete location hierarchy with validity flag
 */
export function findHierarchy(postalCode: string): LocationHierarchy {
  const [normalized, info] = normalizedLookup(postalCode)

  if (!info) {
    return {
      state: "",
      stateCode: "",
      district: "",
      districtCode: "",
      subDistrict: "",
      place: "",
      isValid: false
    }
  }

  return {
    state: info.stateName,
    stateCode: info.stateCode,
    district: info.districtName,
    districtCode: info.districtCode,
    subDistrict: info.subDistrictName,
    place: info.placeName,
    isValid: true
  }
}

/**
 * Finds all postal codes for a given place and state
 * @param place Place name
 * @param stateCode State code
 * @returns Array of matching postal codes with their information
 */
export function findByPlace(place: string, stateCode: string): PostalCodeInfo[] {
  if (!place || !stateCode) {
    return []
  }

  const normalizedPlace = place.trim().toLowerCase()
  const normalizedState = stateCode.trim()

  return Array.from(postalCodeMap.values()).filter(
    (info) => info.placeName.toLowerCase() === normalizedPlace && info.stateCode === normalizedState
  )
}

/**
 * Find all postal codes in a given district
 * @param districtName District name
 * @param stateCode State code
 * @returns Array of matching postal codes with their information
 */
export function findByDistrict(districtName: string, stateCode: string): PostalCodeInfo[] {
  if (!districtName || !stateCode) {
    return []
  }

  const normalizedDistrict = districtName.trim().toLowerCase()
  const normalizedState = stateCode.trim()

  return Array.from(postalCodeMap.values()).filter(
    (info) => info.districtName.toLowerCase() === normalizedDistrict && info.stateCode === normalizedState
  )
}

/**
 * Find postal codes within a radius of a given location
 * @param latitude Center point latitude
 * @param longitude Center point longitude
 * @param radiusKm Radius in kilometers
 * @returns Array of postal codes within the radius, sorted by distance
 */
export function findByRadius(latitude: number, longitude: number, radiusKm: number): PostalCodeInfo[] {
  if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm) || radiusKm <= 0) {
    return []
  }

  const results: Array<PostalCodeInfo & { distance: number }> = []

  postalCodeMap.forEach((info) => {
    const distance = calculateDistance(latitude, longitude, info.latitude, info.longitude)

    if (distance <= radiusKm) {
      results.push({
        ...info,
        distance
      })
    }
  })

  // Sort by distance from center point
  return results.sort((a, b) => a.distance - b.distance).map(({ distance, ...rest }) => rest)
}

/**
 * Calculates distance between two coordinate points using the Haversine formula
 * @param lat1 First point latitude
 * @param lon1 First point longitude
 * @param lat2 Second point latitude
 * @param lon2 Second point longitude
 * @returns Distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Earth's radius in kilometers
  const earthRadius = 6371

  // Convert to radians
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}

/**
 * Converts degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Returns all states with their codes and names
 * @returns Array of state objects with code and name
 */
export function getStates(): Array<{ code: string; name: string }> {
  const statesMap = new Map<string, string>()

  postalCodeMap.forEach((info) => {
    if (!statesMap.has(info.stateCode)) {
      statesMap.set(info.stateCode, info.stateName)
    }
  })

  return Array.from(statesMap.entries()).map(([code, name]) => ({ code, name }))
}

// Export types
export { PostalCodeInfo }

// Public API
export default {
  find,
  findState,
  findDistrict,
  findPlace,
  findCoordinates,
  findHierarchy,
  findByPlace,
  findByDistrict,
  findByRadius,
  getStates
}
