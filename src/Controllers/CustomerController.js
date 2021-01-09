const express = require("express");
const router = express.Router();

import {GetUserFromToken } from "../Services/AuthServices";
import { AddCustomer, GetCustomerLocations, GetCustomers } from "../Services/CustomerService";

  router.post("/getCustomerLocations", async (req, res) => {
    req.user = await GetUserFromToken(req)
    var response = await GetCustomerLocations(req)
    res.json(response);
  });


module.exports = router;
