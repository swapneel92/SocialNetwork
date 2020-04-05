const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateLogin(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email can not be empty";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Valid Email required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password can not be empty";
  }
  if (!validator.isLength(data.password, { min: 2, max: 30 })) {
    errors.password = "Password must be between 2 and 30 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
