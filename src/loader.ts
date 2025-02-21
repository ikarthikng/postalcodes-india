import fs from "fs"
import path from "path"
import { PostalCodeInfo, RawPostalData } from "./types"

// Path to the data file, relative to the package root
const DEFAULT_DATA_PATH = path.join(__dirname, "..", "data", "IN.txt")

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
 * Loads postal code data from the file
 * @param filePath Optional custom path to the data file
 * @returns Map of postal codes to their information
 */
export function loadPostalCodeData(filePath: string = DEFAULT_DATA_PATH): Map<string, PostalCodeInfo> {
  const postalMap = new Map<string, PostalCodeInfo>()
  try {
    // Read file synchronously - this happens once during initialization
    const fileContent = fs.readFileSync(filePath, "utf8")
    const lines = fileContent.split("\n")

    for (const line of lines) {
      if (!line.trim()) continue

      const rawData = parseLine(line)
      if (!rawData) continue

      // Only include Indian postal codes
      if (rawData.countryCode !== "IN") continue

      postalMap.set(rawData.postalCode, toPostalCodeInfo(rawData))
    }

    return postalMap
  } catch (error) {
    console.error("Error loading postal code data:", error)
    return new Map()
  }
}
