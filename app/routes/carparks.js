const Router = require('express').Router();
const { fetchData } = require('./../controllers/carkparks_controller');
const logger = require('@mysolomon/solomon-core-logger').fetch();


class CarParks {
  constructor() {
    this.router = Router;
    this.router.get('/', CarParks.fetchCarParks);
  }

  static fetchCarParks(req, res) {
    fetchData()
    .then(loadedCarParks => res.json(loadedCarParks))
    .catch((err) => {
      logger.error(err);
      res.json(err);
    });
  }
}


module.exports = {
  CarParks,
};
