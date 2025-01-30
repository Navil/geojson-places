# geojson-places

This is a fork of https://www.npmjs.com/package/geojson-places (which has almost 300MB) and focuses on looking up the country code for a given location. Overhead data (e.g. states, continents) has been removed.

## Install

## API implementation

### lookUp(latitude, longitude)

Reverse geocoding to get the region info from latitude/longitude arguments.

```javascript
const { lookUp } = require("geojson-places");
// Reverse geocoding to get the region info of Valladolid (Spain)
const result = lookUp(41.652349, -4.728602);
```

Result:

```javascript
{
  country_a2: 'ES',
  country_a3: 'ESP'
}
```

Get null from a latitude/longitude in the middle of the sea:

```javascript
const { lookUp } = require("geojson-places");
const result = lookUp(0.0, 0.0);
console.log(result);
// null
```
