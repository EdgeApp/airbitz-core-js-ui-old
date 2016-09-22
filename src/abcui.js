var abc = require('airbitz-core-js')
var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError

function createIFrame(path) {
  var frame = document.createElement('iframe')
  var body = document.getElementsByTagName('BODY')[0]
  body.appendChild(frame, body)
  frame.setAttribute('src', path)
  frame.setAttribute('frameborder', '0')
  frame.setAttribute('allowtransparency', 'true')
  frame.setAttribute('style', 'border: 0px none transparent; overflow: hidden; visibility: visible; margin: 0px; padding: 0px; position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 9999; display: block; background: transparent;')
  return frame
}

function removeIFrame(frame) {
  frame.parentNode.removeChild(frame)
}

function makeABCUIContext(args) {
  return new InnerAbcUi(args)
}

function InnerAbcUi(args) {
  var apiKey = args.apiKey
  if (!apiKey) {
    throw Error('Missing api key')
  }
  window.abcContext = this.abcContext =
    abc.makeABCContext({'apiKey': args.apiKey, 'accountType': args.accountType})
  if (args['bundlePath']) {
    this.bundlePath = args.bundlePath
  } else {
    this.bundlePath = '/abcui'
  }
  window.abcuiContext = {
    'vendorName': args.vendorName,
    'bundlePath': this.bundlePath
  }
}

InnerAbcUi.prototype.openLoginWindow = function(callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/login')
  var that = this
  window.loginCallback = function(error, account, opts) {
    if (account) {
      window.abcAccount = account
      removeIFrame(frame)
      if (opts && opts.setupRecovery) {
        opts.noRequirePassword = true
        that.openSetupRecoveryWindow(account, opts, function () {})
      } else if (account.edgeLogin || account.passwordLogin) {
        that.openChangePinEdgeLoginWindow(account, opts, function () {})
      }
      callback(error, account)
    }
  }
  window.exitCallback = function() {
    removeIFrame(frame)
  }
}

InnerAbcUi.prototype.getABCContext = function() {
  return this.abcContext
}

InnerAbcUi.prototype.openRecoveryWindow = function(callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/recovery')
}

InnerAbcUi.prototype.openSetupRecoveryWindow = function(account, opts, callback) {
  if (opts && opts.noRequirePassword) {
    var frame = createIFrame(this.bundlePath + '/assets/index.html#/account/setuprecovery-nopassword')
  } else {
    var frame = createIFrame(this.bundlePath + '/assets/index.html#/account/setuprecovery')
  }
  window.exitCallback = function() {
    removeIFrame(frame)
  }
}

InnerAbcUi.prototype.openChangePinEdgeLoginWindow = function(account, callback) {
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/account/changepin-edge-login')
  window.exitCallback = function() {
    removeIFrame(frame)
  }
}

InnerAbcUi.prototype.openManageWindow = function(account, callback) {
  window.abcAccount = account
  var frame = createIFrame(this.bundlePath + '/assets/index.html#/account/')
  window.exitCallback = function() {
    removeIFrame(frame)
    callback(null)
  }
}

var abcui = {}
abcui.makeABCUIContext = makeABCUIContext
module.exports = abcui
