import React from 'react'
import { render } from 'react-dom'

var BootstrapButton = React.createClass({
  getInitialState() {
    return {'loading': false}
  },
  render() {
    if (this.state.loading) {
      return (<button type='button' className='btn btn-primary' disabled='disabled'>
        <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>
      </button>)
    } else {
      return (<button type='button' {...this.props} className='btn btn-primary'>{this.props.children}</button>)
    }
  },
  setLoading(isLoading, callback) {
    this.setState({'loading': isLoading})
  }
})


var BootstrapModal = React.createClass({
  getInitialState() {
    return {'title': this.props.title}
  },
  componentDidMount() {
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: true})
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden)
  },
  componentWillUnmount() {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden)
  },
  close() {
    $(this.refs.root).modal('hide')
  },
  open() {
    $(this.refs.root).modal('show')
  },
  render() {
    return (
      <div className='modal fade' ref='root'>
        <div className='modal-dialog modal-sm'>
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
  handleCancel() {
    if (window.parent.exitCallback) {
      this.close()
      window.parent.exitCallback()
    }
  },
  handleHidden() {
    if (this.props.onHidden) {
      this.props.onHidden()
    }
  }
})

exports.BootstrapButton = BootstrapButton
exports.BootstrapModal = BootstrapModal