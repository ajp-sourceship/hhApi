const express = require("express");
const router = express.Router();


import { GetColors, InsertColor } from "../Services/ColorService";


router.post("/getColors", async (req, res) => {
  var response = await GetColors(req)
  res.json(response);
});
router.post("/insertColor", async (req, res) => {
  var response = await InsertColor(req)
  res.json(response);
});


module.exports = router;
