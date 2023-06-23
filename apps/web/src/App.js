import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { DateTime } from 'luxon';
import { SignUp } from './Routes/SignUp.js'

function Layout() {
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(timeoutId);
      };
    }, [value, delay]);
    return debouncedValue;
  }
  const [code, setCode] = React.useState(
    `
    logo: 'https://brew-assets.fra1.digitaloceanspaces.com/invoice-logo.png'
    info:
      invoice_number: '0000'
      date_issued: ${DateTime.now().toFormat("yyyy-MM-dd")}
      currency: USD
      is_paid: false
    sender:
      company_name: Brew Interactive
      company_legal_name: Brev Bilişim A.Ş.
      address: Süleyman Seba Cad.
      city: Beşiktaş
      state: Istanbul
      zip: 34357
      country: Turkey
    recipient:
      company_name: Brew Interactive
      company_legal_name: Brev Bilişim A.Ş.
      address: Süleyman Seba Cad.
      city: Beşiktaş
      state: Istanbul
      zip: 34000
      country: Turkey
    items:
      - item: Product 4
        unit_price: 10
      - item: Product 3
        unit_price: 20
    notes: |
      Tax Number: 1871415891
      Bank Name: T.C. Ziraat Bankasi A.S. (swift code: “TCZBTR2A”)
      Beneficiary Account: Brev Bilisim A.S.
      IBAN: TR7000 0100 0950 6275 2237 5007
    `
  );
  const debouncedCode = useDebounce(code, 800);
  const [pdfInvoiceData, setPdfInvoiceData] = React.useState('');
  useEffect(() => {
    fetch(process.env.REACT_APP_API_BASEURL + '/generate-pdf', {
      method: 'POST',
      body: code
    })
    .then(response => response.text()).then(text => {
      setPdfInvoiceData(text);
    })
  }, [debouncedCode]);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white py-4 flex justify-between px-4">
        <div><h1>nvoice.me YAML-to-PDF invoice generator</h1></div>
        <div>
          <a href="https://github.com/gokceno/nvoice.me" className="text-white hover:text-gray-400 mx-2">
            View on GitHub
          </a>
        </div>
      </header>
      <div className="flex flex-grow">
        <div className="flex-1">
        <CodeEditor
          value={code}
          language="yaml"
          data-color-mode="dark"
          placeholder="Please enter YAML code."
          onChange={(e) => setCode(e.target.value)}
          padding={15}
          style={{
            fontSize: 12,
            backgroundColor: "#303841",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            height: '100%'
          }}
        />
        </div>
        <div className="flex-1">
          <iframe src={pdfInvoiceData} height="100%" width="100%" className="w-full h-full"></iframe>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SignUp />} />
        </Route>
      </Routes>
    </div>
  );
}


