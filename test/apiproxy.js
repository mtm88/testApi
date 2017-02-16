const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);

const { queryIsValid } = require('./../app/controllers/apiproxy_controller');
const { verifySize, returnImage, toBuffer, toJson, checkParsing } = require('./../app/helpers/apiproxy_helpers');

describe('API proxy', function () {
  describe('Image proxy route', function () {
      const req = {
        query: {},
      }
    it('should process the query', function () {
      expect(queryIsValid()).to.equal(false);
      expect(queryIsValid({ query: { url: '123' }})).to.equal(true);
    });
    describe('Image size check', function () {
      const imageError = verifySize('error', 10);
      const sizeError = verifySize(null, 10000000);
      const validImage = verifySize(null, 5000);

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
    describe('image parser', function () {
      // how to mock that properly?
      const uri = 'https://dab1nmslvvntp.cloudfront.net/wp-content/uploads/2016/03/1458289957powerful-images3.jpg';
      it('should return a string buffer', function () {
        return returnImage(uri).should.eventually.be.a('string');
      });
      it('should reject if no uri passed', function () {
        return returnImage().should.be.rejected;
      })
    })
  });

  describe('data proxy route', function () {
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
    it('should decide to parse/not to JSON', function () {
      expect(toJson(req.query)).to.equal(false);
      expect(toJson({ toJSON: 'true' })).to.equal(true);
    });
    it('should decide to parse/not to CSV', function () {
      expect(checkParsing(req.query, null)).to.equal(null);
      expect(checkParsing({ fromCSV: 'true' }, '123')).to.be.an('object');
    });

  });
});