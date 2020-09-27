const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
const { dbConnect } = require("./dbfuncs");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";

router.post("/login", async (req, res) => {
  
  
  // await fetch(
  //   "https://newsapi.org/v2/everything?q=bitcoin&apiKey=becb43d6fecd4eea8fb10da9c2049f7b",
  //   {
  //     method: "get",
  //     headers: {
  //       Authorization: bearer,
  //       // 'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
  //       "Content-Type": "application/json",
  //     },
  //   }
  // )
  //   .then((res) => res.json())
  console.log(req);
  MongoClient.connect(process.env.DB_CONNECTION, function (err, db) {
    if (err) throw err;
    var dbo = db.db("gateslayer");

    dbo.collection("users").findOne({username: req.body.username} ,(err, result) => {
      if (err) throw err;
      console.log(result);
      db.close();
    });

    
  });
  
  return res.send('success boi'); 

});

module.exports = router;
