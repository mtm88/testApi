const { checkImage, returnImage } = require('./../helpers/apiproxy_helpers');

const processQuery = function processQuery(req) {
  return new Promise((resolve, reject) => {
    if (req && req.query && req.query.url) {
      const url = req.query.url;
      return checkImage(url)
      .then((validImage) => {
        if (validImage) {
          resolve(returnImage(url));
        }
        return reject('Provided image is too big for unsecured source.');
      });
    }
    return reject('Incorrect query');
  });
};



module.exports = {
  processQuery,
};
