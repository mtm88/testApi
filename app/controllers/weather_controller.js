'use strict';
const weatherModel = require('./../models/weather');
const { queryBuilder, fetchRemoteLocations, removeCurrentLocations, insertNewLocations } = require('./../helpers/weather_helpers');

const fetchMongoLocations = function fetchLocations(req) {
  return new Promise((resolve, reject) => {
    const model = weatherModel(req.conn);
    const query = queryBuilder(req);
    model.find(query, (err, locations) => {
      if (!err) {
        return resolve(locations);
      }
      return reject(err);
    });
  });
};

const updateFromRemote = function updateFromRemote(req) {
  let newLocations;
  return new Promise((resolve, reject) => {
    fetchRemoteLocations()
    .then((locations) => {
      newLocations = locations;
      removeCurrentLocations(req)
    .then(() => insertNewLocations(req, newLocations))
    .then(() => resolve())
    .catch(err => reject(err));
    });
  });
};



module.exports = {
  fetchMongoLocations,
  updateFromRemote,
};
