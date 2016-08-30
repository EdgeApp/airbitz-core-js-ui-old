import React from 'react'
import abc from 'airbitz-core-js'

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var AbcUiDropDown = require('./abcui-dropdown.js')
var AbcUiFormView = require('./abcui-formview.js')
var strings = require('./abcui-strings.js').strings
var ABCError = abc.ABCError
var Modal = require('react-modal');

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

    this.account = window.parent.account
    if (this.account === null ||
        this.account.isLoggedIn() === false) {
      console.log('Error: Account not logged in for recovery setup')
      return
    }
    let questions = ['', '']
    let answers = ['', '']

    answers[0] = answers[1] = strings.answers_are_case_sensitive

    // Query core for list of questions
    // Fake for now
    var questionChoices = [
      'Who\'s your daddy?',
      'Who dunit?',
      'Dude, where\'s my car?'
    ]
    questionChoices = [strings.please_select_a_question].concat(questionChoices)

    return (
      <BootstrapModal id='recoverymodal' ref='modal' title={strings.password_recovery_text}>
        <AbcUiFormView ref='form'>
          <RecoveryQAView setup='1'
                          questions={questions}
                          answers={answers}
                          questionChoices={questionChoices}
                          callback={this.callback}/>
        </AbcUiFormView>
      </BootstrapModal>
    )
  },
  callback(password, questions, answers)
  {
    'use strict'
    console.log(password)
    console.log(questions)
    console.log(answers)

    if (questions[0] === strings.please_select_a_question ||
      questions[1] === strings.please_select_a_question) {
      this.refs.form.setState({'error': ABCError(1, strings.please_choose_two_recovery).message})
      return
    }

    if (answers[0].length < 4 || answers[1].length < 4) {
      this.refs.form.setState({'error': ABCError(1, strings.please_choose_answers_with_4_char).message})
      return
    }

    if (password != null) {
      var passwdOk = this.account.checkPassword(password)
      // var passwdOk = true;

      if (!passwdOk) {
        this.refs.form.setState({'error': ABCError(1, strings.incorrect_password_text).message})
        return
      } else {
        console.log('Yay. good password')
        // Open another modal

        this.refs.modal.close()
        if (window.parent.exitCallback) {
          window.parent.exitCallback()
        }

      }
    }


  }
})



var RecoveryQAView = React.createClass({
  render() {
    'use strict'

    return (
          <div className='row'>
            <QuestionAnswerView
              ref='qa1'
              question={this.props.questions[0]}
              answer={this.props.answers[0]}
              setup='1'
              questionChoices={this.props.questionChoices}/>
            <QuestionAnswerView
              ref='qa2'
              question={this.props.questions[1]}
              answer={this.props.answers[1]}
              setup='1'
              questionChoices={this.props.questionChoices}/>
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
    )
  },
  handleSubmit() {
    let questions = []
    let answers = []
    let password = ''
    questions[0] = this.refs.qa1.getValue().question
    questions[1] = this.refs.qa2.getValue().question
    answers[0] = this.refs.qa1.getValue().answer
    answers[1] = this.refs.qa2.getValue().answer
    password = this.refs.currentPassword.value

    this.props.callback(this.refs.currentPassword.value, questions, answers)
  },
})

var Modal = require('react-bootstrap-modal')

class ModalExample extends React.Component {

  render(){
    let closeModal = () => this.setState({ open: false })

    let saveAndClose = () => {
      api.saveData()
        .then(() => this.setState({ open: false }))
    }

    return (
      <div>
        <button type='button'>Launch modal</button>

        <Modal
          show={this.state.open}
          onHide={closeModal}
          aria-labelledby="ModalHeader"
        >
          <Modal.Header closeButton>
            <Modal.Title id='ModalHeader'>A Title Goes here</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Some Content here</p>
          </Modal.Body>
          <Modal.Footer>
            // If you don't have anything fancy to do you can use
            // the convenient `Dismiss` component, it will
            // trigger `onHide` when clicked
            <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>

            // Or you can create your own dismiss buttons
            <button className='btn btn-primary' onClick={saveAndClose}>
              Save
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}


module.exports.RecoveryView = RecoveryView
module.exports.SetupRecoveryView = SetupRecoveryView
