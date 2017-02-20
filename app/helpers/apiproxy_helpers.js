const remoteFileSize = require('remote-file-size');
const rp = require('request-promise');
const { parse } = require('csv');

const config = require('nconf')
  .file('apiproxy', `${__dirname}/../../config/apiproxy.json`);

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

const toBuffer = function toBuffer(url) {
  return new Buffer(url, 'base64').toString();
};

const toJson = function toJson(query) {
  if (query && query.toJSON === 'true') {
    return true;
  }
  return false;
};

const checkParsing = function checkParsing(query, results) {
  if (query.fromCSV === 'true') {
    const parseOptions = {
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
    };
    return parse(results, parseOptions, (err, parsedData) => {
      if (err) {
        return results;
      }
      return parsedData;
    });
  }
  return results;
};


module.exports = {
  checkImage,
  verifySize,
  returnImage,
  toBuffer,
  toJson,
  checkParsing,
};
