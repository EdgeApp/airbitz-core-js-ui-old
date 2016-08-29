import React from 'react'

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var AbcUiDropDown = require('./abcui-dropdown.js')
var strings = require('./abcui-strings.js').strings

var QuestionAnswerView = React.createClass({
  render () {
    if (this.props.setup) {
      return (
        <div className='col-sm-12'>
          <div className='form-group'>
            <AbcUiDropDown ref='question' contentList={this.props.questionChoices} selectedItem={this.props.question}/>
          </div>
          <div className='form-group'>
            <input type='text' ref='answer' placeholder={this.props.answer} className='form-control' />
          </div>
        </div>
      )
    } else {
      // XXX todo
    }
  },
  getValue() {
    return {
      'question': this.refs.question.getValue(),
      'answer': this.refs.answer.value
    }
  }

})


// Popup dialog asking for username and redirecting to RecoveryQAView with proper
// props setup
var RecoveryView = React.createClass({
  render() {
    'use strict'
    let recoveryToken
    // See if token is in the path
    if (this.props.token) {
      recoveryToken = this.props.token
    }
    return (<RecoveryQAView state='setup' questionChoices={questionChoices}></RecoveryQAView>)
  }
})


var SetupRecoveryView = React.createClass({
  render() {
    'use strict'

    // Query core for list of questions
    // Fake for now
    var questionChoices = [
      'Who\'s your daddy?',
      'Who dunit?',
      'Dude, where\'s my car?'
    ]
    return (<RecoveryQAView setup='1'
                            questionChoices={questionChoices}
                            callback={this.callback}/>)
  },
  callback(password, questions, answers)
  {
    'use strict'
    console.log(password)
    console.log(questions)
    console.log(answers)
  }

})



var RecoveryQAView = React.createClass({
  render() {
    'use strict'

    this.defaultText = strings.please_select_a_question
    let questions = ['', '']
    let answers = ['', '']
    let questionChoices = []
    if (this.props.setup) {
      questionChoices = [this.defaultText].concat(this.props.questionChoices)
      answers[0] = answers[1] = strings.answers_are_case_sensitive
    } else {
      // Todo
    }
    return (
      <BootstrapModal ref='modal' title={strings.password_recovery_text}>
        <form>
          <div className='row'>
            <QuestionAnswerView
              ref='qa1'
              question={questions[0]}
              answer={answers[0]}
              setup='1'
              questionChoices={questionChoices}/>
            <QuestionAnswerView
              ref='qa2'
              question={questions[1]}
              answer={answers[1]}
              setup='1'
              questionChoices={questionChoices}/>
            <div className='col-sm-12'>
              <div className='form-group'>
                <label>Current password</label>
                <input type='password' ref='currentPassword' placeholder={strings.current_password_text} className='form-control' />
              </div>
            </div>
            <div className='col-sm-12'>
              <div className='form-group'>
                <span className='input-group-btn'>
                  <BootstrapButton ref='register' onClick={this.handleSubmit}>{strings.save_button_text}</BootstrapButton>
                </span>
              </div>
            </div>
          </div>
        </form>
      </BootstrapModal>
    )
  },
  onChange(index, question, answer) {
    'use strict'
    this.state.question[index] = question
    this.state.answer[index] = answer
  },
  handleSubmit() {
    let questions = []
    let answers = []
    if (this.props.setup) {
      questions[0] = this.refs.qa1.getValue().question
      questions[1] = this.refs.qa2.getValue().question
      answers[0] = this.refs.qa1.getValue().answer
      answers[1] = this.refs.qa2.getValue().answer
      
      if (question[0] === this.defaultText ||
        question[1] === this.defaultText) {
        that.refs.form.setState({'error': ABCError(1, strings.please_choose_two_recovery).message})
      }
    } else {

    }

    this.props.callback(this.refs.currentPassword.value, questions, answers)
    this.refs.modal.close()
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  },
})

var ForgotPasswordForm = RecoveryView

// var ForgotPasswordForm_old = React.createClass({
//   render() {
//     return (
//       <BootstrapModal ref='modal' title='Change Recovery Information'>
//         <AbcUiFormView>
//           <div className='row'>
//             <div className='col-sm-12'>
//               <div className='form-group'>
//                 <label>Recovery Tokens information...</label>
//                 <input type='password' ref='username' placeholder='Recovery Token' className='form-control' />
//               </div>
//             </div>
//             <div className='col-sm-12'>
//               <div className='form-group'>
//                 <label htmlFor='question1'>Question 1 Text</label>
//                 <input type='text' id='question1' ref='question1' placeholder='Question 1 Answer' className='form-control' />
//               </div>
//             </div>
//             <div className='col-sm-12'>
//               <div className='form-group'>
//                 <label htmlFor='question2'>Question 2 Text</label>
//                 <input type='text' id='question2'  ref='question2' placeholder='Question 2 Answer' className='form-control' />
//               </div>
//             </div>
//             <div className='col-sm-12'>
//               <div className='form-group'>
//                 <span className='input-group-btn'>
//                   <BootstrapButton ref='register' onClick={this.handleSubmit}>Save</BootstrapButton>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </AbcUiFormView>
//       </BootstrapModal>)
//   },
//   handleSubmit() {
//     this.refs.modal.close()
//     if (window.parent.exitCallback) {
//       window.parent.exitCallback()
//     }
//   }
// })

module.exports.RecoveryView = RecoveryView
module.exports.SetupRecoveryView = SetupRecoveryView
