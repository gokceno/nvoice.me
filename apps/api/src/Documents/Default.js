const fs = require('fs');

const Document = () => {
  let _logoFile;
  let _isPaid;
  let _currency = 'USD';
  let _invoiceNumber = {};
  let _dateIssued = {};
  let _sender = {};
  let _recipient = {};
  let _notes = [];
  let _items = [];
  const _getSectionTitle = (text) => {
    return {
      text,
      color: '#aaaaab',
      bold: true,
      fontSize: 10,
      alignment: 'left',
      margin: [0, 20, 0, 5],
    }
  }
  const _getTotalLine = (title, price) => {
    return [
      {
        text: title,
        border: [false, false, false, true],
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
      {
        border: [false, false, false, true],
        text: price,
        alignment: 'right',
        fillColor: '#f5f5f5',
        margin: [0, 5, 0, 5],
      },
    ];
  }
  const _getItemsBody = () => {
    const header = [
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
      ]
    ];
    const body = _items.map(item => {
      return [
        {
          text: item.itemName,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
        },
        {
          border: [false, false, false, true],
          text: `${_currency} ${item.unitPrice.toFixed(2)}`,
          fillColor: '#f5f5f5',
          alignment: 'right',
          margin: [0, 5, 0, 5],
        }
      ];
    });
    return [...header, ...body];
  }
  const _getTitle = (text) => {
   return {
      text,
      color: '#333333',
      width: '*',
      fontSize: 20,
      bold: true,
      alignment: 'right',
      margin: [0, 0, 0, 15],
    }
  }
  const _getLogo = () => {
    return {
      image: 'data:image/png;base64,' + _logoFile,
      width: 75,
    }
  }
  const get = () => {
    const DocumentDefinition = {
      content: [
      {
        columns: [
          _getLogo(),
          [
            _getTitle('Invoice'),
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
        _getSectionTitle('INVOICE FROM'),
        _getSectionTitle('INVOICE FOR'),
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
          _getSectionTitle('ADDRESS'),
          _getSectionTitle('ADDRESS')
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
            _getTotalLine('Subtotal', _currency + ' ' + _items.reduce((total, item) => +total + (+item.unitPrice), 0).toFixed(2)),
            _getTotalLine('Discount', 'n/a'),
            _getTotalLine('Amount Due', _currency + ' ' + _items.reduce((total, item) => +total + (+item.unitPrice), 0).toFixed(2)),
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
  const setLogo = async (params) => {
    const { logoFilePath } = params;
    if(logoFilePath !== undefined) {
      if(logoFilePath.indexOf('http://') == 0 || logoFilePath.indexOf('https://') == 0) {
        await fetch(logoFilePath)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error ${response.status}`);
            }
            return response.arrayBuffer();
          })
          .then((arrayBuffer) => {
            const byteArray = new Uint8Array(arrayBuffer);
            let binaryString = '';
            for (let i = 0; i < byteArray.byteLength; i++) {
              binaryString += String.fromCharCode(byteArray[i]);
            }
            _logoFile = btoa(binaryString);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      else {
        _logoFile = fs.readFileSync(logoFilePath, 'base64'); 
      }
    }
    else {
      throw new Error('Required params missing.');
    }
  }
  const setInvoiceInfo = (params) => {
    const { invoiceNumber, dateIssued, isPaid, currency } = params;
    _currency = (currency != undefined || currency != null) ? currency : 'USD'
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
            text: isPaid == true ? 'Paid' : 'Not Paid',
            bold: true,
            fontSize: 12,
            alignment: 'right',
            color: isPaid == true ? 'green' : 'red',
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
        text: [companyName, companyLegalName].filter(item => item != undefined || item != null).join('\n'),
        color: '#333333',
        alignment: 'left',
      }
    }
    if(address != undefined && country !== undefined) {
      _sender.senderAddress = {
        text: `${address} \n ${ [city, state, zip].filter(item => item != undefined || item != null).join(' ') } \n ${country}`,
        style: 'invoiceBillingAddress',
      };
    }
  }
  const setRecipient = (params) => {
    const { companyName, companyLegalName, address, city, state, zip, country } = params;
    if(companyName !== undefined || companyLegalName !== undefined) {
      _recipient.recipientName = {
        text: [companyName, companyLegalName].filter(item => item != undefined || item != null).join('\n'),
        color: '#333333',
        alignment: 'left',
      }
    }
    if(address != undefined && country !== undefined) {
      _recipient.recipientAddress = {
        text: `${address} \n ${ [city, state, zip].filter(item => item != undefined || item != null).join(' ') } \n ${country}`,
        style: 'invoiceBillingAddress',
      };
    }
  }
  const setItems = (items) => {
    if(items !== undefined && typeof items == 'object') {
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
    setItems
  };
}

module.exports = { Document } 