const express = require("express");
const router = express.Router();
const sql = require('mssql')

const fetch = require("node-fetch");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { CreateUser, GetUserFromToken, IsAuthed, Login } from "../Services/AuthServices";
import { GetTrackingInfo, GetUserTrackings } from "../Services/TrackingService";
import { GetAdminLanternManifests, GetAllManifests, GetManifest } from "../Services/LanternService";



// router.post("/getUserTrackings", async (req, res) => {
//   var response = await AddGate(req)
//   res.json(response);
// });

router.post("/getAllManifests", async (req, res) => {
    req.user = await GetUserFromToken(req);
    var response = await GetAllManifests(req)
    res.json(response);
});

router.post("/getAdminsManifests", async (req, res) => {
    req.user = await GetUserFromToken(req);
    var response = await GetAdminLanternManifests(req)
    res.json(response);
});
router.post("/getManifest", async (req, res) => {
    req.user = await GetUserFromToken(req);
    var response = await GetManifest(req)
    res.json(response);
});


module.exports = router;
