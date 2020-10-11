const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');

const htmlFilePath = path.join(__dirname, 'grab-receipt.html');

const lineReader = (sourceFileReader) => {
  console.log('Starting...');
  return new Promise((resolve, reject) => {
    sourceFileReader
      .pipe(csvParse({
        delimiter: [','],
        columns: true,
        skip_lines_with_error: true
      }))
      .on('data', (item) => {
        fs.readFile(htmlFilePath, { encoding: 'utf-8' } , (htmlErr, htmlData) => {
          if (!htmlErr) {
            const emailDate = item['email date'],
              amount = item['amount'],
              orderDate = item['order date'],
              type = item['type'],
              driversName = item['driver name'],
              bookingCode = item['booking code'],
              pickupLocation = item['pickup location'],
              dropOffLocation = item['drop off'],
              paymentMethod = item['payment method'],
              yourEmailAddress = item['your email address'],
              issuedTo = item['issued to'];
      
            htmlData = htmlData.toString();
            htmlData = htmlData.replace(/RM 15/g, amount);
            htmlData = htmlData.replace('Cash', paymentMethod);
            htmlData = htmlData.replace('emailDate', emailDate);
            htmlData = htmlData.replace('orderDate', orderDate);
            htmlData = htmlData.replace('GrabCar', type);
            htmlData = htmlData.replace('ABCName', driversName);
            htmlData = htmlData.replace('BookingCodeNumber', bookingCode);
            htmlData = htmlData.replace('PickupLocation', pickupLocation);
            htmlData = htmlData.replace('dropOffLocation', dropOffLocation);
            htmlData = htmlData.replace(/your_email_address/g, yourEmailAddress);
            htmlData = htmlData.replace(/issued_to/g, issuedTo);
      
            if (emailDate) {
              fs.writeFile("dir/" + emailDate + ".html", htmlData, (err) => {
                if (err) {
                  return console.log(err);
                }
      
                console.log("The file was saved!");
              });
            }
          }
        });
      })
      .on('error', err => {
        console.log(err);
        reject();
      })
      .on('end', () => {
        resolve();
      })
  });
}

const run = () => {
  const sourceFileReader = fs.createReadStream('./source.csv');
  return lineReader(sourceFileReader);
}

run();