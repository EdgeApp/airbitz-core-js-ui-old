import React from 'react'
import { render } from 'react-dom'
var strings = require('./abcui-strings.js').strings


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

exports = PasswordRequirementsInput