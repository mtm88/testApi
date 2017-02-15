const Router = require('express').Router();
const { processQuery } = require('./../controllers/apiproxy_controller');
const logger = require('@mysolomon/solomon-core-logger').fetch();

class ApiProxy {
  constructor() {
    this.router = Router;
    this.router.get('/images', ApiProxy.fetchImage);
  }

  static fetchImage(req, res) {
    processQuery(req)
      .then(imgBuffer => res.json(imgBuffer))
      .catch((err) => {
        logger.error(err);
        res.json(err);
      });
  }
}

module.exports = {
  ApiProxy,
};
