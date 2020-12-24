const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, IsAuthed, Login } from "../Services/AuthServices";
import { AddGate, GetUserGates } from "../Services/GateService";



router.post("/getUserTrackings", async (req, res) => {
  var response = await AddGate(req)
  res.json(response);
});

router.post("/getGates", async (req, res) => {
    var response = await GetUserGates(req)
    res.json(response);
  });


module.exports = router;
