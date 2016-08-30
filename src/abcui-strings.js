import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en:{
    current_password_text: 'Current Password',
    please_select_a_question: 'Please select a question',
    answers_are_case_sensitive: 'Answers are case sensitive',
    password_recovery_text: 'Password Recovery',
    save_button_text: 'Save',
    please_choose_two_recovery: 'Please choose two recovery questions',
    please_choose_answers_with_4_char: 'Please choose answers with at least 4 characters',
    must_have_one_upper: 'Must have at least one upper case letter',
    must_have_one_lower: 'Must have at least one lower case letter',
    must_have_one_number: 'Must have at least one number',
    must_have_10_char: 'Must have at least 10 characters',
    invalid_password_text: 'Invalid Password',
    password_text: 'Password',
    pin_text: 'PIN',
    sign_in_text: 'Sign In',
    exit_pin_login_text: 'Exit PIN Login',
    incorrect_password_text: 'Incorrect Password',
    save_recovery_token_popup:  "Save Recovery Token",
    save_recovery_token_popup_message: "To complete account recovery setup you MUST save an account recovery token. This will be required to recover your account in addition to your username and recovery answers. Please enter your email below to send yourself the recovery token.",
    email_address_text: 'Email address',
    email_text: 'Email',
    send_using_xx: 'Send using {0}',
    done_text: 'Done',
    invalid_email_address: 'Invalid email address',
    recovery_email_subject: '{0} Recovery Token',
    recovery_token_email_body: 'Please click the link below from a device with {0} installed to initiate account recovery for username [{1}]\n\n{2}',

    dummy_entry_to_keep_json_happy: ''

  }
});

exports.strings = strings
