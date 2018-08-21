const moment = require('moment-timezone');

module.exports = checkInData =>
({
  actor: {
    name: checkInData.fullName,
    account: {
      homePage: 'https://github.com/OriginCodeAcademy/kronos',
      name: checkInData.id
    }
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/checkin',
    display: {
      en: 'checked in to'
    }
  },
  object: {
    id: 'https://github.com/OriginCodeAcademy/kronos',
    definition: {
      extensions: {
        'http://id.tincanapi.com/extension/location': {
          building: checkInData.building,
          room: checkInData.room,
          dow: checkInData.dow,
          isoDate: checkInData.isoDate,
          localDate: moment(checkInData.isoDate).tz('America/Los_Angeles').format('lll')
        }
      },
      type: 'http://activitystrea.ms/schema/1.0/device',
      name: {
        en: `${checkInData.building}-${checkInData.room}`
      }
    }
  },
  timestamp: new Date()
});
