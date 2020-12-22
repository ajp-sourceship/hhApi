const express = require("express");
const router = express.Router();

import { AddCustomer, GetCustomers } from "../Services/CustomerService";
import { AddProject, GetProjects } from "../Services/ProjectService";



router.post("/addProject", async (req, res) => {
  var response = await AddProject(req)
  res.json(response);
});

router.post("/getProjects", async (req, res) => {
    var response = await GetProjects(req)
    res.json(response);
  });


module.exports = router;
