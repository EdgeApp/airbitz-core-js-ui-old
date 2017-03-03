/* global $ */

import React from 'react'

var BootstrapButton = React.createClass({
  getInitialState () {
    return {'loading': false}
  },
  render () {
    if (this.state.loading) {
      return (<button type='button' className='btn btn-primary' disabled='disabled'>
        <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate' />
      </button>)
    } else {
      return (<button type='button' {...this.props} className='btn btn-primary'>{this.props.children}</button>)
    }
  },
  setLoading (isLoading, callback) {
    this.setState({'loading': isLoading})
  }
})

var BootstrapInput = React.createClass({
  getInitialState () {
    return { error: null, loading: null }
  },
  render () {
    // var classes = 'form-group '
    let subView
    if (this.state.loading) {
      subView = (<span className='help-block'><span className='glyphicon glyphicon-refresh glyphicon-refresh-animate' /> {this.state.loading}</span>)
    } else if (this.state.error) {
      subView = (<span className='help-block'>{this.state.error}</span>)
      // classes += 'has-error'
    }
    return (
      <div className='{classes}'>
        <input ref='input' onKeyPress={this.onKeyPress} {...this.props} />
        {subView}
      </div>)
  },
  onKeyPress (e) {
    if (this.props.onKeyPress) {
      this.props.onKeyPress(e)
    }
  },
  value () {
    return this.refs.input.value
  }
})

var BootstrapModal = React.createClass({
  getInitialState () {
    return {'title': this.props.title}
  },
  componentDidMount () {
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: true})
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden)
  },
  componentWillUnmount () {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden)
  },
  close () {
    $(this.refs.root).modal('hide')
  },
  open () {
    $(this.refs.root).modal('show')
  },
  render () {
    return (
      <div className='modal fade' ref='root'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button
                type='button'
                className='close'
                onClick={this.handleCancel}>
                &times;
              </button>
              <h4>{this.state.title}</h4>
            </div>
            <div className='modal-body'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  },
  handleCancel () {
    if (this.props.onClose) {
      // Parent will take care of closing the modal
      this.props.onClose()
    } else {
      this.close()
    }
  },
  handleHidden () {
    if (this.props.onHidden) {
      this.props.onHidden()
    }
  }
})

exports.BootstrapButton = BootstrapButton
exports.BootstrapModal = BootstrapModal
exports.BootstrapInput = BootstrapInput
