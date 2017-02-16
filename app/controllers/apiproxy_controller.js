const { checkImage, returnImage, toBuffer, toJson, checkParsing } = require('./../helpers/apiproxy_helpers');
const rp = require('request-promise');

const queryIsValid = function queryIsValid(req) {
  if (req && req.query && req.query.url) {
    return true;
  }
  return false;
};

const fetchImgBuffer = function fetchImgBuffer(url) {
  return new Promise((resolve, reject) =>
    checkImage(url)
    .then((validImage) => {
      if (validImage) {
        return resolve(returnImage(url));
      }
      return reject('Provided image is too big for unsecured source.');
    }));
};

const processSource = function processSource(query) {
  return new Promise((resolve, reject) => {
    rp.get({ uri: toBuffer(query.url), json: toJson(query) })
    .then(results => resolve(checkParsing(query, results)))
    .catch(err => reject(err));
  });
};



module.exports = {
  queryIsValid,
  fetchImgBuffer,
  processSource,
};
