/*eslint-disable no-console, no-var */
var express = require('express');

var app = express();
var fs = require('fs');
var path = require('path');

app.use(express.static(__dirname));
app.use('/static/abcui.js', express.static(__dirname + '/../abcui.js'));
app.use('/static/abcui-loader.js', express.static(__dirname + '/../abcuiloader.js'));
app.use('/ui', express.static(__dirname + '/../assets/'));
app.listen(3000, function () {
  console.log('Server listening on http://localhost:3000, Ctrl+C to stop')
});
