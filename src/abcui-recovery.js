import React from 'react'
import { render } from 'react-dom'

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal

var QuestionAnswerView = React.createClass({
  render() {
    return (
      <div className="col-sm-12">
        <div className="form-group">
          <input type="text" ref="question" placeholder={this.props.question} className="form-control" />
        </div>
        <div className="form-group">
          <input type="text" ref="answer" placeholder={this.props.answer} className="form-control" />
        </div>
      </div>
    )
  },
  value() {
    return {
      "question": this.refs.question.value,
      "answer": this.refs.answer.value
    }
  }

})


// Popup dialog asking for username and redirecting to RecoveryQAView with proper
// props setup
var RecoveryView = React.createClass({
  render() {
    "use strict";
    let recoveryToken
    // See if token is in the path
    if (this.props.token) {
      recoveryToken = this.props.token
    }
    return (<RecoveryQAView state="setup" questionChoices={questionChoices}></RecoveryQAView>)
  }
})


var SetupRecoveryView = React.createClass({
  render() {
    "use strict";

    // Query core for list of questions
    // Fake for now
    var questionChoices = [
      'Who\'s your daddy?',
      'Who dunit?',
      'Dude, where\'s my car?'
    ]
    return (<RecoveryQAView setup="1"
                            questionChoices={questionChoices}
                            callback={this.callback}/>)
  },
  callback(password, questions, answers)
  {
    "use strict";
    console.log(password)
    console.log(questions)
    console.log(answers)
  }

})



var RecoveryQAView = React.createClass({
  render() {
    "use strict";

    let questions = ["", ""]
    let answers = ["", ""]
    let questionChoices
    if (this.props.setup) {
      questionChoices = this.props.questionChoices
      questions[0] = questions[1] = "Please choose a recovery question"
      answers[0] = answers[1] = "Answers are case sensitive"
    } else {
      // Todo
    }
    return (
      <BootstrapModal ref="modal" title="Change Recovery Information">
        <form>
          <div className="row">
            <QuestionAnswerView
              ref="qa1"
              question={questions[0]}
              answer={answers[0]}
              questionChoices={questionChoices}/>
            <QuestionAnswerView
              ref="qa2"
              question={questions[1]}
              answer={answers[1]}
              questionChoices={questionChoices}/>
            <div className="col-sm-12">
              <div className="form-group">
                <label>Current password</label>
                <input type="password" ref="currentPassword" placeholder="Current Password" className="form-control" />
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
      </BootstrapModal>
    )
  },
  onChange(index, question, answer) {
    "use strict";
    this.state.question[index] = question
    this.state.answer[index] = answer
  },
  handleSubmit() {
    let questions = []
    let answers = []
    if (this.props.setup) {
      questions[0] = this.refs.qa1.value().question
      questions[1] = this.refs.qa2.value().question
      answers[0] = this.refs.qa1.value().answer
      answers[1] = this.refs.qa2.value().answer
    } else {

    }

    this.props.callback(this.refs.currentPassword.value, questions, answers)
    this.refs.modal.close();
    if (window.parent.exitCallback) {
      window.parent.exitCallback();
    }
  },
});

var ForgotPasswordForm = RecoveryView;

var ForgotPasswordForm_old = React.createClass({
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

module.exports.RecoveryView = RecoveryView
module.exports.SetupRecoveryView = SetupRecoveryView
module.exports.ForgotPasswordForm = ForgotPasswordForm