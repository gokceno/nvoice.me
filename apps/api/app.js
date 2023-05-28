const express = require('express');
const bodyParser = require('body-parser');
const pdfMake = require('pdfmake');
const fs = require('fs');
const dotenv = require('dotenv');
const YAML = require('yaml');
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
  const metadata = YAML.parse(
    fs.readFileSync('./doc.yaml', 'utf8')
  );
  const printer = new pdfMake(fonts);
  
  const dd = DefaultDocument();

  const { invoice_number: invoiceNumber, date_issued: dateIssued, is_paid: isPaid, currency } = metadata.info;
  const { company_name: senderCompanyName, company_legal_name: senderCompanyLegalName, address: senderAddress, city: senderCity, state: senderState, zip: senderZip, country: senderCountry } = metadata.sender;
  const { company_name: recipientCompanyName, company_legal_name: recipientCompanyLegalName, address: recipientAddress, city: recipientCity, state: recipientState, zip: recipientZip, country: recipientCountry } = metadata.recipient;

  dd.setLogo({ logoFilePath: metadata.logo });
  dd.setInvoiceInfo({ invoiceNumber, dateIssued, isPaid, currency });
  dd.setSender({ 
    companyName: senderCompanyName, 
    companyLegalName: senderCompanyLegalName,
    address: senderAddress,
    city: senderCity,
    state: senderState,
    zip: senderZip,
    country: senderCountry
  });
  dd.setRecipient({ 
    companyName: recipientCompanyName, 
    companyLegalName: recipientCompanyLegalName,
    address: recipientAddress,
    city: recipientCity,
    state: recipientState,
    zip: recipientZip,
    country: recipientCountry
  });
  dd.setItems(metadata.items.map(item =>  {
    return {
      itemName: item.item, 
      unitPrice: item.unit_price
    }
  }));
  dd.setNotes(metadata.notes);

  const pdfDoc = printer.createPdfKitDocument(dd.get());
  pdfDoc.pipe(fs.createWriteStream('./doc.pdf'));
  pdfDoc.end();

})();
