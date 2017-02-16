const Router = require('express').Router();
const { queryIsValid, fetchImgBuffer } = require('./../controllers/apiproxy_controller');
const logger = require('@mysolomon/solomon-core-logger').fetch();

class ApiProxy {
  constructor() {
    this.router = Router;
    this.router.get('/', ApiProxy.fetchContent);
    this.router.get('/images', ApiProxy.fetchImage);
  }

  static fetchImage(req, res) {
    if (queryIsValid(req)) {
      return fetchImgBuffer(req.query.url)
      .then(imgBuffer => res.json(imgBuffer))
      .catch((err) => {
        logger.error(err);
        res.json(err);
      });
    }
    return res.json('No URL Provided or it\'s incorrect.');
  }

  static fetchContent(req, res) {
    if (queryIsValid(req)) {

    }
  }
}

module.exports = {
  ApiProxy,
};
