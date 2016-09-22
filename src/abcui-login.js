import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError
var strings = require('./abcui-strings')

var AbcUiFormView = require('./abcui-formview')
var LoginWithAirbitz = require('./abcui-loginwithairbitz')
var classNames = require('classnames');

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var BootstrapInput = modal.BootstrapInput

var PasswordRequirementsInput = require('./abcui-password')

var context = window.parent.abcContext

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

var AbcPasswordLoginForm = React.createClass({
	render () {
		return (
			<AbcUiFormView ref='form'>
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
							<input ref='password' type='password' onKeyPress={this.handlePasswordKeyPress} placeholder={strings.password_text} className='form-control' />
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
	onClose() {
	},
	handlePasswordKeyPress(e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
		}
	},
	handleSubmit() {
		var that = this
		this.refs.signin.setLoading(true)
		this.refs.form.setState({'error': null})
		context.loginWithPassword(this.refs.username.getValue(), this.refs.password.value, null, null, function(err, result) {
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
							<input ref='pin' type='password' placeholder={strings.pin_text} onKeyPress={this.handlePinKeyPress} className='form-control' maxLength='4' />
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
	onClose() {
	},
	handleExit() {
		this.props.onExit()
		return false
	},
	handlePinKeyPress(e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
		}
	},
	handleSubmit() {
		var that = this
		this.refs.signin.setLoading(true)
		context.loginWithPIN(this.refs.username.getValue(), this.refs.pin.value, function(err, result) {
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

var LoginView = React.createClass({
	getInitialState() {
		var doRegistration = context.usernameList().sort().length == 0 ? true : false
		return {
			forcePasswordLogin: false,
			showRegistration: doRegistration
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
		var currentUser = LoginView.currentUser()
		var showPinLogin = context && currentUser && context.pinExists(currentUser)
		if (this.state.forcePasswordLogin) {
			showPinLogin = false
		}
		if (this.state.showRegistration) {
				block = (
					<div>
						<RegistrationForm/>
						<button type='button' onClick={this.handleSignIn} className='btn-link'>{strings.sign_in_text}</button>
					</div>
				)
		} else if (showPinLogin) {
			block = (
				<div>
					<AbcPinLoginForm ref='pinPasswordForm'
													 username={currentUser}
													 onSuccess={this.handleSuccess}
													 onError={this.handleError}
													 onUserChange={this.handleUserChange}
													 onExit={this.handlePinExit} />
					<button type='button' onClick={this.handleSignUp} className='btn-link'>{strings.sign_up_text}</button>
				</div>
			)
		} else {
			block = (
				<div>
					<AbcPasswordLoginForm ref='pinPasswordForm'
																		 username={currentUser}
																		 onSuccess={this.handleSuccess}
																		 onError={this.handleError}
																		 onUserChange={this.handleUserChange} />
					<button type='button' onClick={this.handleSignUp} className='btn-link'>{strings.sign_up_text}</button>
				</div>
		)
		}
		return (
			<BootstrapModal
				ref='loginModal'
				key='loginModal'
				cancel='Cancel'
				title='Airbitz Edge Login'
				onClose={this.onClose}>
				<LoginWithAirbitz onLogin={this.handleSuccess} ref='loginWithAirbitz'/>
				{block}
			</BootstrapModal>
		)
	},
	handlePinExit() {
		this.setState({'forcePasswordLogin': true})
	},
	handleUserChange(newUsername) {
		LoginView.updateCurrentUser(newUsername)
		this.setState({'forcePasswordLogin': false})
	},
	handleSuccess(account) {
		this.refs.loginWithAirbitz.cancelRequest()
		this.setState({'forcePasswordLogin': false})
		LoginView.updateCurrentUser(account.username)
		if (window.parent.loginCallback) {
			this.refs.loginModal.close()
			window.parent.loginCallback(null, account)
		}
	},
	handleSignIn() {
		this.setState({showRegistration: false})
	},
	handleSignUp() {
		this.setState({showRegistration: true})
	},
	onClose () {
		this.refs.loginWithAirbitz.cancelRequest()
		if (this.refs.pinPasswordForm)
			this.refs.pinPasswordForm.onClose()
		if (window.parent.exitCallback) {
			window.parent.exitCallback()
		}
	}
})

var RegistrationForm = React.createClass({
	getInitialState() {
		return {
			showSuccess: false,
			account: null,
			usernameError: false
		}
	},
	render() {

		var usernameClass = classNames({
			'form-group': true,
			'has-error': this.state.usernameError
		})
		var regForm = (
				<AbcUiFormView ref='form'>
					<div className='row'>
						<div className='col-sm-12'>
							<div className={usernameClass}>
								<BootstrapInput type='text' ref='username' onKeyPress={this.handleKeypressUsername} placeholder='Choose a Username' className='form-control' onBlur={this.blur} onFocus={this.focus} />
							</div>
						</div>
						<div className='col-sm-12'>
							<div className='form-group'>
								<PasswordRequirementsInput ref='password' onKeyPress={this.handleKeypressPassword} placeholder='Choose a Password' className='form-control' />
							</div>
						</div>
						<div className='col-sm-12'>
							<div className='form-group'>
								<PasswordRequirementsInput ref='password_repeat' onKeyPress={this.handleKeypressPassword2} placeholder='Repeat Password' className='form-control' />
							</div>
						</div>

						<div className='col-sm-12'>
							<div className='form-group'>
								<div className='input-group'>
									<input type='password' ref='pin' onKeyPress={this.handleKeypressPin} maxLength='4' placeholder='Choose a 4 Digit PIN' className='form-control' />
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
		)

		var successMessage = (
			<div>
				<BootstrapModal ref='regModal' title={strings.account_created_text} onClose={this.onClose}>
					{String.format(strings.account_created_message, window.parent.abcuiContext.vendorName)}
					<br/><br/>
					{String.format(strings.account_created_zero_knowledge, window.parent.abcuiContext.vendorName)}
					<br/><br/>
					{String.format(strings.account_created_write_it_down, window.parent.abcuiContext.vendorName)}
					<br/><br/>
          <span className='input-group-btn'>
            <BootstrapButton onClick={this.onSuccessSetupRecovery}>{strings.setup_recovery_text}</BootstrapButton>
          </span>
          <span className='input-group-btn'>
            <BootstrapButton onClick={this.onSuccessClose}>{strings.later_button_text}</BootstrapButton>
          </span>
				</BootstrapModal>
			</div>
		)

		if (this.state.showSuccess) {
			return successMessage
		} else {
			return regForm
		}
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
					that.setState({usernameError: true})
					that.refs.username.setState({error:strings.username_already_taken, loading:null})
				} else {
					that.setState({usernameError: false})
					that.refs.username.setState({error:null, loading:null})
				}
			})
		} else {
			that.refs.username.setState({error: null})
		}
	},
	handleKeypressUsername (e) {
		if (e.key === 'Enter') {
			this.refs.password.setFocus()
		}
	},
	handleKeypressPassword (e) {
		if (e.key === 'Enter') {
			this.refs.password_repeat.setFocus()
		}
	},
	handleKeypressPassword2 (e) {
		if (e.key === 'Enter') {
			ReactDOM.findDOMNode(this.refs.pin).focus();
		}
	},
	handleKeypressPin (e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
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
		context.createAccount(username, this.refs.password.value(), this.refs.pin.value, function(err, result) {
			that.refs.register.setLoading(false)
			if (err) {
				that.refs.form.setState({'error': ABCError(err, 'Unable to register at this time.').message})
			} else {
				var account = result
				LoginView.updateCurrentUser(account.username)
				that.setState({account: account})
				that.setState({showSuccess: true})
			}
		})
		return false
	},
	onLogin (account) {
		LoginView.updateCurrentUser(account.username)
		// Need to Add UI to ask for a PIN
		// account.pinSetup(that.refs.pin.value, function(err, result) {
		if (window.parent.loginCallback) {
			window.parent.loginCallback(null, account)
		}
		that.refs.regModal.close()
		that.refs.register.setLoading(false)
		// })
	},
	onClose () {
		if (window.parent.exitCallback) {
			window.parent.exitCallback()
		}
	},
	onSuccessClose () {
		if (window.parent.loginCallback) {
			window.parent.loginCallback(null, this.state.account)
		}
	},
	onSuccessSetupRecovery () {
		if (window.parent.loginCallback) {
			window.parent.loginCallback(null, this.state.account, {setupRecovery: true})
		}
	}
})



module.exports = LoginView