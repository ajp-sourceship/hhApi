const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, GetUsers, IsAuthed, Login } from "../Services/AuthServices";
import { GetAccounts } from "../Services/AccountService";


router.post("/getAccounts", async (req, res) => {
  var response = await GetAccounts(req)
  res.json(response);
});


module.exports = router;
