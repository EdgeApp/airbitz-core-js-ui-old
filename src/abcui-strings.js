import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en:{
    ok_button_text: 'OK',
    later_button_text: 'Later',
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
    scan_barcode_to_signin: 'Scan barcode to sign in with Airbitz',
    scan_barcode_to_register: 'Scan barcode to register with Airbitz',
    done_text: 'Done',
    invalid_email_address: 'Invalid email address',
    recovery_email_subject: '{0} Recovery Token',
    recovery_token_email_body: 'To recover your account, install the {0} Mobile App on iOS or Android from https://airbitz.co/app\n\n' +
    'Please click one of the links below from a device with {0} installed to initiate account recovery for username [{1}]\n\n{2}',
    setup_recovery_text: 'Setup Recovery',
    if_recovery_setup: 'If recovery was setup, you should have emailed yourself a recovery token with a link. To recover your account, install the Airbitz Mobile App on iOS or Android',
    if_recovery_setup2: 'Then click one of the links in the recovery email from a device with Airbitz installed',
    account_created_text: 'Account Created',
    account_created_message: 'Your {0} account has been created.',
    account_created_zero_knowledge: 'Your username and password are known only to you and cannot be reset by {0}.',
    account_created_write_it_down: 'Would you like to setup password recovery questions to reset your account in case of a forgotten password?',

    dummy_entry_to_keep_json_happy: ''

  }
});

module.exports = strings
