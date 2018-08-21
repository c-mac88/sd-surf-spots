const rules = {
  fullTime: {
    timeStart: '9:00 am',
    timeEnd: '5:00 pm'
  },
  partTime: {
    timeStart: '5:30 pm',
    timeEnd: '9:30 pm'
  },
  points: {
    arriveLate: {
      lessThanHour: 0.25,
      moreThanHour: 1
    },
    leaveEarly: {
      lessThanHour: 0.25,
      moreThanHour: 1
    }
  },
  credits: {
    weekend: 1,
    arriveEarly: 0.5,
    stayLate: 0.5
  },
  warningPoints: 7,
  dangerPoints: 10
};

module.exports = { rules };
