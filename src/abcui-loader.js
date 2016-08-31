import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError
var strings = require('./abcui-strings.js').strings


var AbcUiFormView = require('./abcui-formview')
var recovery = require('./abcui-recovery')
var RecoveryView = recovery.RecoveryView
var SetupRecoveryView = recovery.SetupRecoveryView

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal

var context = window.parent.context

var PasswordRuleRow = React.createClass({
  render () {
    let imageIcon
    if (this.props.passed) {
      imageIcon = (<span className='pull-right glyphicon glyphicon-ok' aria-hidden='true'></span>)
    } else {
      imageIcon = (<span className='pull-right glyphicon glyphicon-remove' aria-hidden='true'></span>)
    }
    return (<li>{ this.props.name } {imageIcon}</li>)
  }
})

var PasswordRequirementsInput = React.createClass({
  getInitialState () {
    return {
      tests: PasswordRequirementsInput.testPassword('')
    }
  },
  componentDidMount () {
    $(this.refs.dropdown).hide()
  },
  componentWillUnmount () {
  },
  statics: {
    testPassword (password) {
      if (!password) {
        password = ''
      }
      return [
        { name: strings.must_have_one_upper,    test: (s) => password.match(/[A-Z]/) != null},
        { name: strings.must_have_one_lower,    test: (s) => password.match(/[a-z]/) != null},
        { name: strings.must_have_one_number,   test: (s) => password.match(/\d/) != null},
        { name: strings.must_have_10_char,      test: (s) => password.length >= 10},
      ].map(r => ({name: r.name, passed: r.test(password) }))
    }
  },
  render () {
    return (
      <div>
        <input ref='input' type='password'
            {...this.props}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyUp={this.onKeyUp} />
          <span className='help-block'>
            <ul ref='dropdown' className='list-unstyled'>{
                this.state.tests.map(r => {
                  return (<PasswordRuleRow key={r.name} name={r.name} passed={r.passed} />)
                })
            }</ul>
          </span>
      </div>)
  },
  onFocus () {
    $(this.refs.dropdown).fadeIn()
  },
  onBlur () {
    $(this.refs.dropdown).fadeOut()
  },
  onKeyUp () {
    this.setState({'tests': PasswordRequirementsInput.testPassword(this.refs.input.value)})
  },
  value () {
    return this.refs.input.value
  }
})

