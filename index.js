var fs = require('fs');
var path = require('path');
var readLine = require('readline');

var htmlFilePath = path.join(__dirname, 'grab-receipt.html');
var lineReader = readLine.createInterface({
  input: fs.createReadStream('source.csv', {start: 102})
});

lineReader.on('line', function (orderData) {
  fs.readFile(htmlFilePath, { encoding: 'utf-8' } , function(htmlErr, htmlData) {
    if (!htmlErr) {
      var splittedData = orderData.split(';');
      var emailDate = splittedData[0],
        amount = splittedData[1],
        orderDate = splittedData[2],
        type = splittedData[3],
        driversName = splittedData[4],
        bookingCode = splittedData[5],
        pickupLocation = splittedData[6],
        dropOffLocation = splittedData[7],
        paymentMethod = splittedData[8];

      htmlData = htmlData.toString();
      // replace amount
      htmlData = htmlData.replace(/RM 15/g, amount);
      // replace payment method
      htmlData = htmlData.replace('Cash', paymentMethod);
      // replace email date
      htmlData = htmlData.replace('emailDate', emailDate);
      // replace orderDate
      htmlData = htmlData.replace('orderDate', orderDate);
      // replace type
      htmlData = htmlData.replace('GrabCar', type);
      // replace driver's name
      htmlData = htmlData.replace('ABCName', driversName);
      // replace booking code
      htmlData = htmlData.replace('BookingCodeNumber', bookingCode);
      // replace pickupLocation
      htmlData = htmlData.replace('PickupLocation', pickupLocation);
      // replace dropOffLocation
      htmlData = htmlData.replace('dropOffLocation', dropOffLocation);

      fs.writeFile("dir/" + emailDate + ".html", htmlData, function(err) {
        if (err)
          return console.log(err);

        console.log("The file was saved!");
      });
    }
  });
});