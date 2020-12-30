const express = require("express");
const router = express.Router();
const sql = require('mssql')

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, GetUserFromToken, IsAuthed, Login } from "../Services/AuthServices";
import { GetTrackingInfo, GetUserTrackings, GetDevices, GetDeviceInfo } from "../Services/TrackingService";



// router.post("/getUserTrackings", async (req, res) => {
//   var response = await AddGate(req)
//   res.json(response);
// });

router.post("/getTrackings", async (req, res) => {
  req.user = await GetUserFromToken(req);
  var response = await GetUserTrackings(req)
  res.json(response);
});

router.post("/gettrackinginfo", async (req, res) => {
  req.user = await GetUserFromToken(req);
  var response = await GetTrackingInfo(req)
  res.json(response);
});
router.post("/getdevices", async (req, res) => {
  req.user = await GetUserFromToken(req);
  var response = await GetDevices(req)
  res.json(response);
});
router.post("/getdeviceinfo", async (req, res) => {
  req.user = await GetUserFromToken(req);
  var response = await GetDeviceInfo(req)
  res.json(response);
});




module.exports = router;
