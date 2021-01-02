const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, GetUserFromToken, GetUsers, IsAuthed, Login } from "../Services/AuthServices";
import { GetAccountDetails, GetAccounts } from "../Services/AccountService";


router.post("/getAccounts", async (req, res) => {
  req.user = await GetUserFromToken(req)
  var response = await GetAccounts(req)
  res.json(response);
});
router.post("/getAccountDetails", async (req, res) => {
  req.user = await GetUserFromToken(req)
  var response = await GetAccountDetails(req)
  res.json(response);
});


module.exports = router;
