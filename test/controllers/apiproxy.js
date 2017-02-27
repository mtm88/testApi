const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const nock = require('nock');
const fs = require('fs');
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);

const { queryIsValid, fetchImgBuffer } = require('./../../app/controllers/apiproxy_controller');

describe.only('API proxy controller', function () {

  describe('Query is Valid', function () {
    it('should check if the query is valid', function () {
      expect(queryIsValid()).to.equal(false);
      expect(queryIsValid({ query: { url: '123' }})).to.equal(true);
    });
  });

  describe('Fetch Image Buffer', function () {
    const smallImgUri = 'http://www.drodd.com/images15/nature31.jpg';
    const bigImgUri = 'http://www.planwallpaper.com/static/images/2ba7dbaa96e79e4c81dd7808706d2bb7_large.jpg';
    const smallImage = fs.readFileSync(`${__dirname}/../mocks/smallImageMock`);
    const bigImage = fs.readFileSync(`${__dirname}/../mocks/bigImageMock`);
    before('mock image request', function () {
      nock(smallImgUri, {
        reqheaders: {
          host: 'www.drodd.com',
          accept: 'application/json'
        }
      }).get('')
      .reply(200, smallImage, {
        'content-type': 'image/jpeg',
        'accept': 'application/json',
      });
      nock(smallImgUri, {
        reqheaders: {
          host: 'www.drodd.com',
        }
      }).get('')
      .reply(200, smallImage, {
        'content-type': 'image/jpeg',
      });
      nock(bigImgUri, {
        reqheaders: {
          host: 'www.planwallpaper.com',
          accept: 'application/json',
        }
      })
      .get('')
      .reply(200, bigImage);
    });

    it('should fetch an image buffer', function (done) {
      fetchImgBuffer('http://www.drodd.com/images15/nature31.jpg')
        .then((data) => {
          expect(data).to.equal(`data:image/jpeg;base64,${new Buffer(smallImage).toString('base64')}`);
          done();
        })
    });
    it('should refuse to fetch image due to it\'s size', function () {
      return fetchImgBuffer(bigImgUri).should.eventually.be.rejected;
    });
  });
});