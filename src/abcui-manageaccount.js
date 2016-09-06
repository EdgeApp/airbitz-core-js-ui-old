import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError
var strings = require('./abcui-strings')

var AbcUiFormView = require('./abcui-formview')

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var BootstrapInput = modal.BootstrapInput

var PasswordRequirementsInput = require('./abcui-password.js')

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

exports.ManageAccountView = ManageAccountView
exports.ChangePinView = ChangePinView
exports.ChangePasswordView = ChangePasswordView