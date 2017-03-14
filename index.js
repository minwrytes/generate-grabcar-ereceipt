var fs = require('fs');
var path = require('path');

var htmlFilePath = path.join(__dirname, 'grab-receipt.html');
var sourceFilePath = path.join(__dirname, 'source.txt');

fs.readFile(sourceFilePath, { encoding: 'utf-8' } , function(sourceErr, source) {
  if (!sourceErr) {
    console.log(source);
    fs.readFile(htmlFilePath, { encoding: 'utf-8' } , function(htmlErr, htmlData) {
      if (!htmlErr) {
        htmlData = htmlData.toString();
        htmlData = htmlData.replace(/RM 15/g, 'RM 45');
      }
    });
  }
});