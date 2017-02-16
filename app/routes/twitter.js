const Router = require('express').Router();
const logger = require('@mysolomon/solomon-core-logger').fetch();
const TwitterPlugin = require('twitter');
const config = require('nconf')
  .file('twitter', `${__dirname}/../../config/twitter.json`);
const _ = require('lodash');
const { isLegacyReq, loadTweets } = require('./../controllers/twitter_controller');

class Twitter {
  constructor() {
    this.router = Router;
    this.router.get('/', Twitter.processReq);
    this.router.get('/:screenName', Twitter.processReq);
  }

  static processReq(req, res) {
    if (_.isEmpty(req.params)) {
      if (isLegacyReq(req)) {
        return Twitter.fetchTweets('DataMillNorth', res);
      }
      return res.status(401).send('please provide a screen name');
    }
    return Twitter.fetchTweets(req.params.screenName, res);
  }

  static fetchTweets(screenName, res) {
    return loadTweets(screenName, Twitter.setClient())
    .then(loadedTweets => res.json(loadedTweets))
    .catch((err) => {
      logger.error(err);
      res.json(err);
    });
  }

  static setClient() {
    return new TwitterPlugin(config.get('twitterClient'));
  }
}

module.exports = {
  Twitter,
};

