# nvoice.me Invoice Generator 

nvoice.me converts a predefined YAML schema into a PDF invoice that you can share with your clients. 

Initially, it was created at BREW for internal needs and was open-sourced.

> Feel free to visit the working version at https://nvoice.me 

## Using

### YAML Schema

The YAML schema is as follows:

```YAML
    logo: 'https://brew-assets.fra1.digitaloceanspaces.com/invoice-logo.png'
    info:
      invoice_number: '0000'
      date_issued: 2023-09-16
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
```

Copy this to the web editor, and a PDF invoice should appear. Customize it based on your needs; you can then download it and send it to your clients.
### Programmatic Access

Post the above content in the body section as raw text data to https://api.nvoice.me/generate-pdf; the PDF should return to you. You can save it or use it per your needs.

Currently, no limitations exist; use it as much as you want.
## Running Locally

### Running with Docker
The easiest way to run is with docker-compose; follow the steps below:
1. Create the .env files from sample env's, located under `apps/web` and `apps/api`. Feel free to configure it based on your needs.
3. Configure the ports (optional). If you change the API port number, make sure you edit `REACT_APP_API_BASEURL` in web container as well.
4. Run `docker-compose up -d` to run it in detached mode. Run `docker-compose logs -f` if you want to observe the logs.
5. Fire up your browser and visit `http://localhost:3000`
### Running with Node
1. Install Turbo Repo per its documentation at https://turbo.build/repo/docs/installing
2. Install app dependencies with `yarn install` by entering into `apps/api` and `apps/web` directories.
3. Create the .env files from sample env's, located under `apps/web` and `apps/api`. Feel free to configure it based on your needs.
4. Go back to project root and run `turbo start` 
5. Fire up your browser and visit `http://localhost:3000`
