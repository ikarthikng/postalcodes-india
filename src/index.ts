import {
  PostalCodeInfo,
  PostalLookupResult,
  StateResult,
  DistrictResult,
  Coordinates,
  LocationHierarchy
} from "./types.js"
// @ts-ignore
import postalCodeDataArray from "../data/postal-data.js"

// Build the in-memory lookup during module initialization
const postalCodeMap = new Map<string, PostalCodeInfo>(
  (postalCodeDataArray as PostalCodeInfo[]).map((info) => [info.postalCode, info])
)

/**
 * Finds complete information for a postal code
 * @param postalCode 6-digit postal code to look up
 * @returns Object with location data and validity flag
 */
export function find(postalCode: string): PostalLookupResult {
  const info = postalCodeMap.get(postalCode?.trim() ?? "")

  if (!info) {
    return { state: "", stateCode: "", district: "", subDistrict: "", place: "", latitude: 0, longitude: 0, isValid: false }
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

/** Finds state name and code for a postal code */
export function findState(postalCode: string): StateResult {
  const { state, stateCode, isValid } = find(postalCode)
  return { state, stateCode, isValid }
}

/** Finds district information for a postal code */
export function findDistrict(postalCode: string): DistrictResult {
  const { district, districtCode, state, stateCode, isValid } = findHierarchy(postalCode)
  return { district, districtCode, state, stateCode, isValid }
}

/** Finds place name for a postal code */
export function findPlace(postalCode: string): { place: string; isValid: boolean } {
  const { place, isValid } = find(postalCode)
  return { place, isValid }
}

/** Finds coordinates for a postal code */
export function findCoordinates(postalCode: string): Coordinates {
  const { latitude, longitude, isValid } = find(postalCode)
  return { latitude, longitude, isValid }
}

/** Finds location hierarchy for a postal code */
export function findHierarchy(postalCode: string): LocationHierarchy {
  const info = postalCodeMap.get(postalCode?.trim() ?? "")

  if (!info) {
    return { state: "", stateCode: "", district: "", districtCode: "", subDistrict: "", place: "", isValid: false }
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

function filterBy(field: "placeName" | "districtName", value: string, stateCode: string): PostalCodeInfo[] {
  if (!value || !stateCode) {
    return []
  }

  const normalizedValue = value.trim().toLowerCase()
  const normalizedState = stateCode.trim()

  return [...postalCodeMap.values()].filter(
    (info) => info[field].toLowerCase() === normalizedValue && info.stateCode === normalizedState
  )
}

/**
 * Finds all postal codes for a given place and state
 * @param place Place name
 * @param stateCode State code
 */
export function findByPlace(place: string, stateCode: string): PostalCodeInfo[] {
  return filterBy("placeName", place, stateCode)
}

/**
 * Find all postal codes in a given district
 * @param districtName District name
 * @param stateCode State code
 */
export function findByDistrict(districtName: string, stateCode: string): PostalCodeInfo[] {
  return filterBy("districtName", districtName, stateCode)
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
