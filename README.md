# postalcodes-india

A lightweight and efficient Indian postal code lookup library with no external dependencies.

[![npm version](https://badge.fury.io/js/postalcodes-india.svg)](https://badge.fury.io/js/postalcodes-india.svg)
[![Tests](https://github.com/ikarthikng/postalcodes-india/actions/workflows/test-and-publish.yml/badge.svg)](https://github.com/ikarthikng/postalcodes-india/actions?query=workflow%3A"Test+and+Publish")

> I try my best to monitor the required dependencies daily and publish updates to the npm package whenever changes are detected.

## 🔄 **Data Last Updated:** _1st Mar 2025_

## Features

- Fast in-memory postal code lookups
- Multiple lookup methods for different use cases
- Find postal codes by place, state, and district
- Find postal codes within a radius of coordinates
- Returns complete information including state, district, sub-district, and coordinates
- TypeScript support with full type definitions
- Zero runtime dependencies

## Installation

```bash
npm install postalcodes-india
```

## Usage

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

## Data Source

This package uses GeoNames postal code data (under Creative Commons Attribution 4.0 License).

## License

MIT
