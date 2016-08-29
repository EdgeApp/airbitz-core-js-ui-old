import React from 'react'
import { render } from 'react-dom'

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal

// var RecoveryView = React.createClass({
//   render() {
//
//     var form = (
//       <BootstrapModal ref="modal" title="Change Recovery Information">
//         <form>
//           <div className="row">
//
//             <div className="col-sm-12">
//               <div className="form-group">
//                 <label htmlFor="question1">Question 1 Text</label>
//                 <input type="text" id="question1" ref="question1" placeholder="Question 1 Answer" className="form-control" />
//               </div>
//             </div>
//             <div className="col-sm-12">
//               <div className="form-group">
//                 <label htmlFor="question2">Question 2 Text</label>
//                 <input type="text" id="question2"  ref="question2" placeholder="Question 2 Answer" className="form-control" />
//               </div>
//             </div>
//             <div className="col-sm-12">
//               <div className="form-group">
//                 <span className="input-group-btn">
//                   <BootstrapButton ref="register" onClick={this.handleSubmit}>Save</BootstrapButton>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </form>
//       </BootstrapModal>)
//
//     var question = (
//       <div className="col-sm-12">
//         <div className="form-group">
//           <label>Recovery Tokens information...</label>
//           <input type="password" ref="username" placeholder="Recovery Token" className="form-control" />
//         </div>
//       </div>
//     )
//
//     return form
//   },
//   handleSubmit() {
//     this.refs.modal.close();
//     if (window.parent.exitCallback) {
//       this.close();
//       window.parent.exitCallback();
//     }
//   }
// });

var QuestionAnswerView = React.createClass({
  render() {
    "use strict";
    var questionIndex = "question" + this.props.index
    var answerIndex = "answer" + this.props.index
    return (
      <div className="col-sm-12">
        <div className="form-group">
          <input type="text" id={questionIndex} ref={questionIndex} placeholder={this.props.question} className="form-control" />
        </div>
        <div className="form-group">
          <input type="text" id={answerIndex} ref={answerIndex} placeholder={this.props.question} className="form-control" />
        </div>
      </div>
    )
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
    } else {
      // Todo
    }
    return (
      <BootstrapModal ref="modal" title="Change Recovery Information">
        <form>
          <div className="row">
            {this.createQAViews(questions, answers, questionChoices)}
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
  handleSubmit() {
    this.refs.modal.close();
    if (window.parent.exitCallback) {
      this.close();
      window.parent.exitCallback();
    }

    let questions = []
    let answers = []
    if (this.props.setup) {
      questions[0] = this.refs.question1
      questions[1] = this.refs.question2
      answers[0] = this.refs.answers1
      answers[1] = this.refs.answers2
    } else {

    }
    this.props.callback(this.refs.currentPassword, questions, answers)
  },
  createQAViews(questions, answers, questionChoices) {
    "use strict"
    var index = 0

      return (<QuestionAnswerView question={questions[0]}
                                  answer={answers[0]}
                                  questionChoices={questionChoices}
                                  index={index.toString()} />)
    // questions.map(function(questionString, index) {
    //   return (<QuestionAnswerView question={questionString}
    //                               answer={answers[index]}
    //                               questionChoices={questionChoices}
    //                               index={index.toString()} />)
    // })
  }


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