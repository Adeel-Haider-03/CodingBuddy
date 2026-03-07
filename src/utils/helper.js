const validator = require("validator");

const validateSignupData = (reqData) => {
  const { firstName, lastName, emailId, password } = reqData;

  if (!firstName) {
    throw new Error("First name is required");
  } else if (!lastName) {
    throw new Error("Last name is required");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Valid email is required");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password must be strong");
  } else {
    return true;
  }
};

const validateLoginData = (reqData) => {
  const { emailId, password } = reqData;

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Valid email is required");
  } else if (!password) {
    throw new Error("Password required");
  } else {
    return true;
  }
};

const validateUpdate = (reqData) => {
  const allowedUpdate = ["firstName", "lastName", "gender", "skills", "age"];

  const isUpdateAllowed = Object.keys(reqData).every((field) =>
    allowedUpdate.includes(field),
  );

  return isUpdateAllowed;
};

module.exports = { validateSignupData, validateLoginData, validateUpdate };
