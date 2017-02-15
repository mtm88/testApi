const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);

const { processQuery } = require('./../app/controllers/apiproxy_controller');
const { verifySize, returnImage } = require('./../app/helpers/apiproxy_helpers');

describe('API proxy', function () {
  describe('Image proxy route', function () {
      const req = {
        query: {},
      }
    it('should reject the promise when query is incorrect', function () {
      return processQuery().should.be.rejected;
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
});