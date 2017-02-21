const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);

const { queryIsValid, fetchImgBuffer } = require('./../../app/controllers/apiproxy_controller');

describe('API proxy controller', function () {
  it('should validate the query', function () {
    expect(queryIsValid()).to.equal(false);
    expect(queryIsValid({ query: { url: '123' }})).to.equal(true);
  });

  it.only('should fetch a buffer from supplied image', function (done) {
    fetchImgBuffer(`${__dirname}/../mocks/image.jpg`)
      .then((results) => {
        console.log(results);
        done();
      })
  })

});