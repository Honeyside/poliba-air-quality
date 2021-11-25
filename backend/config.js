require('dotenv');

const config = {
  arduinoEnabled: process.env.ARDUINO_ENABLED === 'true',
};

module.exports = config;
