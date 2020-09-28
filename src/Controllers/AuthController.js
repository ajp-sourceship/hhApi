const express = require("express");
const router = express.Router();

const fetch = require("node-fetch");
const { dbConnect } = require("./dbfuncs");
import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'


router.post("/createUser", async (req, res) => {
  console.log(req);
  MongoClient.connect(process.env.DB_CONNECTION, async (err, db) => {
    if (err) throw err;
    var dbo = db.db("gateslayer");
    var userExsisting = await dbo.collection('users').findOne({
      username: req.body.username,
      email: req.body.email
    })

    if (userExsisting) {
      return res.send('Error: Username or Email already registered');
    }
    else {
      let saltRounds = 10;
      bcrypt.hash(req.body.password, saltRounds)
        .then(hashed => {
          dbo.collection("users").insertOne({
            username: req.body.username,
            email: req.body.email,
            passwordSaltedHash: hashed,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
          }, (err, result) => {
            if (err) throw err;
            console.log(result);
            db.close();
          });
          return res.send('success boi');
        })
    }
  });
});


router.post("/login", async (req, res) => {
  MongoClient.connect(process.env.DB_CONNECTION, (err, db) => {
    if (err) throw err;
    var dbo = db.db("gateslayer");

    dbo.collection("users").findOne({ username: req.body.username }, (err, user) => {
      if (err) throw err;
        console.log(err);db.close();

      if (user)
        bcrypt.compare(req.body.password, user.passwordSaltedHash, (err, isAuthed) => {
          if (isAuthed)
            return res.send('success boi');
          else
            return res.send('Error: Crediental mismatch. User is not Authenticated.')
        })
      else
        return res.send('Error: User not found.')

    });
  });
});


router.post("/isAuthed", async (req, res) => {


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

    dbo.collection("users").findOne({ username: req.body.username }, (err, result) => {
      if (err) throw err;
      console.log(result);
      db.close();
    });


  });

  return res.send('success boi');

});



module.exports = router;
