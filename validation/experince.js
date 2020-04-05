const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateExperience(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job Title can not be empty";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "Company can not be empty";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date can not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
