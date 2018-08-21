const contacts = require('./contacts.json');

var MongoClient = require('mongodb').MongoClient;

// Connection url
//var url =
var url = process.env.MIGRATION_MONGO ||
'mongodb://localhost:27017/c75db67da0f5dbbb0038ef3367ce3c2f';

// Connect using MongoClient
MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  // Use the admin database for the operation
  let user = db.collection('user');
  contacts.map((contact) => {
    let newUser = {
      "fullName": `${contact.firstName} ${contact.lastName}`,
      "email": contact.email,
      "disabled": false,
      "wakatimeApiKey": contact.apiKey,
      "username": contact.email,
      "password": "pass123",
      "studentType": contact.studentType,
      "firstName": contact.firstName,
      "lastName": contact.lastName,
      "trackId": "track1",
      "mockData": true,
      "emailVerified": true,
      "moodleUserId": contact.moodleUserId
    };

    user.insert(newUser, function(err, results) {
      if (err) throw err;
      console.log(results);
    });
  });
});
