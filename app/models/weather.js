const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Schema = mongoose.Schema;
function exportWeatherModel(conn) {
  const weatherLocationScheme = new Schema({
    elevation: Number,
    id: Number,
    latitude: Number,
    longitude: Number,
    name: String,
    region: String,
    unitaryAuthArea: String,
    location: {
      type: { type: String, enum: 'Point', default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
  }, { strict: true });
  weatherLocationScheme.index({ name: 'text' });

  if (conn.models.WeatherLocation == null) {
    return conn.model('WeatherLocation', weatherLocationScheme);
  }
  return conn.models.WeatherLocation;
}

module.exports = exportWeatherModel;
