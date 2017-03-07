import React from 'react'
import { Link } from 'react-router'
import {ABCError} from 'airbitz-core-js'

var strings = require('./abcui-strings')

var AbcUiFormView = require('./abcui-formview.jsx')

var modal = require('./abcui-modal.jsx')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var BootstrapInput = modal.BootstrapInput

var PasswordRequirementsInput = require('./abcui-password.jsx')

var ManageAccountView = React.createClass({
  render () {
    return (
      <BootstrapModal ref='modal' title='Manage Account' onClose={this.onClose}>
        <h4>ACCOUNT: <span>{window.parent.abcAccount.username}</span></h4>
        <ul className='list-unstyled'>
          <li><Link className='btn' to={'/account/changepassword'}>Change Password</Link></li>
          <li><Link className='btn' to={'/account/changepin'}>Change Pin</Link></li>
          <li><Link className='btn' to={'/account/setuprecovery'}>Setup/Change Recovery</Link></li>
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
  // togglePinEnabled () {
  //  this.refs.pinEnabled.checked = !this.refs.pinEnabled.checked
  //  this.pinEnableChanged()
  // },
  // pinEnableChanged () {
  //  alert(this.refs.pinEnabled.checked)
  // },
  onClose () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var ChangePasswordView = React.createClass({
  render () {
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
  passwordsMatch () {
    return this.refs.confirmPassword.value() === this.refs.password.value()
  },
  comparePasswords () {
    var confirmPassword = this.refs.confirmPassword
    if (this.passwordsMatch()) {
      confirmPassword.setState({'error': null})
    } else {
      confirmPassword.setState({'error': 'Password mismatch'})
    }
  },
  handleSubmit () {
    var that = this
    var account = window.parent.abcAccount

    if (!this.refs.password.meetsRequirements()) {
      this.refs.form.setState({'error': 'Insufficient password'})
    } else if (!this.passwordsMatch()) {
      this.refs.form.setState({'error': 'Password mismatch'})
    } else {
      account.passwordOk(this.refs.currentPassword.value).then((isPasswordCorrect) => {
        if (isPasswordCorrect) {
          this.refs.changeButton.setLoading(true)
          window.parent.abcAccount.passwordSetup(this.refs.password.value(), function (err, result) {
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
      })
    }
  },
  onClose () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var ChangePinView = React.createClass({
  render () {
    return (
      <BootstrapModal ref='modal' title={this.props.route.title} onClose={this.onClose}>
        <AbcUiFormView ref='form'>
          <div className='row'>
            {!this.props.route.noRequirePassword ? (
              <div className='col-sm-12'>
                <div className='form-group'>
                  <div className='input-group'>
                    <input type='password' ref='currentPassword' onKeyPress={this.handlePasswordKeyPress} placeholder='Current Password' className='form-control' />
                  </div>
                </div>
              </div>
            ) : null}
            <div className='col-sm-12'>
              <div className='form-group'>
                <div className='input-group'>
                  <input type='password' ref='pin' onKeyPress={this.handlePinKeyPress} placeholder='New PIN' className='form-control' maxLength='4' />
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
        </AbcUiFormView>
      </BootstrapModal>)
  },
  handlePasswordKeyPress (e) {
    if (e.key === 'Enter') {
      this.refs.pin.getInputDOMNode().focus()
    }
  },
  handlePinKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  },
  handleSubmit () {
    var that = this
    var account = window.parent.abcAccount

    if (this.props.route.noRequirePassword) {
      // change the pin
      this.refs.changeButton.setLoading(true)
      window.parent.abcAccount.pinSetup(this.refs.pin.value, function (err, result) {
        if (err) {
          that.refs.form.setState({'error': ABCError(err, strings.error_setting_pin_text).message})
        } else {
          that.refs.modal.close()
          if (window.parent.exitCallback) {
            window.parent.exitCallback()
          }
        }
        that.refs.changeButton.setLoading(false)
      })
    } else {
      account.passwordOk(this.refs.currentPassword.value).then((isPasswordCorrect) => {
        if (isPasswordCorrect) {
          // change the pin
          this.refs.changeButton.setLoading(true)
          window.parent.abcAccount.pinSetup(this.refs.pin.value, function (err, result) {
            if (err) {
              that.refs.form.setState({'error': ABCError(err, strings.error_setting_pin_text).message})
            } else {
              that.refs.modal.close()
              if (window.parent.exitCallback) {
                window.parent.exitCallback()
              }
            }
            that.refs.changeButton.setLoading(false)
          })
        } else {
          // incorrect password
          that.refs.form.setState({'error': 'Incorrect current password'})
        }
      })
    }
  },

  onClose () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

exports.ManageAccountView = ManageAccountView
exports.ChangePinView = ChangePinView
exports.ChangePasswordView = ChangePasswordView
