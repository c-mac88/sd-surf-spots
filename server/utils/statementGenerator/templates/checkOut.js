const moment = require('moment-timezone');

module.exports = checkOutData =>
({
  actor: {
    name: checkOutData.fullName,
    account: {
      homePage: 'https://github.com/OriginCodeAcademy/kronos',
      name: checkOutData.id
    }
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/leave',
    display: {
      en: 'checked out of'
    }
  },
  object: {
    id: 'https://github.com/OriginCodeAcademy/kronos',
    definition: {
      extensions: {
        'http://id.tincanapi.com/extension/location': {
          building: checkOutData.building,
          room: checkOutData.room,
          dow: checkOutData.dow,
          isoDate: checkOutData.isoDate,
          localDate: moment(checkOutData.isoDate).tz('America/Los_Angeles').format('lll')
        }
      },
      type: 'http://activitystrea.ms/schema/1.0/device',
      name: {
        en: `${checkOutData.building}-${checkOutData.room}`
      }
    }
  },
  timestamp: new Date()
});
