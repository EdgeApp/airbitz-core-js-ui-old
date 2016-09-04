import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError

var AbcUiFormView = require('./abcui-formview')
var recovery = require('./abcui-recovery')
var RecoveryView = recovery.RecoveryView
var SetupRecoveryView = recovery.SetupRecoveryView

var LoginView = require('./abcui-login')
var manageAccount = require('./abcui-manageaccount.js')
var ManageAccountView = manageAccount.ManageAccountView
var ChangePinView = manageAccount.ChangePinView
var ChangePasswordView = manageAccount.ChangePasswordView
var RegistrationView = require('./abcui-registration.js')

var context = window.parent.context


var MenuItem = React.createClass({
  render() {
    return (<li><a {...this.props} href='javascript:;' /></li>)
  }
})
const Index = React.createClass({
  render() {
    return <h1>ABC</h1>
  }
})

const App = React.createClass({
  render() {
    return (<div>{this.props.children}</div>)
  }
})

const NotFound = React.createClass({
  render() {
    return (<h1>Not Found</h1>)
  }
})

render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
      <Route path='login' component={LoginView} />
      <Route path='register' component={RegistrationView} />
      <Route path='recovery/:token' component={RecoveryView} />
      <Route path='recovery' component={RecoveryView} />
      <Route path='account' component={ManageAccountView} />
      <Route path='account/changepassword' component={ChangePasswordView} />
      <Route path='account/changepin' component={ChangePinView} />
      <Route path='account/setuprecovery' component={SetupRecoveryView} />
    </Route>
  </Router>
), document.getElementById('app'))
