const rp = require('request-promise');
const { parseParksData, formatData } = require('./../helpers/carparks_helpers');
const config = require('nconf')
  .file('config', `${__dirname}/../../config/carparks.json`);

const fetchData = function fetchData() {
  return new Promise((resolve, reject) => {
    return rp.get({
      uri: 'http://www.leedstravel.info/datex2/carparks/content.xml',
      auth: {
        user: config.get('USERNAME'),
        pass: config.get('PASSWORD'),
        sendImmediately: true,
      },
    })
    .then(results => parseParksData(results))
    .then(parsedData => resolve(formatData(parsedData)))
    .catch(err => reject(err));
  });
};

module.exports = {
  fetchData,
};
