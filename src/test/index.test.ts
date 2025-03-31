import {
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
} from "../index.js"

describe("Indian Postal Code Lookup", () => {
  // Test postal code validation
  describe("Input validation", () => {
    test("should reject invalid postal code formats", () => {
      const invalidCodes = ["12345", "1234567", "ABC123", "", "12345D", " ", null, undefined]
      invalidCodes.forEach((code) => {
        // @ts-ignore - Testing invalid inputs intentionally
        expect(find(code).isValid).toBe(false)
      })
    })

    test("should handle whitespace in postal codes", () => {
      expect(find(" 744301 ").isValid).toBe(true)
      expect(find("\t744301\n").isValid).toBe(true)
    })

    test("should accept valid 6-digit postal codes", () => {
      // Testing with postal codes from different states
      const validCodes = ["744301", "110001", "400001", "700001", "600001"]
      validCodes.forEach((code) => {
        expect(find(code).isValid).toBe(true)
      })
    })
  })

  // Test basic lookup functionality
  describe("Basic lookups", () => {
    test("should find complete information for a valid postal code", () => {
      const result = find("744301")
      expect(result).toEqual({
        state: "Andaman & Nicobar Islands",
        stateCode: "01",
        district: "Nicobar",
        subDistrict: "Carnicobar",
        place: "Carnicobar",
        latitude: 9.1833,
        longitude: 92.7667,
        isValid: true
      })
    })

    test("should find Delhi postal code correctly", () => {
      const result = find("110001")
      expect(result.isValid).toBe(true)
      expect(result.state).toBe("Delhi")
    })

    test("should find Mumbai postal code correctly", () => {
      const result = find("400001")
      expect(result.isValid).toBe(true)
      expect(result.district).toMatch(/Mumbai|Bombay/i) // Account for either name
    })

    test("should return empty results for invalid postal code", () => {
      const result = find("999999")
      expect(result).toEqual({
        state: "",
        stateCode: "",
        district: "",
        subDistrict: "",
        place: "",
        latitude: 0,
        longitude: 0,
        isValid: false
      })
    })
  })

  // Test state lookup
  describe("State lookup", () => {
    test("should find state information for valid postal code", () => {
      const result = findState("744301")
      expect(result).toEqual({
        state: "Andaman & Nicobar Islands",
        stateCode: "01",
        isValid: true
      })
    })

    test("should return invalid state for non-existent postal code", () => {
      const result = findState("999999")
      expect(result.isValid).toBe(false)
      expect(result.state).toBe("")
      expect(result.stateCode).toBe("")
    })

    test("should find state information for multiple major cities", () => {
      // Delhi
      expect(findState("110001").state).toBe("Delhi")

      // Mumbai, Maharashtra
      expect(findState("400001").state).toBe("Maharashtra")

      // Kolkata, West Bengal
      expect(findState("700001").state).toBe("West Bengal")

      // Chennai, Tamil Nadu
      expect(findState("600001").state).toBe("Tamil Nadu")

      // Bengaluru, Karnataka
      expect(findState("560001").state).toBe("Karnataka")
    })
  })

  // Test district lookup
  describe("District lookup", () => {
    test("should find district information for valid postal code", () => {
      const result = findDistrict("744301")
      expect(result).toEqual({
        district: "Nicobar",
        districtCode: "638",
        state: "Andaman & Nicobar Islands",
        stateCode: "01",
        isValid: true
      })
    })

    test("should handle postal code with leading/trailing spaces", () => {
      const result = findDistrict(" 744301 ")
      expect(result.isValid).toBe(true)
      expect(result.district).toBe("Nicobar")
    })
  })

  // Test place lookup
  describe("Place lookup", () => {
    test("should find place information for valid postal code", () => {
      const result = findPlace("744301")
      expect(result).toEqual({
        place: "Carnicobar",
        isValid: true
      })
    })

    test("should handle multiple postal codes for the same place", () => {
      // Find postal codes for Sawai
      const postalCodes = findByPlace("Sawai", "01")

      // Make sure we get the same place name for all these postal codes
      for (const postalCode of postalCodes.map((pc) => pc.postalCode)) {
        const result = findPlace(postalCode)
        expect(result.place).toBe("Sawai")
        expect(result.isValid).toBe(true)
      }
    })
  })

  // Test coordinates lookup
  describe("Coordinates lookup", () => {
    test("should find coordinates for valid postal code", () => {
      const result = findCoordinates("744301")
      expect(result).toEqual({
        latitude: 9.1833,
        longitude: 92.7667,
        isValid: true
      })
    })

    test("should return zero coordinates for invalid postal code", () => {
      const result = findCoordinates("999999")
      expect(result).toEqual({
        latitude: 0,
        longitude: 0,
        isValid: false
      })
    })

    test("major cities should have reasonable coordinates", () => {
      // Delhi should be roughly around 28.6N, 77.2E
      const delhi = findCoordinates("110001")
      expect(delhi.latitude).toBeGreaterThan(28)
      expect(delhi.latitude).toBeLessThan(29)
      expect(delhi.longitude).toBeGreaterThan(77)
      expect(delhi.longitude).toBeLessThan(78)

      // Mumbai should be roughly around 19.0N, 72.8E
      const mumbai = findCoordinates("400001")
      expect(mumbai.latitude).toBeGreaterThan(18)
      expect(mumbai.latitude).toBeLessThan(20)
      expect(mumbai.longitude).toBeGreaterThan(72)
      expect(mumbai.longitude).toBeLessThan(73)
    })
  })

  // Test hierarchy lookup
  describe("Hierarchy lookup", () => {
    test("should find complete hierarchy for valid postal code", () => {
      const result = findHierarchy("744301")
      expect(result).toEqual({
        state: "Andaman & Nicobar Islands",
        stateCode: "01",
        district: "Nicobar",
        districtCode: "638",
        subDistrict: "Carnicobar",
        place: "Carnicobar",
        isValid: true
      })
    })

    test("should verify hierarchical relationship in results", () => {
      // Get results for Delhi
      const delhiResult = findHierarchy("110001")

      // Verify state -> district -> subdistrict -> place relationship
      expect(delhiResult.isValid).toBe(true)
      expect(delhiResult.state).toBe("Delhi")

      // The district should be a subdivision of Delhi
      expect(delhiResult.district).toBeTruthy()

      // The subdistrict should be a subdivision of the district
      expect(delhiResult.subDistrict).toBeTruthy()

      // The place should be the most specific location
      expect(delhiResult.place).toBeTruthy()
    })
  })

  // Test finding by place and state
  describe("Find by place and state", () => {
    test("should find postal codes for a given place and state", () => {
      const results = findByPlace("Carnicobar", "01")
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].placeName).toBe("Carnicobar")
      expect(results[0].stateCode).toBe("01")
    })

    test("should handle case-insensitive place names", () => {
      const results = findByPlace("carnicobar", "01")
      expect(results.length).toBeGreaterThan(0)
    })

    test("should return empty array for invalid inputs", () => {
      expect(findByPlace("", "01")).toEqual([])
      expect(findByPlace("Sawai", "")).toEqual([])
      expect(findByPlace("", "")).toEqual([])
      // @ts-ignore - Testing invalid inputs intentionally
      expect(findByPlace(null, null)).toEqual([])
    })

    test("should handle place names with different capitalization", () => {
      // Original "Sawai"
      const resultsSawai = findByPlace("Sawai", "01")

      // Various capitalizations
      const resultsSAWAI = findByPlace("SAWAI", "01")
      const resultssawai = findByPlace("sawai", "01")
      const resultsSaWaI = findByPlace("SaWaI", "01")

      // Should return same results regardless of case
      expect(resultsSAWAI.length).toBe(resultsSawai.length)
      expect(resultssawai.length).toBe(resultsSawai.length)
      expect(resultsSaWaI.length).toBe(resultsSawai.length)
    })
  })

  // Test finding by district
  describe("Find by district", () => {
    test("should find postal codes for a given district and state", () => {
      const results = findByDistrict("Nicobar", "01")
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].districtName).toBe("Nicobar")
      expect(results[0].stateCode).toBe("01")
    })

    test("should return empty array for non-existent district", () => {
      const results = findByDistrict("NonExistentDistrict", "01")
      expect(results).toEqual([])
    })

    test("should return empty array for invalid inputs", () => {
      expect(findByDistrict("", "01")).toEqual([])
      expect(findByDistrict("Nicobar", "")).toEqual([])
      // @ts-ignore - Testing invalid inputs intentionally
      expect(findByDistrict(null, undefined)).toEqual([])
    })

    test("should handle district names with different capitalization", () => {
      // Original "Nicobar"
      const resultsNicobar = findByDistrict("Nicobar", "01")

      // Various capitalizations
      const resultsNICOBAR = findByDistrict("NICOBAR", "01")
      const resultsnicobar = findByDistrict("nicobar", "01")

      // Should return same results regardless of case
      expect(resultsNICOBAR.length).toBe(resultsNicobar.length)
      expect(resultsnicobar.length).toBe(resultsNicobar.length)
    })
  })

  // Test radius search
  describe("Radius search", () => {
    test("should find postal codes within given radius", () => {
      const results = findByRadius(9.1833, 92.7667, 10) // 10km radius from Carnicobar
      expect(results.length).toBeGreaterThan(0)
      // First result should be the center point or very close to it
      expect(results[0].latitude).toBeCloseTo(9.1833, 1)
      expect(results[0].longitude).toBeCloseTo(92.7667, 1)
    })

    test("should return more results with larger radius", () => {
      const smallRadius = findByRadius(9.1833, 92.7667, 5)
      const largeRadius = findByRadius(9.1833, 92.7667, 50)

      // Larger radius should return at least as many results as smaller radius
      expect(largeRadius.length).toBeGreaterThanOrEqual(smallRadius.length)
    })

    test("should return results in order of increasing distance", () => {
      const results = findByRadius(9.1833, 92.7667, 100)

      if (results.length >= 2) {
        // Calculate distances from center for first and second result
        const dist1 = calculateDistance(9.1833, 92.7667, results[0].latitude, results[0].longitude)
        const dist2 = calculateDistance(9.1833, 92.7667, results[1].latitude, results[1].longitude)

        // First result should be closer than or equal to second result
        expect(dist1).toBeLessThanOrEqual(dist2)
      }
    })

    test("should return empty array for invalid radius", () => {
      expect(findByRadius(9.1833, 92.7667, -1)).toEqual([])
      expect(findByRadius(NaN, 92.7667, 10)).toEqual([])
      expect(findByRadius(9.1833, NaN, 10)).toEqual([])
      expect(findByRadius(9.1833, 92.7667, NaN)).toEqual([])
    })
  })

  // Test states list
  describe("States list", () => {
    test("should return list of states", () => {
      const states = getStates()
      expect(states.length).toBeGreaterThan(0)
      expect(states[0]).toHaveProperty("code")
      expect(states[0]).toHaveProperty("name")
    })

    test("should not have duplicate states", () => {
      const states = getStates()
      const codes = new Set(states.map((s) => s.code))
      expect(codes.size).toBe(states.length)
    })

    test("should contain all major states and union territories", () => {
      const states = getStates()
      const stateNames = states.map((s) => s.name)

      // Check for some major states
      expect(stateNames).toContain("Maharashtra")
      expect(stateNames).toContain("Delhi")
      expect(stateNames).toContain("Tamil Nadu")
      expect(stateNames).toContain("Karnataka")
      expect(stateNames).toContain("West Bengal")

      // Check for some union territories
      expect(stateNames).toContain("Andaman & Nicobar Islands")
      expect(stateNames).toContain("Chandigarh")
    })

    test("should return at least 28 states and 7 union territories", () => {
      const states = getStates()
      expect(states.length).toBeGreaterThanOrEqual(35)
    })
  })
})

// Helper function to calculate distance between coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180
  const earthRadius = 6371 // km

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadius * c
}
