# Airbitz Javascript UI

This repo implements a UI layer on top of [airbitz-core-js](https://github.com/Airbitz/airbitz-core-js) to provide web applications the interface required to do all the accounts management in just a small handful of Javascript API calls. All UI operates in an overlay iframe on top of the current HTML view.

`npm install` to fetch the dependencies.  
`npm run build` to create the web bundle.

## Basic usage

If using NodeJS, add the following to your `Packages.json`

    "dependencies": {
        ...
        "airbitz-core-js-ui": "git://github.com/Airbitz/airbitz-core-js-ui.git"
        ...
    }

or just include this repo somewhere in your server's path.

Include the `abcui.js` file in your code

    <script src="/path-to-abcui/abcui.js"></script>

Now start diving in and make some calls

Initialize the library

    _abcUi = abcui.makeABCUIContext({'apiKey': 'api-key-here',
                                     'accountType': 'account:repo:com.mydomain.myapp',
                                     'bundlePath': '/path-to-abcui/'});

Launch the registration UI which let's the user create a new account.

    _abcUi.openRegisterWindow(function(error, account) {
      _account = account;
    });

![Register UI](https://airbitz.co/go/wp-content/uploads/2016/08/Screen-Shot-2016-08-26-at-12.49.27-PM.png)

Create an overlay popup where a user can login to a previously created account via password or PIN.

    _abcUi.openLoginWindow(function(error, account) {
      _account = account;
    });

![Login UI](https://airbitz.co/go/wp-content/uploads/2016/08/Screen-Shot-2016-08-26-at-12.50.04-PM.png)


Launch an account management window for changing password, PIN, and recovery questions

    _abcUi.openManageWindow(_account, function(error) {
    
    });

![Manage UI](https://airbitz.co/go/wp-content/uploads/2016/08/Screen-Shot-2016-08-26-at-12.50.26-PM.png)

Get a rootkey that can be used as raw entropy for a cryptocurrency master key

    _account.rootKey.toString('base64')

Logoff a user

    _account.logout();

## Sample website repo

See a sample implementation at [airbitz-core-js-sample](https://github.com/Airbitz/airbitz-core-js-sample)

# Detailed Docs

https://developer.airbitz.co/javascript
