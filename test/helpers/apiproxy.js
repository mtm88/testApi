const nock = require('nock');
const chai = require('chai');
const fs = require('fs');
const chaiAsPromised = require("chai-as-promised");
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);
 const { verifySize, returnImage, toBuffer, toJson, checkParsing } = require('./../../app/helpers/apiproxy_helpers');

 describe('API Proxy helpers', function () {

   describe('Verify Size', function () {
    before('get example size check values', function () {
      const imageError = verifySize('error', 10);
      const sizeError = verifySize(null, 10000000);
      const validImage = verifySize(null, 5000);
    });
    it('should return false when plugin failed to check size', function () {
      expect(imageError).to.be.false;
    });
    it('should return false when image is too big', function () {
      expect(sizeError).to.be.false;
    });
    it('should return true when no error and size is ok', function () {
      expect(validImage).to.be.true;
    });
  });

  describe('Return Image', function () {
    const uri = 'https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/03/1458289957powerful-images3.jpg';
    const image = fs.readFileSync(`${__dirname}/../mocks/image`);
    const imageResponse = nock(uri)
    .get('')
    .reply(200, image,  {
      'content-type': 'image/jpeg'
    });

    it('should return a string buffer', function (done) {
      returnImage(uri)
        .then((data) => {
         expect(data).to.equal(`data:image/jpeg;base64,${new Buffer(image).toString('base64')}`)
          done();
        })
    });
  })

  describe('To Buffer', function () {
    const req = {
      query: {
        url: 'aHR0cDovL2RhdGFwb2ludC5tZXRvZmZpY2UuZ292LnVrL3B1YmxpYy9kYXRhL3ZhbC93eGZjcy9hbGwvanNvbi8zNTIyNDE/cmVzPWRhaWx5JmtleT1mNzRiMmQ1Zi00ZmQ3LTQ1MGEtYjQxMC1lZDU2ZDg0MmEyMDk=',
      }
    }
    const parsed = 'http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352241?res=daily&key=f74b2d5f-4fd7-450a-b410-ed56d842a209'

    it('should respond with decoded url', function () {
      const address = toBuffer(req.query.url);
      expect(address).to.equal(parsed);
    });
  });

  describe('To JSON', function () {
    it('checks for JSON parsing', function () {
      expect(toJson({ toJSON: 'true' })).to.equal(true);
      expect(toJson({ toJSON: 'false' })).to.equal(false);
    });
  })

  describe('Check Parsing', function () {
    const req = {
      query: {},
    };
    it('should decide to parse/not to CSV and return data', function () {
      expect(checkParsing(req.query, null)).to.equal(null);
      expect(checkParsing({ fromCSV: 'true' }, '123')).to.be.an('object');
    });
  });
});