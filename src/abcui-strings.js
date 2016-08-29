import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en:{
    current_password_text: 'Current Password',
    please_select_a_question: 'Please select a question',
    answers_are_case_sensitive: 'Answers are case sensitive',
    password_recovery_text: 'Password Recovery',
    save_button_text: 'Save',
    please_choose_two_recovery: 'Please choose two recovery questions',
    must_have_one_upper: 'Must have at least one upper case letter',
    must_have_one_lower: 'Must have at least one lower case letter',
    must_have_one_number: 'Must have at least one number',
    must_have_10_char: 'Must have at least 10 characters',
    invalid_password_text: 'Invalid Password',
    password_text: 'Password',
    pin_text: 'PIN',
    sign_in_text: 'Sign In',
    exit_pin_login_text: 'Exit Pin Login',

    dummy_entry_to_keep_json_happy: ''
  }
});

exports.strings = strings
