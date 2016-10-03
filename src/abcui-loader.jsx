import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

var recovery = require('./abcui-recovery.jsx')
var RecoveryView = recovery.RecoveryView
var SetupRecoveryView = recovery.SetupRecoveryView

var LoginView = require('./abcui-login.jsx')
var RegistrationView = require('./abcui-registration.jsx')

var manageAccount = require('./abcui-manageaccount.jsx')
var ManageAccountView = manageAccount.ManageAccountView
var ChangePinView = manageAccount.ChangePinView
var ChangePasswordView = manageAccount.ChangePasswordView

var context = window.parent.abcContext

var MenuItem = React.createClass({
  render () {
    return (<li><a {...this.props} href="javascript:;" /></li>)
  }
})
const Index = React.createClass({
  render () {
    return <h1>ABC</h1>
  }
})

const App = React.createClass({
  render () {
    return (<div>{this.props.children}</div>)
  }
})

const NotFound = React.createClass({
  render () {
    return (<h1>Not Found</h1>)
  }
})

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="login" component={LoginView} />
      <Route path="register" component={RegistrationView} />
      <Route path="recovery/:token" component={RecoveryView} />
      <Route path="recovery" component={RecoveryView} />
      <Route path="account" component={ManageAccountView} />
      <Route path="account/changepassword" component={ChangePasswordView} />
      <Route path="account/changepin" component={ChangePinView} title="Change PIN" />
      <Route path="account/changepin-edge-login" component={ChangePinView} noRequirePassword="true" title="Login Successful. Please set a PIN for quick re-logins" />
      <Route path="account/setuprecovery" component={SetupRecoveryView} />
      <Route path="account/setuprecovery-nopassword" component={SetupRecoveryView} noRequirePassword="true" />
    </Route>
  </Router>
), document.getElementById('app'))
