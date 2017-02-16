const { checkImage, returnImage } = require('./../helpers/apiproxy_helpers');

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



module.exports = {
  queryIsValid,
  fetchImgBuffer,
};
