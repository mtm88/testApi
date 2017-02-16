// this is to support the legacy leeds dashboard app that requests to twitter/ and expects results from datamillnorth (previously leedsdatamill)
const isLegacyReq = function isLegacyReq(req) {
  if ((req && req.headers && req.headers.referer && req.headers.referer.indexOf('dashboard.leedsdatamill.org') > -1)
    || (req && req.headers && req.headers.origin && req.headers.origin.indexOf('dashboard.leedsdatamill.org') > -1)) {
    return true;
  }
  return false;
};

const loadTweets = function loadTweets(screenName, twClient) {
  return new Promise((resolve, reject) => {
    const params = { screen_name: screenName };
    twClient.get('statuses/user_timeline', params, (error, tweets) => {
      if (!error) {
        return resolve(tweets);
      }
      return reject(error);
    });
  });
};

module.exports = {
  isLegacyReq,
  loadTweets,
};
