const remoteFileSize = require('remote-file-size');
const rp = require('request-promise');
const config = require('nconf')
  .file('config', `${__dirname}/../../config/apiproxy_config.json`);

const verifySize = function verifySize(err, size) {
  if (err) {
    return false;
  } else if ((size / 1000) > (config.get('SETTINGS').IMAGE_SIZE_LIMIT)) {
    return false;
  }
  return true;
};

const checkImage = function checkImageSize(url) {
  return new Promise((resolve) => {
    remoteFileSize(url, (err, size) => resolve(verifySize(err, size)));
  });
};

const returnImage = function returnImage(uri) {
  return new Promise((resolve, reject) => {
    rp.get({ uri, encoding: null, json: true, resolveWithFullResponse: true })
    .then(response => resolve(`data:${response.headers['content-type']};base64,${new Buffer(response.body).toString('base64')}`))
    .catch(err => reject(err));
  });
};


module.exports = {
  checkImage,
  verifySize,
  returnImage,
};
