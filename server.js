'use strict';
// Vercel detects this root Express entrypoint and deploys it as a Function.
// Local development uses `npm start`, which runs backend/server.js.
require('express');
const app = require('./backend/app');
module.exports = app;
