const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const { expect, should } = require('chai');
chai.use(chaiAsPromised).use(should);
const TwitterPlugin = require('twitter');
const config = require('nconf')
  .file('twitter', `${__dirname}/../config/twitter.json`);
  const { isLegacyReq, loadTweets } = require('./../app/controllers/twitter_controller');

describe('twitter', function () {
  describe('twitts loading', function () {
  const twClient = new TwitterPlugin(config.get('twitterClient'));
    it('should respond with array of tweets', function () {
      return loadTweets('leeds', twClient).should.eventually.be.an('array');
    });
  });
  describe('legacy request support', function () {
    const req = {
      headers: {
        origin: 'dashboard.leedsdatamill.org',
        referer: 'dashboard.leedsdatamill.org',
      }
    };
    it('returns true to proper legacy request', function () {
      expect(isLegacyReq(req)).to.be.true;
    })
    it('return false to non-legacy request without screen name', function () {
      expect(isLegacyReq({})).to.be.false;
    });
  });
});