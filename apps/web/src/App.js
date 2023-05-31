import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Routes, Route, Outlet, Link } from "react-router-dom";
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
    logo: './public/logo.png'
    info:
      invoice_number: '0000'
      date_issued: 2023-12-12
      currency: USD
      is_paid: true
    sender:
      company_name: Brew Interactive
      company_legal_name: Brev Bilişim A.Ş.
      address: Süleyman Seba Cad.
      city: Beşiktaş
      state: Istanbul
      zip: 34000
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
      <header className="bg-gray-800 text-white py-4 pl-4">
        nvoice.me invoice generator
      </header>
      <div className="flex flex-grow">
        <div className="flex-1">
        <CodeEditor
          value={code}
          language="yaml"
          placeholder="Please enter JS code."
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

