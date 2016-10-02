import React from 'react'

var AbcUiFormView = React.createClass({
  getInitialState () {
    return { error: null }
  },
  render () {
    var errorView = null
    if (this.state.error) {
      errorView = (
        <div className='form-group has-error text-center'>
          <span className='help-block'>{this.state.error}</span>
        </div>)
    }
    return (
      <form className='form'>
        {errorView}
        {this.props.children}
      </form>
    )
  }
})

module.exports = AbcUiFormView
