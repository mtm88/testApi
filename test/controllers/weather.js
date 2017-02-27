const { expect } = require('chai');
const { queryBuilder, fetchRemoteLocations, removeCurrentLocations, insertNewLocations, fetchCoordsQuery, fetchTermsQuery } = require('./../../app/helpers/weather_helpers');

describe('weather', () => {
  describe('query building helpers', function () {
    const lat = 1;
    const lon = 2;
    const maxDistance = 3;
    it('returns object with coords', function () {
      const query = fetchCoordsQuery(lat, lon, maxDistance);
      expect(query).to.be.an('object');
      expect(query.location.$near.$geometry.coordinates[0]).to.equal(1);
      expect(query.location.$near.$geometry.coordinates[1]).to.equal(2);
      expect(query.location.$near.$maxDistance).to.equal(3);
    });
    it('returns object with term query', function () {
      const query = fetchTermsQuery('testTerm');
      expect(query.$where.indexOf('testTerm')).to.not.equal(-1);
    });
  });
});
