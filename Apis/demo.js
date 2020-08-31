const express = require('express');

const router = express.Router();

router.get('/demo', (req, res) => {
  return res.send("Yeet taht ");
});

module.exports = router;