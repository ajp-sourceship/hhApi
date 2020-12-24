const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");

router.get("/demo", async (req, res) => {
      return res.send("Success");
});

module.exports = router;
