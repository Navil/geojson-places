/**
 * Checks if a point is contained in a polygon
 * (based on the Jordan curve theorem), for more info:
 * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @param polygon array a series of the polygon's coordinates
 * @param point object representing the point's coordinates
 * @return boolean true if the point lies within the polygon, false otherwise
 */
const pointInPolygon = (polygon, point) => {
    let nvert = polygon.length;
    let c = false;
    for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
        let pI = polygon[i];
        let pJ = polygon[j];
        if (((pI[1] > point[1]) !== (pJ[1] > point[1])) &&
            (point[0] < (pJ[0] - pI[0]) * (point[1] - pI[1]) / (pJ[1] - pI[1]) + pI[0])) {
            c = !c;
        }
    }
    return c;
};

module.exports = {
    pointInPolygon,
};