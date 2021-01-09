const express = require("express");
const router = express.Router();
const sql = require('mssql')

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import {GetUserFromToken } from "../Services/AuthServices";
import { GetCustomerResources } from "../Services/ResourceService";



// router.post("/getUserTrackings", async (req, res) => {
//   var response = await AddGate(req)
//   res.json(response);
// });

router.post("/findResources", async (req, res) => {
  req.user = await GetUserFromToken(req);
  var response = await GetCustomerResources(req)
  res.json(response);
});




module.exports = router;
