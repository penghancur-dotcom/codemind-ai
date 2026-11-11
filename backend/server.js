'use strict';
const app = require('./app');
const express = require('express');
const path = require('path');
const PORT = Number(process.env.PORT || 3000);

// Local Node.js mode serves the existing frontend beside the API.
app.use((req, res, next) => {
  if (/^\/(backend|scripts|node_modules|public)(\/|$)/.test(req.path) ||
      /^\/(server\.js|package\.json|README\.md)$/.test(req.path)) {
    return res.sendStatus(404);
  }
  next();
});
app.use(express.static(path.resolve(__dirname, '..'), {
  dotfiles: 'deny',
  index: 'index.html'
}));
app.listen(PORT, () => console.log(`CodeMind AI backend ready on port ${PORT}`));
