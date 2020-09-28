const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, IsAuthed, Login } from "../Services/AuthServices";



router.post("/createUser", async (req, res) => {
  var response = await CreateUser(req)
  res.json(response);
});


router.post("/login", async (req, res) => {
  var loginResponse = await Login(req)
  res.set('Token', loginResponse.Token)
  res.json(loginResponse);
});


router.post("/isAuthed", async (req, res) => {
  var response = await IsAuthed(req)
  res.json(response);
});



module.exports = router;
