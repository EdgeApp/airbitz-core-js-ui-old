import React from 'react'
import { render } from 'react-dom'


var SetupRecoveryView = React.createClass({
  render() {
    return (
      <BootstrapModal ref="modal" title="Change Recovery Information">
        <form>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label>Recovery Tokens information...</label>
                <input type="password" ref="username" placeholder="Recovery Token" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="question1">Question 1 Text</label>
                <input type="text" id="question1" ref="question1" placeholder="Question 1 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="question2">Question 2 Text</label>
                <input type="text" id="question2"  ref="question2" placeholder="Question 2 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="register" onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
      </BootstrapModal>);
  },
  handleSubmit() {
    this.refs.modal.close();
    if (window.parent.exitCallback) {
      this.close();
      window.parent.exitCallback();
    }
  }
});

var ForgotPasswordForm = React.createClass({
  render() {
    return (
      <BootstrapModal ref="modal" title="Change Recovery Information">
        <form>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label>Recovery Tokens information...</label>
                <input type="password" ref="username" placeholder="Recovery Token" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="question1">Question 1 Text</label>
                <input type="text" id="question1" ref="question1" placeholder="Question 1 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="question2">Question 2 Text</label>
                <input type="text" id="question2"  ref="question2" placeholder="Question 2 Answer" className="form-control" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <span className="input-group-btn">
                  <BootstrapButton ref="register" onClick={this.handleSubmit}>Save</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
      </BootstrapModal>);
  },
  handleSubmit() {
    this.refs.modal.close();
    if (window.parent.exitCallback) {
      window.parent.exitCallback();
    }
  }
});

module.exports.SetupRecoveryView = SetupRecoveryView
module.exports.ForgotPasswordForm = ForgotPasswordForm