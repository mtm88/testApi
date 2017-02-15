const { expect } = require('chai');
const { BikeBays } = require('./../app/routes/bikebays');


describe('bike bays', function () {
  it('should fetch an array of bike bays', function () {
    const bikeBays = BikeBays.fetchJsonData();
    expect(bikeBays).to.be.an('array');
    bikeBays.forEach((bay) => {
      expect(bay.geojson_point.coordinates.length).to.equal(2);
    });
  });
});