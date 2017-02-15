const Router = require('express').Router();
const _ = require('lodash');
const config = require('nconf')
  .file('bikebays', `${__dirname}/../../config/bikebays.json`);

class BikeBays {
  constructor() {
    this.router = Router;
    this.router.get('/', BikeBays.fetchBikeBays);
  }

  static fetchBikeBays(req, res) {
    const bikeBays = BikeBays.fetchJsonData();
    if (!_.isEmpty(bikeBays) && _.isArray(bikeBays)) {
      return res.json(bikeBays);
    }
    return res.json('Failed to fetch Bike Bays data.');
  }

  static fetchJsonData() {
    return config.get('BAYS_DATA');
  }


}

module.exports = {
  BikeBays,
};
