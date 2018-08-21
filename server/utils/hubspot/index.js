const axios = require('axios');
const _ = require('lodash');

if (process.env.NODE_ENV === "development") {
  require('../../../credentials.js');
}

const apikey = process.env.HUBSPOT_API;

const getWakatimeByEmail = email =>
  axios.get(`https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`)
    .then(result => _.get(result, 'data.properties.wakatime_api_key.value', null))
    .catch(err => null);

const getUserByEmail = email =>
  axios.get(`https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`)
    .then(result => result)
    .catch(err => err);

const sendCommentToHubSpot =  (args) => {
  let { email, comment } = args;
 
  return new Promise(async (resolve, reject) => {
    try {
      let url = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${apikey}`;
      console.log("hubapi URL", url);
      let { data } = await axios.get(url);
      let vid = data.vid;

      // We got the user id (vid), now post the comment 
      // i.e. attach a note to the contact.
      url = `https://api.hubapi.com/engagements/v1/engagements?hapikey=${apikey}`;

      let data2post = {
        engagement: {
          active: true,
          type: "NOTE"
        },
        associations: {
          contactIds: [ vid ]
        },
        metadata: {
          body: comment
        }
      };
      
      await axios.post(url, data2post);
      resolve("OK");
    }
    catch (err) {
      reject(err.message);
    }
  });
}

const sendContactToHubspot = (firstname, lastname, email, phone) =>
  axios({
    method: 'post',
    url: `https://forms.hubspot.com/uploads/form/v2/2683380/f7ee29be-5e6b-419b-beb9-3aae7b775990?firstname=${firstname}&lastname=${lastname}&email=${email}&phone=${phone}&actual_lead_source=Prep+Course+Flow`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => response)
    .catch(err => err);

const sendCourseCompletionToHubspot = (email, coursesCompleted) =>
  axios({
    method: 'post',
    url: `https://forms.hubspot.com/uploads/form/v2/2683380/a1a94aa4-8fe8-4405-9189-2514bd6b0626?email=${email}&prep_courses_completed=${coursesCompleted}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(response => response)
    .catch(err => err);

module.exports = {
  getWakatimeByEmail,
  getUserByEmail,
  sendContactToHubspot,
  sendCourseCompletionToHubspot,
  sendCommentToHubSpot
};
