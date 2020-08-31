const express = require('express');
const router = express.Router();

const fetch = require('node-fetch');


router.get('/demo', async (req, res) => {

  const params = new URLSearchParams();
  var bearer = 'Bearer ' + 'becb43d6fecd4eea8fb10da9c2049f7b';

  await fetch('https://newsapi.org/v2/everything?q=bitcoin&apiKey=becb43d6fecd4eea8fb10da9c2049f7b', {
		method: 'get',
		headers: {
      'Authorization': bearer,
      // 'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
  }
  }).then(res => res.json())
  .then(resp => {
    return res.send(resp)
  });
  
  
});

module.exports = router;