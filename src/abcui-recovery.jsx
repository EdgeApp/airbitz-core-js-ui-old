import React from 'react'
import abc from 'airbitz-core-js'

var modal = require('./abcui-modal.jsx')
var BootstrapButton = modal.BootstrapButton
var BootstrapModal = modal.BootstrapModal
var AbcUiDropDown = require('./abcui-dropdown.jsx')
var AbcUiFormView = require('./abcui-formview.jsx')
var strings = require('./abcui-strings')
var ABCError = abc.ABCError
var tools = require('./abcui-tools')

var context = window.parent.abcContext

var QuestionAnswerView = React.createClass({
  render () {
    if (this.props.setup) {
      return (
        <div className="col-sm-12">
          <div className="form-group">
            <AbcUiDropDown ref="question" contentList={this.props.questionChoices} selectedItem={this.props.question} />
          </div>
          <div className="form-group">
            <input type="text" ref="answer" placeholder={this.props.answer} className="form-control" />
          </div>
        </div>
      )
    } else {
      // XXX todo
    }
  },
  getValue () {
    return {
      'question': this.refs.question.getValue(),
      'answer': this.refs.answer.value
    }
  }

})

// Popup dialog asking for username and redirecting to RecoveryQAView with proper
// props setup
var RecoveryView = React.createClass({
  render () {
    return (
      <div>
        <BootstrapModal title={strings.password_recovery_text} onClose={this.onClose}>
          {strings.if_recovery_setup}<br /><br />
          <a href="https://airbitz.co/app" target="_blank">https://airbitz.co/app</a><br /><br />
          {strings.if_recovery_setup2}<br /><br />
          <span className="input-group-btn">
            <BootstrapButton ref="btn-close" onClick={this.onClose}>{strings.ok_button_text}</BootstrapButton>
          </span>
        </BootstrapModal>
      </div>
    )
  },
  onClose () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

var SetupRecoveryView = React.createClass({
  getInitialState: function () {
    return {
      showEmailModal: false,
      showQAModal: true,
      showDone: false,
      questionChoices: []
    }
  },
  render () {
    'use strict'

    this.recoveryToken = ''
    this.account = window.parent.abcAccount
    this.vendorName = window.parent.abcuiContext.vendorName
    if (this.account === null ||
        this.account.isLoggedIn() === false) {
      console.log('Error: Account not logged in for recovery setup')
      return
    }
    let questions = ['', '']
    let answers = ['', '']

    answers[0] = answers[1] = strings.answers_are_case_sensitive

    return (
      <div>

        {this.state.showQAModal ? (
          <BootstrapModal id="recoverymodal" ref="modal" title={strings.password_recovery_text} onClose={this.onCloseQA}>
            <AbcUiFormView ref="form">
              <RecoveryQAView setup="1"
                questions={questions}
                answers={answers}
                questionChoices={this.state.questionChoices}
                requirePassword={!this.props.route.noRequirePassword}
                callback={this.callback} />
            </AbcUiFormView>
          </BootstrapModal>
        ) : null}

        {this.state.showEmailModal ? (
          <BootstrapModal id="emailmodal" ref="emailmodal" title={strings.save_recovery_token_popup} onClose={this.onCloseEmail}>
            <AbcUiFormView ref="emailform">
              <label>{strings.save_recovery_token_popup_message}</label>
              <input type="text" ref="email" placeholder={strings.email_address_text} className="form-control" /><br />
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
              </a><br />

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
  componentDidMount () {
    context.listRecoveryQuestionChoices((error, questionChoices) => {
      if (!error) {
        var questions = []
        for (var i in questionChoices) {
          var qc = questionChoices[i]
          if (qc.category === 'recovery2') {
            questions.push(qc.question)
          }
        }

        questions = [strings.please_select_a_question].concat(questions)
        this.setState({questionChoices: questions})
      } else {
        this.setState({questionChoices: strings.error_retrieving_questions})
      }
    })
  },
  onCloseQA () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  },
  onCloseEmail () {
    'use strict'
    this.showEmail(false)
  },
  showEmail (show) {
    'use strict'
    this.setState({showEmailModal: show})
  },
  showQA (show) {
    'use strict'
    this.setState({showQAModal: show})
  },
  callback (questions, answers, password) {
    console.log(questions)
    console.log(answers)
    console.log(password)

    if (questions[0] === strings.please_select_a_question ||
      questions[1] === strings.please_select_a_question) {
      this.refs.form.setState({'error': ABCError(1, strings.please_choose_two_recovery).message})
      return
    }

    if (answers[0].length < 4 || answers[1].length < 4) {
      this.refs.form.setState({'error': ABCError(1, strings.please_choose_answers_with_4_char).message})
      return
    }

    if (!this.props.route.noRequirePassword) {
      if (!password) {
        this.refs.form.setState({'error': ABCError(1, strings.incorrect_password_text).message})
        return
      }

      if (!this.account.checkPassword(password)) {
        this.refs.form.setState({'error': ABCError(1, strings.incorrect_password_text).message})
        return
      }
      console.log('Yay. good password')
    }

    window.that = this
    this.account.setupRecovery2Questions(questions, answers, function (error, recoveryToken) {
      if (error) {
        this.refs.form.setState({'error': ABCError(error, 'Error setting up recovery questions').message})
      } else {
        var that = window.that
        // that.recoveryToken = recoveryToken
        that.setState({recoveryToken: recoveryToken})
        // Open another modal
        that.showQA(true)
        that.showEmail(true)
      }
    })
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
      window.open(urlFinal, '_blank')
    } else {
      this.refs.emailform.setState({'error': ABCError(1, strings.invalid_email_address).message})
    }
  },
  callBackEmailDone () {
    'use strict'
    if (window.parent.exitCallback) {
      window.parent.exitCallback()
    }
  }
})

String.format = function (format) {
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined'
      ? args[number]
      : match
  })
}

var RecoveryQAView = React.createClass({
  render () {
    'use strict'

    return (
      <div className="row">
        <QuestionAnswerView
          ref="qa1"
          question={this.props.questions[0]}
          answer={this.props.answers[0]}
          setup="1"
          questionChoices={this.props.questionChoices} />
        <QuestionAnswerView
          ref="qa2"
          question={this.props.questions[1]}
          answer={this.props.answers[1]}
          setup="1"
          questionChoices={this.props.questionChoices} />
        {this.props.requirePassword ? (
          <div className="col-sm-12">
            <div className="form-group">
              <label>Current password</label>
              <input type="password" ref="currentPassword" placeholder={strings.current_password_text} className="form-control" />
            </div>
          </div>
        ) : null}
        <div className="col-sm-12">
          <div className="form-group">
            <span className="input-group-btn">
              <BootstrapButton ref="register" onClick={this.handleSubmit}>{strings.save_button_text}</BootstrapButton>
            </span>
          </div>
        </div>
      </div>
    )
  },
  handleSubmit () {
    let questions = []
    let answers = []
    questions[0] = this.refs.qa1.getValue().question
    questions[1] = this.refs.qa2.getValue().question
    answers[0] = this.refs.qa1.getValue().answer
    answers[1] = this.refs.qa2.getValue().answer
    if (this.props.requirePassword) {
      this.props.callback(questions, answers, this.refs.currentPassword.value)
    } else {
      this.props.callback(questions, answers)
    }
  }
})

module.exports.RecoveryView = RecoveryView
module.exports.SetupRecoveryView = SetupRecoveryView
