import abc from 'airbitz-core-js'
var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError

function createIFrame(path) {
  var frame = document.createElement('iframe');
  var body = document.getElementsByTagName("BODY")[0];
  body.appendChild(frame, body);
  frame.setAttribute('src', path);
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('allowtransparency', 'true');
  frame.setAttribute('style', 'border: 0px none transparent; overflow: hidden; visibility: visible; margin: 0px; padding: 0px; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; display: block; background: transparent;');
  return frame;
}

function removeIFrame(frame) {
  frame.parentNode.removeChild(frame);
}

function makeABCUIContext(args) {
  return new InnerAbcUi(args);
}

function InnerAbcUi(args) {
  var apiKey = args.apiKey
  if (!apiKey) {
    throw Error("Missing api key");
  }
  window.context = this.abcContext =
    abc.makeABCContext({'apiKey': args.apiKey, 'accountType': args.accountType});
  if (args['bundle-path']) {
    this.bundlePath = args.bundlePath;
  } else {
    this.bundlePath = '/abcui';
  }
}

InnerAbcUi.prototype.openLoginWindow = function(callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/login');
  window.loginCallback = function(error, account) {
    if (account) {
      removeIFrame(frame);
      callback(error, account);
    }
  };
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

InnerAbcUi.prototype.getABCContext = function() {
  return this.abcContext;
}

InnerAbcUi.prototype.openRecoveryWindow = function(callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/recovery');
};

InnerAbcUi.prototype.openRegisterWindow = function(callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/register');
  window.registrationCallback = function(result, account) {
    if (account) {
      removeIFrame(frame);
      callback(result, account);
    }
  };
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

InnerAbcUi.prototype.openManageWindow = function(account, callback) {
  window.account = account;
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/account/');
  window.exitCallback = function() {
    removeIFrame(frame);
    callback(null);
  };
};

var abcui = {};
abcui.makeABCUIContext = makeABCUIContext;
module.exports = abcui;
