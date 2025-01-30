const fs = require('fs');
const path = require('path');

// 1) Import the metadata array (alpha2, alpha3, names, etc.)
const countriesList = require('./../data/countries/countries.json');

// 2) Some function to check if [lng, lat] is inside a polygon:
const { pointInPolygon } = require('./utils');

/**
 * Check if a point is inside the feature (Polygon or MultiPolygon).
 */
function isPointInFeature(feature, point) {
    const { type, coordinates } = feature.geometry;

    if (type === 'Polygon') {
        // Outer ring
        let found = pointInPolygon(coordinates[0], point);
        // Exclude any holes
        if (found && coordinates.length > 1) {
            for (let i = 1; i < coordinates.length; i++) {
                if (pointInPolygon(coordinates[i], point)) {
                    found = false;
                    break;
                }
            }
        }
        return found;
    }

    if (type === 'MultiPolygon') {
        // Check each polygon in the multipolygon
        for (const coords of coordinates) {
            let found = pointInPolygon(coords[0], point);
            // Exclude any holes
            if (found && coords.length > 1) {
                for (let i = 1; i < coords.length; i++) {
                    if (pointInPolygon(coords[i], point)) {
                        found = false;
                        break;
                    }
                }
            }
            if (found) return true; // As soon as we find a polygon that contains the point, we can stop.
        }
        return false;
    }

    // You might have other geometry types in the file, but ignoring them here:
    return false;
}

/**
 * A minimal reverse geolocation function returning only country info
 * when you have separate files for each country.
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {object|null}
 * Example of returned object:
 * {
 *   country_a2: 'FR',
 *   country_a3: 'FRA'
 * }
 */
function lookUp(lat, lng) {
    // Validate inputs
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error(`Wrong coordinates (lat: ${lat}, lng: ${lng})`);
    }

    // For convenience, convert to GeoJSON style [longitude, latitude]
    const point = [lng, lat];

    // 3) Loop through each country from countries.json:
    for (const country of countriesList) {
        // The alpha-2 code is used to find the matching file, e.g. "AF.json", "AX.json"
        const { country_a2, country_a3 } = country;
        const geoFile = path.join(__dirname, '..', 'data', 'countries', `${country_a2}.json`);

        // If the file does NOT exist, skip it
        if (!fs.existsSync(geoFile)) {
            continue;
        }

        // Read and parse the GeoJSON for that country
        const geojson = JSON.parse(fs.readFileSync(geoFile, 'utf8'));

        // Depending on the structure of your file, it might be FeatureCollection or Feature:
        if (geojson.type === 'FeatureCollection') {
            // Check each feature
            for (const feature of geojson.features) {
                if (isPointInFeature(feature, point)) {
                    // Found the country that contains our coordinate
                    return {
                        country_a2,
                        country_a3
                    };
                }
            }
        } else if (geojson.type === 'Feature') {
            // Single feature in this file
            if (isPointInFeature(geojson, point)) {
                return {
                    country_a2,
                    country_a3
                };
            }
        }
        // If the geometry is not a FeatureCollection or Feature,
        // or the point doesn't fall in, we move on to the next country
    }

    // If no country was found for the given lat/lng
    return null;
}

module.exports = { lookUp };
