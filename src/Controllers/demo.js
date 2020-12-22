const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
const { dbConnect } = require("./dbfuncs");

router.get("/demo", async (req, res) => {
      return res.send("Success");
});

module.exports = router;
