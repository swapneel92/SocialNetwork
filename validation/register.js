const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateRegister(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: "2", max: "30" })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name can not be empty";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email can not be empty";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Valid Email required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password can not be empty";
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password can not be empty";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords should match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
