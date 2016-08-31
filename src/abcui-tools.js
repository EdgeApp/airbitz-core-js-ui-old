
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function obfuscateUsername (username) {
  'use strict';

  var obfuscatedUsername

  var acctlen = username.length
  console.log(acctlen)
  if (acctlen <= 3) {
    obfuscatedUsername = username.substr(0, acctlen - 1) + '*'
  } else if(acctlen <= 6) {
    obfuscatedUsername = username.substr(0, acctlen - 2) + '**'
  } else if(acctlen <= 9) {
    obfuscatedUsername = username.substr(0, acctlen - 3) + '***'
  } else if(acctlen <= 12) {
    obfuscatedUsername = username.substr(0, acctlen - 4) + '****'
  } else {
    obfuscatedUsername = username.substr(0, acctlen - 5) + '*****'
  }

  return obfuscatedUsername
}
exports.validateEmail = validateEmail
exports.obfuscateUsername = obfuscateUsername

