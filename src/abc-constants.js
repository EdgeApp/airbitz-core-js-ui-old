const ABC_SUCCESS = 0;
const ABC_ERROR = 1;
const ABC_ACCOUNT_EXISTS = 2;
const ABC_NO_ACCOUNT = 3;
const ABC_INVALID_PASSWORD = 4;
const ABC_INVALID_ANSWERS = 5;
const ABC_INVALID_API_KEY = 6;
const ABC_PIN_THROTTLED = 7;
const ABC_INVALID_OTP = 8;

function errorMap(error, defaultMessage) {
  if (error.message) {
    try {
      var j = JSON.parse(error.message);
      switch (j.status_code) {
      case ABC_ERROR:
        return 'Unknown error';
      case ABC_ACCOUNT_EXISTS:
        return 'Account already exists';
      case ABC_NO_ACCOUNT:
        return 'Account does not exist';
      case ABC_INVALID_PASSWORD:
        if (j.results.wait_seconds) {
          return 'Incorrect PIN. Please wait ' + j.results.wait_seconds + ' seconds before trying again.';
        } else {
          return 'Incorrect password';
        }
      case ABC_INVALID_ANSWERS:
        return 'Incorrect recovery answers';
      case ABC_INVALID_API_KEY:
        return 'Invalid API key ';
      case ABC_PIN_THROTTLED:
        return 'Pin login throttled. Too many login failures.';
      case ABC_INVALID_OTP:
        return 'Invalid two factor authentication';
      default:
        return defaultMessage;
      }
    } catch (e) {
      console.log(error);
    }
  }
  return defaultMessage;
}

exports.errorMap = errorMap;
