const { parseString } = require('xml2js');
const _ = require('lodash');

const parseParksData = function parseParksData(data) {
  return new Promise((resolve, reject) =>
    parseString(data, (err, result) => {
      if (!err) {
        return resolve(result);
      }
      return reject(err);
    }));
};

const formatData = function formatData(parsedData) {
  const parks = [];
  const xmlArr = parsedData['d2lm:d2LogicalModel']['d2lm:payloadPublication'][0]['d2lm:situation'];
  if (!_.isEmpty(xmlArr)) {
    xmlArr.forEach((item) => {
      const tmp = item['d2lm:situationRecord'][0];
      const prefix = 'd2lm:';

      const locations = [];
      const tmpLocation = {
        latitude: tmp['d2lm:groupOfLocations'][0]['d2lm:locationContainedInGroup'][0]['d2lm:pointByCoordinates'][0]['d2lm:pointCoordinates'][0]['d2lm:latitude'],
        longitude: tmp['d2lm:groupOfLocations'][0]['d2lm:locationContainedInGroup'][0]['d2lm:pointByCoordinates'][0]['d2lm:pointCoordinates'][0]['d2lm:longitude'],
      };
      locations.push(tmpLocation);

      const carPark = {
        carParkIdentity: tmp[`${prefix}carParkIdentity`][0],
        carParkOccupancy: tmp[`${prefix}carParkOccupancy`][0],
        carParkStatus: tmp[`${prefix}carParkStatus`][0],
        groupOfLocations: locations,
        occupiedSpaces: tmp[`${prefix}occupiedSpaces`][0],
        probabilityOfOccurrence: tmp[`${prefix}probabilityOfOccurrence`][0],
        situationRecordCreationTime: tmp[`${prefix}situationRecordCreationTime`][0],
        situationRecordFirstSupplierVersionTime: tmp[`${prefix}situationRecordFirstSupplierVersionTime`][0],
        situationRecordVersion: tmp[`${prefix}situationRecordVersion`][0],
        situationRecordVersionTime: tmp[`${prefix}situationRecordVersionTime`][0],
        totalCapacity: tmp[`${prefix}totalCapacity`][0],
        validity: tmp[`${prefix}validity`][0],
      };
      parks.push(carPark);
    });
    return parks;
  }
  return 'There were no locations to process.';
};

module.exports = {
  parseParksData,
  formatData,
};
