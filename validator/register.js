const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstname = !isEmpty(data.firstname) ? data.firstname : ""; //setting data.name to an string if it is not empty and if i
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    //validation of name length
    errors.firstname = "Name must be between 2 and 30";
  }

  if (!Validator.isLength(data.lastname, { min: 2, max: 30 })) {
    errors.lastname = "Name must be between 2 and 30";
  }

  //Validation of form fields
  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "firstname field is required"; //if name entered is empty
  }
  if (Validator.isEmpty(data.lastname)) {
    errors.lastname = "Lastname field is required";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required"; //if email field is empty
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid"; //if email is invalid
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required"; //if password is empty
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters"; //if it is not 6 characters
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = " Confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match"; //error if password and confirm password do not match
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
