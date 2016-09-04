import React from 'react'
import { render } from 'react-dom'
import abc from 'airbitz-core-js'

// var abcc = abc.ABCConditionCode
var ABCError = abc.ABCError

var AbcUiFormView = require('./abcui-formview')
var LoginWithAirbitz = require('./abcui-loginwithairbitz')

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var BootstrapInput = modal.BootstrapInput

var LoginView = require('./abcui-login')
var PasswordRequirementsInput = require('./abcui-password')

var context = window.parent.context

var RegistrationView = React.createClass({
  render() {
    return (
      <BootstrapModal
        ref='regModal'
        key='regModal'
        cancel='Cancel'
        title='Register'
        onClose={this.onClose}>

        <AbcUiFormView ref='form'>
          <LoginWithAirbitz onLogin={this.onLogin} register="true"/>
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
        LoginView.updateCurrentUser(account.username)
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
  onLogin (account) {
    LoginView.updateCurrentUser(account.username)
    // Need to Add UI to ask for a PIN
    // account.pinSetup(that.refs.pin.value, function(err, result) {
    if (window.parent.registrationCallback) {
      window.parent.registrationCallback(null, account)
    }
    that.refs.regModal.close()
    that.refs.register.setLoading(false)
    // })
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

module.exports = RegistrationView