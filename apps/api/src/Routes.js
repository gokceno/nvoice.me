const dotenv =  require('dotenv');
const YAML = require('yaml');
const pdfMake = require('pdfmake');
const { Document: DefaultDocument } = require('./Documents/Default.js');

dotenv.config();

const generatePdf = async (req, res, next) => {
  // Fetch document metadata
  try {
    const metadata = YAML.parse(req.body);
    if(!metadata.errors) {
      // Define PDF document
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
      dd.setItems(metadata.items.map(item => {
        return {
          itemName: item.item, 
          unitPrice: item.unit_price
        }
      }));
      dd.setNotes(metadata.notes);

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
      const pdfDoc = printer.createPdfKitDocument(dd.get());

      let chunks = [];
      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });
      pdfDoc.on('end', () => {
        res.contentType('application/pdf');
        res.send(
          'data:application/pdf;base64,' + Buffer.concat(chunks).toString('base64')
        );
      });
      pdfDoc.end();
    }
    else {
      res.status(500).json({ok: false, errors: metadata.errors});
    }
  }
  catch(error) {
    res.status(500).json({ok: false, error});
  }
}

module.exports = { generatePdf }