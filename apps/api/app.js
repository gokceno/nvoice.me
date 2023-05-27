const express = require('express');
const bodyParser = require('body-parser');
const pdfMake = require('pdfmake');
const fs = require('fs');
const dotenv = require('dotenv');
const { DocumentDefinition: DefaultDocumentDefinition, Document: DefaultDocument } = require('./src/Documents/Default.js');

dotenv.config();

// Init Express
const app = express();

// Set up logging
const loggerOptions = {
  level: process.env.LOGLEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
};
const pinoHttp = require('pino-http')(loggerOptions);
const logger = require('pino')(loggerOptions);

app.use(pinoHttp);
app.use(bodyParser.json());
app.use(express.json());

// app.post('/timers/update/total-duration', calculateTotalDuration);

(async () => {
  /*
  app.listen(process.env.PORT || 4000);
  logger.info('Happy Path hooks are running 👊');
  */


  // Define font files
  const fonts = {
    Roboto: {
      normal: './fonts/Roboto/Roboto-Regular.ttf',
      italics: './fonts/Roboto/Roboto-Italic.ttf',
      bold: './fonts/Roboto/Roboto-Medium.ttf',
      bolditalics: './fonts/Roboto/Roboto-MediumItalic.ttf'
    }
  };

  
  const printer = new pdfMake(fonts);

  const dd = DefaultDocument();

  dd.setLogo({ logoFilePath: './public/logo.png' });
  dd.setCurrency('TRL');
  dd.setInvoiceInfo({ invoiceNumber: '12345', dateIssued: '01/01/2023', isPaid: false });
  dd.setSender({ 
    companyName: 'Brew Interactive', 
    companyLegalName: 'Brev Bilişim A.Ş.',
    address: 'Süleyman Seba Cad. No: 79/1',
    city: 'Beşiktaş',
    state: 'İstanbul',
    zip: '34000',
    country: 'Turkey'
  });
  dd.setRecipient({ 
    companyName: 'Brew Interactive', 
    companyLegalName: 'Brev Bilişim A.Ş.',
    address: 'Süleyman Seba Cad. No: 79/1',
    city: 'Beşiktaş',
    state: 'İstanbul',
    zip: '34000',
    country: 'Turkey'
  });
  dd.setItems([
    { itemName: 'Product 1', unitPrice: 10 },
    { itemName: 'Product 2', unitPrice: 20 },
  ]);
  dd.setItems([
    { itemName: 'Product 3', unitPrice: 30 },
  ]);
  dd.setNotes('Deneme 123');

  var pdfDoc = printer.createPdfKitDocument(dd.get());
  pdfDoc.pipe(fs.createWriteStream('./doc.pdf'));
  pdfDoc.end();



})();
