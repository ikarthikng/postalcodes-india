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
} from "./index"

describe("Indian Postal Code Lookup", () => {
  // Test postal code validation
  describe("Input validation", () => {
    test("should reject invalid postal code formats", () => {
      const invalidCodes = ["12345", "1234567", "ABC123", "", "12345D"]
      invalidCodes.forEach((code) => {
        expect(find(code).isValid).toBe(false)
      })
    })

    test("should accept valid 6-digit postal codes", () => {
      // Using a known valid postal code from Andaman & Nicobar Islands
      const result = find("744301")
      expect(result.isValid).toBe(true)
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
        place: "Sawai",
        latitude: 7.5166,
        longitude: 93.6031,
        isValid: true
      })
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
  })

  // Test place lookup
  describe("Place lookup", () => {
    test("should find place information for valid postal code", () => {
      const result = findPlace("744301")
      expect(result).toEqual({
        place: "Sawai",
        isValid: true
      })
    })
  })

  // Test coordinates lookup
  describe("Coordinates lookup", () => {
    test("should find coordinates for valid postal code", () => {
      const result = findCoordinates("744301")
      expect(result).toEqual({
        latitude: 7.5166,
        longitude: 93.6031,
        isValid: true
      })
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
        place: "Sawai",
        isValid: true
      })
    })
  })

  // Test finding by place and state
  describe("Find by place and state", () => {
    test("should find postal codes for a given place and state", () => {
      const results = findByPlace("Sawai", "01")
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].placeName).toBe("Sawai")
      expect(results[0].stateCode).toBe("01")
    })

    test("should handle case-insensitive place names", () => {
      const results = findByPlace("sawai", "01")
      expect(results.length).toBeGreaterThan(0)
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

    test("should return empty array for invalid radius", () => {
      expect(findByRadius(9.1833, 92.7667, -1)).toEqual([])
      expect(findByRadius(NaN, 92.7667, 10)).toEqual([])
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
  })
})