var BootstrapInput = React.createClass({
  getInitialState () {
    return { error:null, loading:null }
  },
  render () {
    var classes = 'form-group '
    if (this.state.loading) {
      var subView = (<span className='help-block'><span className='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span> {this.state.loading}</span>)
    } else if (this.state.error) {
      var subView = (<span className='help-block'>{this.state.error}</span>)
      classes += 'has-error'
    }
    return (
      <div className='{classes}'>
        <input ref='input' {...this.props} />
        {subView}
      </div>)
  },
  value () {
    return this.refs.input.value
  }
})

var AbcUserList = React.createClass({
  getInitialState () {
    return { showInput: false }
  },
  render () {
    var block = null
    var that = this
    var userList = context ? context.usernameList().sort() : []
    var toggleInput = null
    if (this.props.allowInput) {
      toggleInput = (
        <span className='input-group-btn'>
          <button type='button' onClick={this.toggleInput}  className='btn btn-primary'>X</button>
        </span>)
    }
    if (this.props.allowInput && (userList.length == 0 || this.state.showInput)) {
        block = (
            <div className='input-group'>
              <input autoFocus ref='username' type='text' placeholder='username' className='form-control' />
              <span className='input-group-btn'>
                <button type='button' onClick={this.toggleInput}  className='btn btn-primary'>X</button>
              </span>
            </div>
        )
    } else {
        var selectElement = (
              <select ref='username'
                    className='form-control'
                    onChange={this.handleSelection}
                    defaultValue={this.props.username}>
                {userList.map(function(username) {
                    return (<option value={username} key={username}>{username}</option>)
                })}
              </select>
        )
        if (this.props.allowInput) {
            return (
              <div className='input-group'>
                {selectElement}
                {toggleInput}
              </div>
            )
        } else {
            return selectElement
        }
    }
    return (block)
  },
  toggleInput () {
    this.setState({'showInput': !this.state.showInput})
    if (this.state.showInput) {
        this.setState({username: ''})
        this.refs.username.focus()
    }
  },
  handleSelection () {
    this.props.onUserChange(this.refs.username.value)
  },
  getValue () {
    return this.refs.username.value
  }
})




var LoginWithAirbitz = React.createClass({
  getInitialState () {
    return {
      barcode: ''
    }
  },
  render () {

    var buttonUrl = 'airbitz-ret://x-callback-uri/edgelogin/[EDGELOGINTOKEN]'
    buttonUrl = encodeURI(buttonUrl)
    this.buttonBouncerUrl = 'https://airbitz.co/blf/?address=' + buttonUrl

    return (
      <div className="row">
        <div className='col-sm-12 text-center'>
          <div className='form-group center-block' style={{'width': '320px'}}>
            <a className="btn btn-block btn-social btn-facebook" onClick={this.onClick}>
              <img src="Airbitz-icon-white-transparent.png" style={{'width': '28px', "padding": "4px"}}/>
              {this.props.register ? strings.scan_barcode_to_register : strings.scan_barcode_to_signin }
            </a>
          </div>
          <div className='form-group center-block' style={{'width': '200px'}}>
            <img src={this.state.barcode} style={{'width': '200px'}}/>
          </div>
          <div className='form-group center-block' >
            <label>OR</label>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount () {
    var that = this
    this.setState({barcode: 'barcode.png'})
    // bwipjs.toBuffer({
    //   bcid:        'code128',       // Barcode type
    //   text:        '0123456789',    // Text to encode
    //   scale:       3,               // 3x scaling factor
    //   height:      10,              // Bar height, in millimeters
    //   includetext: true,            // Show human-readable text
    //   textxalign:  'center',        // Always good to set this
    //   textsize:    13               // Font size, in points
    // }, function (err, png) {
    //   if (err) {
    //     // Decide how to handle the error
    //     // `err` may be a string or Error object
    //   } else {
    //     var imgb64 = 'data:image/png;base64,' + png.toString('base64')
    //     that.setState({'barcode': imgb64})
    //   }
    // });
  },
  onClick () {
    window.open(this.buttonBouncerUrl, '_blank')
  }
})

var AbcPasswordLoginForm = React.createClass({
  render () {
    return (
      <AbcUiFormView ref='form'>
        <LoginWithAirbitz/>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='form-group'>
              <AbcUserList
                ref='username'
                allowInput={true}
                username={this.props.username}
                onUserChange={this.props.onUserChange} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='form-group'>
              <input ref='password' type='password' placeholder={strings.password_text} className='form-control' />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 text-center'>
            <div className='form-group'>
              <BootstrapButton ref='signin' onClick={this.handleSubmit}>Sign In</BootstrapButton>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 text-center'>
            <div className='form-group'>
              <Link className='btn btn-link' to={`/recovery`}>Forgot Password</Link>
            </div>
          </div>
        </div>
      </AbcUiFormView>
    )
  },
  handleSubmit() {
    var that = this
    this.refs.signin.setLoading(true)
    this.refs.form.setState({'error': null})
    context.passwordLogin(this.refs.username.getValue(), this.refs.password.value, function(err, result) {
      if (err) {
        that.refs.form.setState({'error': ABCError(err, strings.invalid_password_text).message})
      } else {
        that.props.onSuccess(result)
      }
      that.refs.signin.setLoading(false)
    })
    return false
  }
})

var AbcPinLoginForm = React.createClass({
  render() {
    return (
        <AbcUiFormView ref='form'>
          <LoginWithAirbitz/>
          <div className='row'>
            <div className='col-sm-12 text-center'>
              <div className='form-group center-block' style={{'width': '240px'}}>
                <AbcUserList ref='username'
                    allowInput={false}
                    username={this.props.username}
                    onUserChange={this.props.onUserChange} />
              </div>
            </div>
            <div className='col-sm-12 text-center'>
              <div className='form-group center-block' style={{'width': '100px'}}>
                  <input ref='pin' type='password' placeholder={strings.pin_text} className='form-control' maxLength='4' />
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 text-center'>
              <div className='form-group center-block' style={{'width': '240px'}}>
                <BootstrapButton ref='signin' onClick={this.handleSubmit}>{strings.sign_in_text}</BootstrapButton>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12 text-center'>
              <div className='form-group center-block' style={{'width': '240px'}}>
                <button type='button' onClick={this.handleExit} className='btn-link'>{strings.exit_pin_login_text}</button>
              </div>
            </div>
          </div>
        </AbcUiFormView>
    )
  },
  handleExit() {
    this.props.onExit()
    return false
  },
  handleSubmit() {
    var that = this
    this.refs.signin.setLoading(true)
    context.pinLogin(this.refs.username.getValue(), this.refs.pin.value, function(err, result) {
      if (err) {
        that.refs.form.setState({'error': ABCError(err, 'Failed to login with PIN.').message})
      } else {
        that.props.onSuccess(result)
      }
      that.refs.signin.setLoading(false)
    })
    return false
  }
})

var LoginForm = React.createClass({
  getInitialState() {
    return {
      forcePasswordLogin: false,
    }
  },
  statics: {
    currentUser() {
        return localStorage.getItem('airbitz.current_user')
    },
    updateCurrentUser(username) {
        localStorage.setItem('airbitz.current_user', username)
    }
  },
  render() {
    var block = null
    var currentUser = LoginForm.currentUser()
    var showPinLogin = context && currentUser && context.pinExists(currentUser)
    if (this.state.forcePasswordLogin) {
      showPinLogin = false
    }
    if (showPinLogin) {
      block = (<AbcPinLoginForm ref='pinForm'
                username={currentUser}
                onSuccess={this.handleSuccess}
                onError={this.handleError}
                onUserChange={this.handleUserChange}
                onExit={this.handlePinExit} />)
    } else {
      block = (<AbcPasswordLoginForm ref='passwordForm'
                username={currentUser}
                onSuccess={this.handleSuccess}
                onError={this.handleError}
                onUserChange={this.handleUserChange} />)
    }
    return (
      <BootstrapModal
          ref='loginModal'
          key='loginModal'
          cancel='Cancel'
          title='Login'
          onClose={this.onClose}>
        {block}
      </BootstrapModal>
    )
  },
  handlePinExit() {
    this.setState({'forcePasswordLogin': true})
  },
  handleUserChange(newUsername) {
    LoginForm.updateCurrentUser(newUsername)
    this.setState({'forcePasswordLogin': false})
  },
  handleSuccess(account) {
    this.setState({'forcePasswordLogin': false})
    LoginForm.updateCurrentUser(account.username)
    if (window.parent.loginCallback) {
      this.refs.loginModal.close()
      window.parent.loginCallback(null, account)
    }
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var RegistrationForm = React.createClass({
  render() {
    return (
      <BootstrapModal
          ref='regModal'
          key='regModal'
          cancel='Cancel'
          title='Register'
          onClose={this.onClose}>
        <AbcUiFormView ref='form'>
          <LoginWithAirbitz register="true"/>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                <BootstrapInput type='text' ref='username' placeholder='Choose a Username' className='form-control' onBlur={this.blur} onFocus={this.focus} />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <PasswordRequirementsInput ref='password' placeholder='Choose a Password' className='form-control' />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <PasswordRequirementsInput ref='password_repeat' placeholder='Repeat Password' className='form-control' />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <div className='input-group'>
                  <input type='password' ref='pin' maxLength='4' placeholder='Choose a 4 Digit PIN' className='form-control' />
                </div>
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <span className='input-group-btn'>
                  <BootstrapButton ref='register' onClick={this.handleSubmit}>Register</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </AbcUiFormView>
        </BootstrapModal>
    )
  },
  focus() {
    this.refs.username.setState({error:null, loading:null})
  },
  blur() {
    var that = this
    var username = that.refs.username.value()
    if (username) {
      that.refs.username.setState({error:null, loading:'Checking availability...'})
      context.usernameAvailable(username, function(err) {
        if (err) {
          that.refs.username.setState({error:'Username already taken', loading:null})
        } else {
          that.refs.username.setState({error:null, loading:null})
        }
      })
    } else {
      that.refs.username.setState({error: null})
    }
  },
  handleSubmit() {
    var that = this
    if (this.refs.password.value() != this.refs.password_repeat.value()) {
      that.refs.form.setState({ 'error': 'Passwords do not match' })
      return false
    }
    var checkPasswdResults = context.checkPasswordRules(this.refs.password.value())
    if (!checkPasswdResults.passed) {
      that.refs.form.setState({ 'error': 'Insufficient Password' })
      return false
    }
    if (4 != this.refs.pin.value.length) {
      that.refs.form.setState({ 'error': 'PIN Must be 4 digits long' })
      return false
    }
    var onlyNumbers = /^\d+$/.test(that.refs.pin.value)
    if (!onlyNumbers) {
      that.refs.form.setState({ 'error': 'PIN must only have numbers' })
      return false
    }

    this.refs.register.setLoading(true)
    var username = this.refs.username.value()
    context.accountCreate(username, this.refs.password.value(), function(err, result) {
      if (err) {
        that.refs.form.setState({'error': ABCError(err, 'Unable to register at this time.').message})
        that.refs.register.setLoading(false)
      } else {
        var account = result
        LoginForm.updateCurrentUser(account.username)
        account.pinSetup(that.refs.pin.value, function(err, result) {
          if (window.parent.registrationCallback) {
              window.parent.registrationCallback(null, account)
          }
          that.refs.regModal.close()
          that.refs.register.setLoading(false)
        })
      }
    })
    return false
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var ManageAccountView = React.createClass({
  render() {
    return (
      <BootstrapModal ref='modal' title='Manage Account' onClose={this.onClose}>
        <h4>ACCOUNT: <span>{window.parent.account.username}</span></h4>
        <ul className='list-unstyled'>
            <li><Link className='btn' to={`/account/changepassword`}>Change Password</Link></li>
            <li><Link className='btn' to={`/account/changepin`}>Change Pin</Link></li>
            <li><Link className='btn' to={`/account/setuprecovery`}>Setup/Change Recovery</Link></li>
        </ul>
        {/*
        <h4>OPTIONS</h4>
        <ul className='list-unstyled'>
            <li>
                <a className='btn' href='javascript://' onClick={this.togglePinEnabled}>Enable PIN Login</a>
                <input className='form-input pull-right' type='checkbox' ref='pinEnabled' id='pinEnabled' onChange={this.pinEnableChanged} />
            </li>
        </ul>
        */}
      </BootstrapModal>)
  },
  togglePinEnabled() {
    this.refs.pinEnabled.checked = !this.refs.pinEnabled.checked
    this.pinEnableChanged()
  },
  pinEnableChanged() {
    alert(this.refs.pinEnabled.checked)
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var ChangePasswordView = React.createClass({
  render() {
    return (
    <BootstrapModal ref='modal' title='Change Password' onClose={this.onClose}>
        <AbcUiFormView ref='form'>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                <input type='password' ref='currentPassword' placeholder='Current Password' className='form-control' />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <PasswordRequirementsInput ref='password' placeholder='Password' className='form-control' />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <BootstrapInput type='password' ref='confirmPassword' placeholder='Confirm Password' className='form-control' onChange={this.comparePasswords} />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <span className='input-group-btn'>
                  <BootstrapButton ref='changeButton' onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </AbcUiFormView>
    </BootstrapModal>)
  },
  comparePasswords() {
    var confirmPassword = this.refs.confirmPassword
    if (confirmPassword.value() != this.refs.password.value()) {
      confirmPassword.setState({'error': 'Password mismatch'})
    } else {
      confirmPassword.setState({'error': null})
    }
  },
  handleSubmit() {
    var that = this
    var account = window.parent.account
    if (account.passwordOk(this.refs.currentPassword.value)) {
      this.refs.changeButton.setLoading(true)
      window.parent.account.passwordSetup(this.refs.password.value(), function(err, result) {
        if (err) {
          that.refs.form.setState({'error': ABCError(err, 'Invalid Password').message})
        } else {
          that.refs.modal.close()
          if (window.parent.exitCallback) {
              window.parent.exitCallback()
          }
        }
        that.refs.changeButton.setLoading(false)
      })
    } else {
      that.refs.form.setState({'error': 'Incorrect current password'})
    }
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var ChangePinView = React.createClass({
  render() {
    return (
    <BootstrapModal ref='modal' title='Change PIN' onClose={this.onClose}>
        <form>
          <div className='row'>
            <div className='col-sm-12'>
              <div className='form-group'>
                <div className='input-group'>
                    <input type='password' ref='currentPassword' placeholder='Current Password' className='form-control' />
                </div>
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <div className='input-group'>
                  <input type='password' ref='pin' placeholder='New PIN' className='form-control' maxLength='4' />
                </div>
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <span className='input-group-btn'>
                  <BootstrapButton ref='changeButton' onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
    </BootstrapModal>)
  },
  handleSubmit() {
    var that = this
    var account = window.parent.account
    if (account.passwordOk(this.refs.currentPassword.value)) {
      this.refs.changeButton.setLoading(true)
      window.parent.account.pinSetup(this.refs.pin.value, function(err, result) {
        if (err) {
          that.refs.form.setState({'error': ABCError(err, 'Invalid Password').message})
        } else {
          that.refs.modal.close()
          if (window.parent.exitCallback) {
              window.parent.exitCallback()
          }
        }
        that.refs.changeButton.setLoading(false)
      })
    } else {
      that.refs.form.setState({'error': 'Incorrect current password'})
    }
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})


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
      <Route path='login' component={LoginForm} />
      <Route path='register' component={RegistrationForm} />
      <Route path='recovery/:token' component={RecoveryView} />
      <Route path='recovery' component={RecoveryView} />
      <Route path='account' component={ManageAccountView} />
      <Route path='account/changepassword' component={ChangePasswordView} />
      <Route path='account/changepin' component={ChangePinView} />
      <Route path='account/setuprecovery' component={SetupRecoveryView} />
    </Route>
  </Router>
), document.getElementById('app'))
