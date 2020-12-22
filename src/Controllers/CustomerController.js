const express = require("express");
const router = express.Router();

import { AddCustomer, GetCustomers } from "../Services/CustomerService";



router.post("/addCustomer", async (req, res) => {
  var response = await AddCustomer(req)
  res.json(response);
});

router.post("/getCustomers", async (req, res) => {
    var response = await GetCustomers(req)
    res.json(response);
  });


module.exports = router;
