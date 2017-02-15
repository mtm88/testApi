const { fetchMongoLocations, updateFromRemote } = require('./../controllers/weather_controller');
const logger = require('@mysolomon/solomon-core-logger').fetch();
const router = require('express').Router();

class Weather {
  constructor() {
    this.router = router;
    this.router.get('/locations', Weather.locations);
    this.router.get('/updatelocations', Weather.updateLocations);
  }

  static locations(req, res) {
    fetchMongoLocations(req)
      .then(locations => res.json(locations))
      .catch((err) => {
        logger.error(err);
        return res.json(err);
      });
  }

  static updateLocations(req, res) {
    updateFromRemote(req)
      .then(() => res.json('Locations updated successfuly'))
      .catch((err) => {
        logger.error(err);
        return res.json(err);
      });
  }

}

module.exports = {
  Weather,
};
