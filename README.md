# postalcodes-india

A lightweight and efficient Indian postal code lookup library with no external dependencies. Compatible with both Node.js and browser/React environments.

[![npm version](https://badge.fury.io/js/postalcodes-india.svg)](https://badge.fury.io/js/postalcodes-india.svg)
[![Tests](https://github.com/ikarthikng/postalcodes-india/actions/workflows/test-and-publish.yml/badge.svg)](https://github.com/ikarthikng/postalcodes-india/actions?query=workflow%3A"Test+and+Publish")
[![npm downloads](https://img.shields.io/npm/dm/postalcodes-india)](https://www.npmjs.com/package/postalcodes-india)
[![license](https://img.shields.io/npm/l/postalcodes-india)](https://github.com/ikarthikng/postalcodes-india/blob/master/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postalcodes-india)](https://bundlephobia.com/package/postalcodes-india)

> I try my best to monitor the required dependencies daily and publish updates to the npm package whenever changes are detected.

## 🔄 **Data Last Checked/Updated:** _13th October 2025_

## Features

- Fast in-memory postal code lookups
- Multiple lookup methods for different use cases
- Find postal codes by place, state, and district
- Find postal codes within a radius of coordinates
- Returns complete information including state, district, sub-district, and coordinates
- TypeScript support with full type definitions
- Zero runtime dependencies
- **Universal compatibility**: Works in Node.js, browsers, and React applications
- **Tree-shakable**: Import only what you need

## Why Choose postalcodes-india?

- **🚀 Zero Dependencies** - No bloat, just pure functionality
- **⚡ Lightning Fast** - In-memory lookups with instant results
- **🌐 Universal** - Same code works in Node.js, React, Next.js, and browsers
- **📦 Tiny Bundle** - Minimal impact on your bundle size
- **🔄 Always Up-to-Date** - Data checked and updated daily
- **💪 Type-Safe** - Full TypeScript support out of the box
- **🇮🇳 Complete Coverage** - All 19,000+ Indian postal codes

**Compared to alternatives:**

- Unlike API-based solutions, no rate limits or network latency
- Unlike other npm packages, we support both Node.js and browsers seamlessly
- Tree-shakable design - import only what you need

## 🚀 Try It Now

**Live Demo:** [CodeSandbox Demo](https://codesandbox.io/p/sandbox/awesome-tree-swv4kn)

**Quick Example:**

```javascript
import postalcodes from "postalcodes-india"

// One line to get complete postal code info
const info = postalcodes.find("560029")
// → { place: 'Bangalore', state: 'Karnataka', district: 'Bangalore', ... }
```

**Looking for US ZIP codes?** Check out [zipcodes-us](https://github.com/ikarthikng/zipcodes-us) 🇺🇸

## Installation

```bash
npm install postalcodes-india
```

## Usage

### In Node.js (ESM)

```javascript
import postalcodes from "postalcodes-india"

// Complete lookup with validity check
const info = postalcodes.find("560029")
console.log(info)
```

### In Node.js (CommonJS)

```javascript
const postalcodes = require("postalcodes-india")

// Complete lookup with validity check
const info = postalcodes.find("560029")
console.log(info)
```

### In React

```jsx
import React, { useState } from "react"
import postalcodes from "postalcodes-india"

function PostalCodeLookup() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)

  const handleLookup = () => {
    const info = postalcodes.find(code)
    setResult(info)
  }

  return (
    <div>
      <h2>Postal Code Lookup</h2>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter postal code" />
      <button onClick={handleLookup}>Lookup</button>

      {result && (
        <div>
          <h3>Results:</h3>
          {result.isValid ? (
            <ul>
              <li>State: {result.state}</li>
              <li>District: {result.district}</li>
              <li>Sub-District: {result.subDistrict}</li>
              <li>Place: {result.place}</li>
              <li>
                Coordinates: {result.latitude}, {result.longitude}
              </li>
            </ul>
          ) : (
            <p>Invalid postal code</p>
          )}
        </div>
      )}
    </div>
  )
}

export default PostalCodeLookup
```

### In Browser (via CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/postalcodes-india/dist/index.umd.js"></script>
<script>
  // The library is available as a global variable 'postalcodes'
  const info = postalcodes.find("110001")
  console.log(info)
</script>
```

### Tree-shaking (Import only what you need)

```javascript
import { find, findByRadius } from "postalcodes-india"

// Use specific functions without importing the entire library
const info = find("400001")
const nearby = findByRadius(19.076, 72.8777, 5) // 5km radius around Mumbai
```

## 💡 Common Use Cases

### Validate Postal Codes

```typescript
// Check if a postal code is valid
const info = postalcodes.find("560029")
if (info.isValid) {
  console.log(`Valid postal code in ${info.place}, ${info.state}`)
}
```

### Auto-Complete Location from Postal Code

```typescript
// User enters postal code, auto-fill location details
const { place, district, state } = postalcodes.find(userPostalCode)
addressForm.city.value = place
addressForm.district.value = district
addressForm.state.value = state
```

### Find All Postal Codes in a District

```typescript
// Get all postal codes for a specific district
const allBangalorePostals = postalcodes.findByDistrict("Bangalore", "29")
console.log(`Bangalore has ${allBangalorePostals.length} postal codes`)
```

### Geographic Proximity Search

```typescript
// Find postal codes within 20 kilometers of coordinates
const nearbyPostals = postalcodes.findByRadius(12.9716, 77.5946, 20)
// Use these for location-based features
```

### Display Location Hierarchy

```typescript
// Show complete location hierarchy from postal code
const hierarchy = postalcodes.findHierarchy("560029")
console.log(`${hierarchy.place}, ${hierarchy.subDistrict}, ${hierarchy.district}, ${hierarchy.state}`)
```

## Examples

```typescript
import postalcodes from "postalcodes-india"

// Complete lookup with validity check
const info = postalcodes.find("744301")
console.log(info)
/* Output:
{
  state: 'Andaman & Nicobar Islands',
  stateCode: '01',
  district: 'Nicobar',
  subDistrict: 'Carnicobar',
  place: 'Sawai',
  latitude: 7.5166,
  longitude: 93.6031,
  isValid: true
}
*/

// For invalid postal codes, returns empty values with isValid: false
const invalid = postalcodes.find("000000")
console.log(invalid)
/* Output:
{
  state: '',
  stateCode: '',
  district: '',
  subDistrict: '',
  place: '',
  latitude: 0,
  longitude: 0,
  isValid: false
}
*/

// Get just the state information
const stateInfo = postalcodes.findState("744301")
console.log(stateInfo) // { state: 'Andaman & Nicobar Islands', stateCode: '01', isValid: true }

// Get just the district information
const districtInfo = postalcodes.findDistrict("744301")
console.log(districtInfo) // { district: 'Nicobar', districtCode: '638', state: 'Andaman & Nicobar Islands', stateCode: '01', isValid: true }

// Get just the place
const placeInfo = postalcodes.findPlace("744301")
console.log(placeInfo) // { place: 'Sawai', isValid: true }

// Get just the coordinates
const coords = postalcodes.findCoordinates("744301")
console.log(coords) // { latitude: 7.5166, longitude: 93.6031, isValid: true }

// Get complete location hierarchy
const hierarchy = postalcodes.findHierarchy("744301")
console.log(hierarchy)
/* Output:
{
  state: 'Andaman & Nicobar Islands',
  stateCode: '01',
  district: 'Nicobar',
  districtCode: '638',
  subDistrict: 'Carnicobar',
  place: 'Sawai',
  isValid: true
}
*/

// Find postal codes for a place and state
const placePostals = postalcodes.findByPlace("Sawai", "01")
console.log(`Found ${placePostals.length} postal codes`)

// Find postal codes in a district
const districtPostals = postalcodes.findByDistrict("Nicobar", "01")
console.log(`Nicobar district has ${districtPostals.length} postal codes`)

// Find postal codes within 10 kilometers of coordinates
const nearby = postalcodes.findByRadius(7.5166, 93.6031, 10)
console.log(`Found ${nearby.length} postal codes within 10km radius`)

// Get all states
const states = postalcodes.getStates()
console.log(`India has ${states.length} states and union territories with postal codes`)
```

## API

`find(postalCode: string): PostalLookupResult`

Returns complete information for a postal code with an `isValid` flag. Always returns an object, even for invalid postal codes.

```typescript
interface PostalLookupResult {
  state: string // Full state/UT name
  stateCode: string // State code
  district: string // District name
  subDistrict: string // Sub-district/tehsil name
  place: string // Place name
  latitude: number // Decimal latitude
  longitude: number // Decimal longitude
  isValid: boolean // Whether the postal code exists
}

// Internal PostalCodeInfo interface used by findByPlace, findByDistrict, and findByRadius methods
interface PostalCodeInfo {
  postalCode: string // 6-digit postal code
  placeName: string // Place name
  stateName: string // Full state/UT name
  stateCode: string // State code
  districtName: string // District name
  districtCode: string // District code
  subDistrictName: string // Sub-district name
  latitude: number // Latitude in decimal degrees
  longitude: number // Longitude in decimal degrees
}
```

`findState(postalCode: string): StateResult`

Returns state information for a postal code with validity check.

```typescript
interface StateResult {
  state: string // Full state/UT name
  stateCode: string // State code
  isValid: boolean // Whether the postal code exists
}
```

`findDistrict(postalCode: string): DistrictResult`

Returns district information for a postal code with validity check.

```typescript
interface DistrictResult {
  district: string // District name
  districtCode: string // District code
  state: string // State name
  stateCode: string // State code
  isValid: boolean // Whether the postal code exists
}
```

`findPlace(postalCode: string): { place: string; isValid: boolean }`

Returns place name for a postal code with validity check.

`findCoordinates(postalCode: string): Coordinates`

Returns latitude and longitude for a postal code with validity check.

```typescript
interface Coordinates {
  latitude: number // Decimal latitude
  longitude: number // Decimal longitude
  isValid: boolean // Whether the postal code exists
}
```

`findHierarchy(postalCode: string): LocationHierarchy`

Returns complete location hierarchy for a postal code.

```typescript
interface LocationHierarchy {
  state: string // State name
  stateCode: string // State code
  district: string // District name
  districtCode: string // District code
  subDistrict: string // Sub-district name
  place: string // Place name
  isValid: boolean // Whether the postal code exists
}
```

`findByPlace(place: string, stateCode: string): PostalCodeInfo[]`

Finds all postal codes for a given place and state. Returns an array of PostalCodeInfo objects.

`findByDistrict(districtName: string, stateCode: string): PostalCodeInfo[]`

Finds all postal codes in a given district. Returns an array of PostalCodeInfo objects.

`findByRadius(latitude: number, longitude: number, radiusKm: number): PostalCodeInfo[]`

Finds postal codes within a radius of coordinates, sorted by distance. Returns an array of PostalCodeInfo objects.

`getStates(): Array<{ code: string, name: string }>`

Returns all states and union territories with their codes and names.

## Related Projects

Looking for US ZIP codes? Check out **[zipcodes-us](https://github.com/ikarthikng/zipcodes-us)** - the same functionality for the United States! 🇺🇸

## Data Source

This package uses GeoNames postal code data (under Creative Commons Attribution 4.0 License).

## License

MIT
