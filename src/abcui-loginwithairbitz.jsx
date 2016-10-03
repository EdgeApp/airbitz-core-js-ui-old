import React from 'react'

var JsBarcode = require('jsbarcode')
var strings = require('./abcui-strings')

var context = window.parent.abcContext
var vendorName = window.parent.abcuiContext.vendorName

var LoginWithAirbitz = React.createClass({
  getInitialState () {
    return {
      barcode: '',
      showLogin: false
    }
  },
  cancelRequest () {
    if (this.state.edgeLoginRequest) {
      this.state.edgeLoginRequest.cancelRequest()
    }
  },
  render () {
    var buttonUrl = 'airbitz-ret://x-callback-uri/edgelogin/[EDGELOGINTOKEN]'
    buttonUrl = encodeURI(buttonUrl)
    this.buttonBouncerUrl = 'https://airbitz.co/blf/?address=' + buttonUrl

    return (
      <div className="row">
        <div className="col-sm-12 text-center">
          <div className="form-group center-block" style={{'width': '320px'}}>
            <a className="btn btn-block btn-social btn-facebook" onClick={this.onClick}>
              <img src="Airbitz-icon-white-transparent.png" style={{'width': '28px', 'padding': '4px'}} />
              {this.props.register ? strings.scan_barcode_to_register : strings.scan_barcode_to_signin}
            </a>
          </div>
          <div className="form-group center-block" style={{'width': '240px'}}>
            <img id="barcode" style={{'width': '240px'}} />
          </div>
          <div className="form-group center-block" >
            <label>OR</label>
          </div>
        </div>
      </div>
		)
  },
  componentDidMount () {
    var that = this
    context.requestEdgeLogin({displayName: vendorName, onLogin: this.handleEdgeLogin}, function (error, results) {
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
