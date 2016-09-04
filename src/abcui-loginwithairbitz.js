import React from 'react'
import { render } from 'react-dom'

var JsBarcode = require('jsbarcode');
var strings = require('./abcui-strings')

var context = window.parent.context

var LoginWithAirbitz = React.createClass({
	getInitialState () {
		return {
			barcode: '',
			showLogin: false
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
					<div className='form-group center-block' style={{'width': '240px'}}>
						<img id='barcode' style={{'width': '240px'}}/>
					</div>
					<div className='form-group center-block' >
						<label>OR</label>
					</div>
				</div>
			</div>
		)
	},
	componentDidMount () {
		context.requestEdgeLogin({displayName: 'Airbitz UI Test App', onLogin:this.props.onLogin}, function (error, results) {
			if (results) {
				JsBarcode("#barcode", results.id, {
					format: "CODE128A",
					lineColor: "#333333",
					width: 6,
					height: 140,
					fontSize: 36,
					displayValue: true
				})
			} else {
				// XXX
			}
		})
	},
	onClick () {
		window.open(this.buttonBouncerUrl, '_blank')
	}
})

module.exports = LoginWithAirbitz