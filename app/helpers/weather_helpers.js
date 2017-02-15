const rp = require('request-promise');
const config = require('nconf')
  .file('config', `${__dirname}/../../config/weather_config.json`);
const _ = require('lodash');
const weatherModel = require('./../models/weather');

const queryBuilder = function queryBuilder(req) {
  if (req && req.query) {
    if (req.query.lat && req.query.lon) {
      return fetchCoordsQuery(req.query.lat, req.query.lon, req.query.maxDistance);
    } else if (req.query.term && req.query.term.length > 0) {
      return fetchTermsQuery(req.query.term);
    }
  }
  return {};
};

const fetchCoordsQuery = function fetchCoordsQuery(lat, lon, maxDistance) {
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(lat),
            parseFloat(lon),
          ],
        },
        $maxDistance: maxDistance || 5000,
      },
    },
  };
};

const fetchTermsQuery = function fetchTermsQuery(term) {
  return { $where: `this.name.toLowerCase().indexOf('${term}') > -1` };
};

const fetchRemoteLocations = function fetchRemoteLocations() {
  return new Promise((resolve, reject) => {
    const { locations_source } = config.get('WEATHER');
    rp({ uri: locations_source, json: true })
      .then((results) => {
        if (!_.isEmpty(results)) {
          const { Locations } = JSON.parse(results);
          if (_.isEmpty(Locations.Location) || !_.isArray(Locations.Location)) {
            return reject('Locations are empty or are not an array');
          }
          return resolve(Locations.Location);
        }
        return reject('No data received from external source');
      })
      .catch(err => reject(err));
  });
};

const removeCurrentLocations = function removeCurrentLocations(req) {
  return new Promise((resolve, reject) => {
    const model = weatherModel(req.conn);
    model.remove({}, (err) => {
      if (!err) {
        return resolve();
      }
      return reject(err);
    });
  });
};

const insertNewLocations = function insertNewLocations(req, newLocations) {
  return new Promise((resolve, reject) => {
    const model = weatherModel(req.conn);
    const parsedLocations = [];
    newLocations.forEach((location) => {
      location.location = {
        type: 'Point',
        coordinates: [location.latitude, location.longitude],
      };
      parsedLocations.push(location);
    });

    model.insertMany(newLocations, (err) => {
      if (!err) {
        return resolve();
      }
      return reject(err);
    });
  });
};


module.exports = {
  queryBuilder,
  fetchRemoteLocations,
  removeCurrentLocations,
  insertNewLocations,
  fetchCoordsQuery,
  fetchTermsQuery,
};
