import React from 'react'

var JsBarcode = require('jsbarcode')
var strings = require('./abcui-strings')

var context = window.parent.abcContext
var vendorName = window.parent.abcuiContext.vendorName
var vendorImageUrl = window.parent.abcuiContext.vendorImageUrl

var LoginWithAirbitz = React.createClass({
  getInitialState () {
    return {
      barcode: '',
      initiatingLogin: null,
      showLogin: false
    }
  },
  cancelRequest () {
    if (this.state.edgeLoginRequest) {
      this.state.edgeLoginRequest.cancelRequest()
    }
  },
  render () {
    this.buttonBouncerUrl = ''
    if (this.state.edgeLoginRequest) {
      this.buttonBouncerUrl = 'https://airbitz.co/elf/?address=' + this.state.edgeLoginRequest.id
    }

    return (
      <div className='row'>
        <div className='col-sm-12 text-center'>
          <div className='form-group center-block' style={{'width': '320px'}}>
            <a className='btn btn-block btn-social btn-facebook' onClick={this.onClick}>
              <img src='Airbitz-icon-white-transparent.png' style={{'width': '28px', 'padding': '4px'}} />
              {this.props.register ? strings.scan_barcode_to_register : strings.scan_barcode_to_signin}
            </a>
          </div>
          {this.state.initiatingLogin === null ? (
            <div className='form-group center-block' style={{'width': '240px'}}>
              <img id='barcode' style={{'width': '240px'}} />
            </div>) : (
              <div className='form-group text-center'>
              Initiating Login for user<br />
                <b>{this.state.initiatingLogin}</b><br />
                <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate' />
              </div>)}
          <div className='form-group center-block' >
            <label>OR</label>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount () {
    var that = this
    context.requestEdgeLogin({
      displayName: vendorName,
      displayImageUrl: vendorImageUrl,
      onLogin: this.handleEdgeLogin,
      onProcessLogin: this.handleProcessLogin
    }, function (error, results) {
      if (error) {
        // XXX todo -paulvp
      } else if (results) {
        JsBarcode('#barcode', results.id, {
          format: 'CODE128A',
          lineColor: '#333333',
          width: 6,
          height: 140,
          fontSize: 36,
          displayValue: true
        })
        that.setState({edgeLoginRequest: results})
      }
    })
  },
  handleProcessLogin (username) {
    this.setState({initiatingLogin: username})
  },
  handleEdgeLogin (error, account) {
    if (error) {
      console.log('Error on Edge Login')
    } else {
      this.props.onLogin(account)
    }
  },
  onClick () {
    window.open(this.buttonBouncerUrl, '_blank')
  }
})

module.exports = LoginWithAirbitz
