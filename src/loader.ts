import { PostalCodeInfo, RawPostalData } from "./types.js"

// Path to the data file, relative to the package root
//@ts-ignore
import postalCodeDataArray from "../data/postal-data.js"

/**
 * Parses a line from the GeoNames IN.txt file
 * @param line A tab-separated line from the data file
 * @returns Parsed postal code data object
 */
export function parseLine(line: string): RawPostalData | null {
  const fields = line.split("\t")
  // Validate basic format - should have at least 12 fields
  if (fields.length < 12) {
    return null
  }

  // Parse latitude and longitude as numbers
  const latitude = parseFloat(fields[9])
  const longitude = parseFloat(fields[10])

  // Skip invalid coordinates
  if (isNaN(latitude) || isNaN(longitude)) {
    return null
  }

  return {
    countryCode: fields[0],
    postalCode: fields[1],
    placeName: fields[2],
    stateName: fields[3],
    stateCode: fields[4],
    districtName: fields[5],
    districtCode: fields[6],
    subDistrictName: fields[7],
    communityCode: fields[8],
    latitude,
    longitude,
    accuracy: parseInt(fields[11], 10) || 0
  }
}

/**
 * Converts raw data to the public PostalCodeInfo format
 * @param rawData Raw data from the parsed file
 * @returns Clean PostalCodeInfo object for public use
 */
export function toPostalCodeInfo(rawData: RawPostalData): PostalCodeInfo {
  return {
    postalCode: rawData.postalCode,
    placeName: rawData.placeName,
    stateName: rawData.stateName,
    stateCode: rawData.stateCode,
    districtName: rawData.districtName,
    districtCode: rawData.districtCode,
    subDistrictName: rawData.subDistrictName,
    latitude: rawData.latitude,
    longitude: rawData.longitude
  }
}

/**
 * Loads postal code data into a Map.
 *
 * @returns {Map<string, PostalCodeInfo>} A map where the keys are postal codes and the values are PostalCodeInfo objects.
 * @throws {Error} If postal code data is not available or not in the correct format.
 */
export function loadPostalCodeData(): Map<string, PostalCodeInfo> {
  const postalMap = new Map<string, PostalCodeInfo>()
  try {
    if (postalCodeDataArray && Array.isArray(postalCodeDataArray)) {
      for (const item of postalCodeDataArray) {
        postalMap.set(item.postalCode, item)
      }
    } else {
      throw new Error("Postal code data not available. Make sure postal-data.js is generated correctly")
    }

    return postalMap
  } catch (error) {
    console.error("Error loading postal code data:", error)
    return new Map()
  }
}
