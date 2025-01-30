const test = require('tape');
const {
    lookUp,
} = require('../src');

test('Validate lookUp (Valladolid, Spain)', function (t) {
    const result = lookUp(41.652349, -4.728602);
    // console.log('lookUp (Valladolid, Spain)', result);
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ES"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.end();
});

test('Validate lookUp (Madrid, Spain)', function (t) {
    const result = lookUp(40.4167047, -3.7035825);
    // console.log('lookUp (Madrid, Spain)', result);
    t.equal(result.country_a2, 'ES', 'result.country_a2 should be strictly equal to "ES"');
    t.equal(result.country_a3, 'ESP', 'result.country_a3 should be strictly equal to "ESP"');
    t.end();
});

test('Validate lookUp null (water)', function (t) {
    const result = lookUp(0.0, 0.0);
    // console.log('lookUp null (water)', result);
    t.equal(result, null, 'result should be strictly equal to null');
    t.end();
});
