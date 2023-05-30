const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { generatePdf } = require('./src/Routes.js');

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
app.use(bodyParser.text({type: 'text/plain'}));
app.use(express.json());
app.options('*', cors());

app.post('/generate-pdf', cors(), generatePdf);

(async () => {
  app.listen(process.env.PORT || 4000);
  logger.info('nvoice.me APIs are running 👊');
})();
