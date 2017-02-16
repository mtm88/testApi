const { Weather } = require('./routes/weather');
const { BikeBays } = require('./routes/bikebays');
const { ApiProxy } = require('./routes/apiproxy');
const { Twitter } = require('./routes/twitter');

module.exports = (app) => {
  app.use('/weather', new Weather(app).router);
  app.use('/bikebays', new BikeBays(app).router);
  app.use('/apiproxy', new ApiProxy(app).router);
  app.use('/twitter', new Twitter(app).router);
};
