const fs = require('fs');

const Document = () => {
  let _logoFile;
  let _currency = 'USD';
  let _invoiceNumber = {};
  let _dateIssued = {};
  let _sender = {};
  let _recipient = {};
  let _notes = [];
  let _items = [];
  let _isPaid;
  const _setSectionTitle = (text) => {
    return {
      text,
      color: '#aaaaab',
      bold: true,
      fontSize: 10,
      alignment: 'left',
      margin: [0, 20, 0, 5],
    }
  }
  const _getItemsBody = () => {
    let _body = [
      [
        {
          text: 'Item Description',
          fillColor: '#eaf2f5',
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
        },
        {
          text: 'Amount',
          border: [false, false, false, true],
          alignment: 'right',
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          textTransform: 'uppercase',
        },
      ],
      [
        {
          text: 'Item 1',
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
        },
        {
          border: [false, false, false, true],
          text: '$999.99',
          fillColor: '#f5f5f5',
          alignment: 'right',
          margin: [0, 5, 0, 5],
        },
      ],
    ];
    return _body;
  }
  const get = () => {
    const DocumentDefinition = {
      content: [
      {
        columns: [
        {
          image: 'data:image/png;base64,' + _logoFile,
          width: 75,
        },
        [
        {
          text: 'Invoice',
          color: '#333333',
          width: '*',
          fontSize: 20,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 15],
        },
        {
          stack: [
            _invoiceNumber,
            _dateIssued,
            _isPaid
          ],
        },
        ],
        ],
      },
      {
        columns: [
        _setSectionTitle('INVOICE FROM'),
        _setSectionTitle('INVOICE FOR'),
        ],
      },
      {
        columns: [
          _sender.senderName,
          _recipient.recipientName,
        ],
      },
      {
        columns: [
          _setSectionTitle('ADDRESS'),
          _setSectionTitle('ADDRESS')
        ],
      },
      {
        columns: [
          _sender.senderAddress,
          _recipient.recipientAddress
        ],
      },
      '\n\n',
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function(i, node) {
            return 1;
          },
          vLineWidth: function(i, node) {
            return 1;
          },
          hLineColor: function(i, node) {
            if (i === 1 || i === 0) {
              return '#bfdde8';
            }
            return '#eaeaea';
          },
          vLineColor: function(i, node) {
            return '#eaeaea';
          },
          hLineStyle: function(i, node) {
            return null;
          },
          paddingLeft: function(i, node) {
            return 10;
          },
          paddingRight: function(i, node) {
            return 10;
          },
          paddingTop: function(i, node) {
            return 2;
          },
          paddingBottom: function(i, node) {
            return 2;
          },
          fillColor: function(rowIndex, node, columnIndex) {
            return '#fff';
          },
        },
        table: {
          headerRows: 1,
          widths: ['*', 80],
          body: _getItemsBody()
        },
      },
      '\n',
      '\n\n',
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function(i, node) {
            return 1;
          },
          vLineWidth: function(i, node) {
            return 1;
          },
          hLineColor: function(i, node) {
            return '#eaeaea';
          },
          vLineColor: function(i, node) {
            return '#eaeaea';
          },
          hLineStyle: function(i, node) {
            return null;
          },
          paddingLeft: function(i, node) {
            return 10;
          },
          paddingRight: function(i, node) {
            return 10;
          },
          paddingTop: function(i, node) {
            return 3;
          },
          paddingBottom: function(i, node) {
            return 3;
          },
          fillColor: function(rowIndex, node, columnIndex) {
            return '#fff';
          },
        },
        table: {
          headerRows: 1,
          widths: ['*', 'auto'],
          body: [
            [
            {
              text: 'Subtotal',
              border: [false, false, false, true],
              alignment: 'right',
              margin: [0, 5, 0, 5],
            },
            {
              border: [false, false, false, true],
              text: '$999.99',
              alignment: 'right',
              fillColor: '#f5f5f5',
              margin: [0, 5, 0, 5],
            },
            ],
            [
            {
              text: 'Discount',
              border: [false, false, false, true],
              alignment: 'right',
              margin: [0, 5, 0, 5],
            },
            {
              text: 'n/a',
              border: [false, false, false, true],
              fillColor: '#f5f5f5',
              alignment: 'right',
              margin: [0, 5, 0, 5],
            },
            ],
            [
            {
              text: 'Amount Due',
              bold: true,

              alignment: 'right',
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            },
            {
              text: 'USD 999.99',
              bold: true,

              alignment: 'right',
              border: [false, false, false, true],
              fillColor: '#f5f5f5',
              margin: [0, 5, 0, 5],
            },
            ],
            ],
        },
      },
      ..._notes
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      }
    }; 
    return DocumentDefinition;
  }
  const setLogo = (params) => {
    const { logoFilePath } = params;
    if(logoFilePath !== undefined) {
      _logoFile = fs.readFileSync(logoFilePath, 'base64');
    }
    else {
      throw new Error('Required params missing.');
    }
  }
  const setCurrency = (currencyShortName) => {
    _currency = currencyShortName;
  }
  const setInvoiceInfo = (params) => {
    const { invoiceNumber, dateIssued, isPaid } = params;
    if(invoiceNumber !== undefined) {
      _invoiceNumber = {
        columns: [
          {
            text: 'INVOICE NO',
            color: '#aaaaab',
            bold: true,
            width: '*',
            fontSize: 10,
            alignment: 'right',
          },
          {
            text: invoiceNumber,
            bold: true,
            color: '#333333',
            fontSize: 12,
            alignment: 'right',
            width: 80,
          },
        ],
      };
    }
    if(dateIssued !== undefined) {
      _dateIssued = {
        columns: [
          {
            text: 'DATE ISSUED',
            color: '#aaaaab',
            bold: true,
            width: '*',
            fontSize: 10,
            alignment: 'right',
          },
          {
            text: dateIssued,
            bold: true,
            color: '#333333',
            fontSize: 12,
            alignment: 'right',
            width: 80,
          },
        ],
      };
    }  
    if(isPaid !== undefined) {
      _isPaid =             {
        columns: [
          {
            text: 'STATUS',
            color: '#aaaaab',
            bold: true,
            fontSize: 10,
            alignment: 'right',
            width: '*',
          },
          {
            text: isPaid ? 'Paid' : 'Not Paid',
            bold: true,
            fontSize: 12,
            alignment: 'right',
            color: isPaid ? 'green' : 'red',
            width: 80,
          },
        ],
      };
    }
  }
  const setSender = (params) => {
    const { companyName, companyLegalName, address, city, state, zip, country } = params;
    if(companyName !== undefined || companyLegalName !== undefined) {
      _sender.senderName = {
        text: `${companyName} \n ${companyLegalName}`,
        color: '#333333',
        alignment: 'left',
      }
    }
    if(address != undefined && city !== undefined && country !== undefined) {
      _sender.senderAddress = {
        text: `${address} \n ${city} ${state} ${zip} \n ${country}`,
        style: 'invoiceBillingAddress',
      };
    }
  }
  const setRecipient = (params) => {
    const { companyName, companyLegalName, address, city, state, zip, country } = params;
    if(companyName !== undefined || companyLegalName !== undefined) {
      _recipient.recipientName = {
        text: `${companyName} \n ${companyLegalName}`,
        color: '#333333',
        alignment: 'left',
      }
    }
    if(address != undefined && city !== undefined && country !== undefined) {
      _recipient.recipientAddress = {
        text: `${address} \n ${city} ${state} ${zip} \n ${country}`,
        style: 'invoiceBillingAddress',
      };
    }
  }
  const setItems = (items) => {
    if(items !== undefined && typeof items == 'array') {
      _items = [..._items, ...items];
    }
  }
  const setNotes = (notes) => {
    if(notes !== undefined) {
      _notes = [
        '\n\n',
        {
          text: 'NOTES',
          style: 'notesTitle',
        },
        {
          text: notes,
          style: 'notesText',
        }
      ];
    }
  }
  return {
    get,
    setLogo,
    setInvoiceInfo,
    setSender,
    setRecipient,
    setItems,
    setNotes,
    setCurrency
  };
}

module.exports = { Document }