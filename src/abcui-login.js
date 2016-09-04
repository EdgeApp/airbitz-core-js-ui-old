import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError
var strings = require('./abcui-strings.js').strings

var AbcUiFormView = require('./abcui-formview')
var LoginWithAirbitz = require('./abcui-loginwithairbitz')

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal

var context = window.parent.context

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
				<LoginWithAirbitz onLogin={this.props.onSuccess}/>
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
				<LoginWithAirbitz onLogin={this.props.onSuccess}/>
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

var LoginView = React.createClass({
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
		var currentUser = LoginView.currentUser()
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
		LoginView.updateCurrentUser(newUsername)
		this.setState({'forcePasswordLogin': false})
	},
	handleSuccess(account) {
		this.setState({'forcePasswordLogin': false})
		LoginView.updateCurrentUser(account.username)
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

exports = LoginView