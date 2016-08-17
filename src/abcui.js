import abc from 'airbitz-core-js'

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

function AbcUi(args) {
  return new InnerAbcUi(args);
}


function InnerAbcUi(args) {
  var apiKey = args['key']
  if (!apiKey) {
    throw Error("Missing api key");
  }
  function authRequest (method, uri, body, callback) {
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function () {
      callback(null, this.status, this.responseText)
    })
    xhr.addEventListener('error', function () {
      callback(Error('Cannot reach auth server'))
    })
    xhr.open('POST', uri)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Token ' + apiKey)
    xhr.send(JSON.stringify(body))
    console.log(method + ' ' + uri)
  }
  window.context = this.context = new abc.Context(authRequest, localStorage);
  if (args['bundle-path']) {
    this.bundlePath = args['bundle-path'];
  } else {
    this.bundlePath = '/ui';
  }
}

InnerAbcUi.prototype.login = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/login');
  window.loginCallback = function(result, account) {
    if (account) {
      removeIFrame(frame);
      callback(result, account);
    }
  };
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

InnerAbcUi.prototype.context = function() {
  return this.context;
}

InnerAbcUi.prototype.recovery = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/recovery');
};

InnerAbcUi.prototype.register = function(callback) {
  var frame = createIFrame(this.bundlePath + '/index.html#/register');
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

InnerAbcUi.prototype.manageAccount = function(account, callback) {
  window.account = account;
  var frame = createIFrame(this.bundlePath + '/index.html#/account/');
  window.exitCallback = function() {
    removeIFrame(frame);
  };
};

var abcui = {};
abcui.AbcUi = AbcUi;
module.exports = abcui;
