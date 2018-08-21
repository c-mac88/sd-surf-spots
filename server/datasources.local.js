module.exports = {
  myEmailDataSource: {
    name: 'myEmailDataSource',
    connector: 'mail',
    transports: [{
      type: 'smtp',
      host: 'smtp.sendgrid.net',
      secure: false,
      port: 587,
      tls: {
        rejectUnauthorized: false
      },
      auth: {
        user: 'apikey',
        pass: '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'
      }
    }]
  },
  lessonDS: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    password: process.env.MONGO_PASS,
    name: 'lessonDS',
    database: 'c75db67da0f5dbbb0038ef3367ce3c2f',
    user: process.env.MONGO_USER,
    connector: 'mongodb'
  }
};
