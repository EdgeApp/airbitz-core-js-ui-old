import React from 'react'
import abc from 'airbitz-core-js'

var modal = require('./abcui-modal.js')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var AbcUiDropDown = require('./abcui-dropdown.js')
var AbcUiFormView = require('./abcui-formview.js')
var strings = require('./abcui-strings')
var ABCError = abc.ABCError
var tools = require('./abcui-tools.js')

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

    var bodyText = String.format(strings.if_recovery_setup, '')

    return (
      <div>
        <BootstrapModal title={strings.password_recovery_text} onClose={this.onClose}>
          {strings.if_recovery_setup}<br/><br/>
          <a href='https://airbitz.co/app' target='_blank'>https://airbitz.co/app</a><br/><br/>
          {strings.if_recovery_setup2}<br/><br/>
          <span className='input-group-btn'>
            <BootstrapButton ref='btn-close' onClick={this.onClose}>{strings.ok_button_text}</BootstrapButton>
          </span>
        </BootstrapModal>
      </div>
    )
  },
  onClose () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var SetupRecoveryView = React.createClass({
  getInitialState: function() {
    return {
      showEmailModal: false,
      showQAModal: true,
      showDone: false
    }
  },
  render() {
    'use strict'

    this.recoveryToken = ''
    this.account = window.parent.abcAccount
    this.vendorName = window.parent.uiContext.vendorName
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
      <div>

        {this.state.showQAModal ? (
          <BootstrapModal id='recoverymodal' ref='modal' title={strings.password_recovery_text} onClose={this.onCloseQA}>
            <AbcUiFormView ref='form'>
              <RecoveryQAView setup='1'
                              questions={questions}
                              answers={answers}
                              questionChoices={questionChoices}
                              callback={this.callback}/>
            </AbcUiFormView>
          </BootstrapModal>
        ) : null}

        {this.state.showEmailModal ? (
          <BootstrapModal id='emailmodal' ref='emailmodal' title={strings.save_recovery_token_popup} onClose={this.onCloseEmail}>
            <AbcUiFormView ref='emailform'>
              <label>{strings.save_recovery_token_popup_message}</label>
              <input type='text' ref='email' placeholder={strings.email_address_text} className='form-control' /><br/>

                <a className="btn btn-block btn-social btn-google" onClick={this.callBackGmail}>
                  <span className="fa fa-google"></span>
                  {String.format(strings.send_using_xx, 'Gmail')}
                </a>

                <a className="btn btn-block btn-social btn-yahoo" onClick={this.callBackYahoo}>
                  <span className="fa fa-yahoo"></span>
                  {String.format(strings.send_using_xx, 'Yahoo')}
                </a>

                <a className="btn btn-block btn-social btn-microsoft" onClick={this.callBackYahoo}>
                  <span className="fa fa-windows"></span>
                  {String.format(strings.send_using_xx, 'Hotmail, Outlook, Live Mail')}
                </a>

                <a className="btn btn-block btn-social btn-reddit" onClick={this.callBackEmail}>
                  <span className="fa fa-envelope"></span>
                  {String.format(strings.send_using_xx, 'Email App')}
                </a><br/>

                {this.state.showDone ? (
                  <a className="btn btn-block btn-primary" onClick={this.callBackEmailDone}>
                    {strings.done_text}
                  </a>
                ) : null}
            </AbcUiFormView>
          </BootstrapModal>
        ) : null}

      </div>
    )
  },
  onCloseQA () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  },
  onCloseEmail () {
    'use strict';
    this.showEmail(false)
  },
  showEmail (show) {
    'use strict';
    this.setState({showEmailModal: show})
  },
  showQA (show) {
    'use strict';
    this.setState({showQAModal: show})
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

    if (password != null)
    {
      var passwdOk = this.account.checkPassword(password)
      // var passwdOk = true;

      if (!passwdOk) {
        this.refs.form.setState({'error': ABCError(1, strings.incorrect_password_text).message})
        return
      } else {
        console.log('Yay. good password')

        window.that = this
        this.account.setupRecovery2Questions(questions, answers, function (error, recoveryToken) {

          // ABC is erroring for some reason. Fake the recovery token for now

          if (error) {
            this.refs.form.setState({'error': ABCError(error, ).message})
          } else
          {
            var that = window.that
            // that.recoveryToken = recoveryToken
            that.setState({recoveryToken: recoveryToken})
            // Open another modal
            that.showQA(true)
            that.showEmail(true)
          }
        })
      }
    }
  },
  callBackGmail () {
    var url = 'https://mail.google.com/mail/?view=cm&fs=1&to={0}&su={1}&body={2}'
    this.callBackEmail(url)
  },
  callBackEmailGeneric () {
    var url = 'mailto:{0}?subject={1}&body={2}'
    this.callBackEmail(url)
  },
  callBackYahoo () {
    var url = 'http://compose.mail.yahoo.com/?to={0}&subj={1}&body={2}'
    this.callBackEmail(url)
  },
  callBackMicrosoft () {
    var url = 'https://mail.live.com/default.aspx?rru=compose&to={0}&subject={1}&body={2}'
    this.callBackEmail(url)
  },
  callBackEmail (vendorEmailUrl) {
    'use strict'
    console.log(this.refs.email.value)
    
    if (tools.validateEmail(this.refs.email.value)) {
      console.log('good email')

      var regex = /.*\/assets\/index.html#/
      var results = regex.exec(window.location.href)
      var link = results[0]
      var recoveryLink = link + '/recovery/' + this.state.recoveryToken
      var username = 'NoName'

      if (this.account) {
        username = tools.obfuscateUsername(this.account.username)
      }

      var mobileLinks = String.format('iOS\n{0}://recovery?token={1}\n\n' +
        'Android\nhttps://recovery.airbitz.co/recovery?token={1}', 'airbitz', this.state.recoveryToken)

      var emailTo = this.refs.email.value
      var emailSubject = String.format(strings.recovery_email_subject, this.vendorName)
      emailSubject = encodeURI(emailSubject)
      var emailBody = String.format(strings.recovery_token_email_body, 'Airbitz', username, mobileLinks)
      emailBody = encodeURI(emailBody)

      // Swap out the '#' for '%23' as encodeURI doesn't seem to do it and it breaks Gmail
      emailBody = emailBody.replace('index.html#', 'index.html%23')

      var urlFinal = String.format(vendorEmailUrl, emailTo, emailSubject, emailBody)
      this.setState({'showDone': true})
      window.open(urlFinal, '_blank');
    } else {
      this.refs.emailform.setState({'error': ABCError(1, strings.invalid_email_address).message})
    }
  },
  callBackEmailDone () {
    'use strict';
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

String.format = function(format) {
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
  })
}

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

module.exports.RecoveryView = RecoveryView
module.exports.SetupRecoveryView = SetupRecoveryView
