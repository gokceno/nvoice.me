const Dotenv = require('dotenv-webpack')

module.exports = () => {
  return {
    plugins: [
      new Dotenv()
    ]
  };
};