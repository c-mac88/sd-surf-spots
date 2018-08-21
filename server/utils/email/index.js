const studentTemplateVars = require('./templates/student');
/**
 *
 * @param {*} type reference to the model in the database we will be replacing values for
 * @param {*} text the input string containing variables we want to replace
 * @param {*} values an object containing values we want to populate in the template
 */
const replaceEmailTemplateVars = (type, text, values) => {
  let returnText = text;
  switch (type) {
    case 'STUDENT': {
      studentTemplateVars.map((replace) => {
        if (!!values[replace.property]) {
          returnText = returnText.replace(replace.match, values[replace.property]);
        }
        returnText = returnText.replace(replace.match, '');
        return true;
      });
      break;
    }
    default:
      break;
  }
  return returnText;
};

module.exports = { replaceEmailTemplateVars };
