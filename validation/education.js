const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateEducation(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "School can not be empty";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree can not be empty";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Fiel of study can not be empty";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date can not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
