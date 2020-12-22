import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import moment from "moment";



export const AddGate = async (req) => {
    let returnVal = null;
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            var gateExsisting = await dbo.collection('gates').findOne({
                gateName: req.body.gateName,
                gateCellNumber: req.body.gateCellNumber
            })

            if (gateExsisting) {
                returnVal = {
                    Status: 'Error',
                    Data: 'Gate Name or Cell is already registered'
                }
            }
            else {
                dbo.collection("gates").insertOne({
                    gateName: req.body.gateName,
                    gateCellNumber: req.body.gateCellNumber,
                    departmentId: req.body.departmentId,
                    createdDate: moment.utc().format('MM/DD/YYYY HH:mm:ss')
                }, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                });
                returnVal = {
                    Status: 'Success',
                    Data: 'New User ${req.body.username} Created'
                }

            }
            db.close();
            return returnVal;
        });
}


export const GetUserGates = async (req) => {
    let returnVal = null;
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            var dbo = db.db("gateslayer");
            let result = await dbo.collection("gates").find({ departmentId: 0 }).toArray()
            returnVal = {
                Status: 'Success',
                Data: result
            }

            console.log(result);
            db.close();
            return returnVal;
        }, (err, result) => {
            if (err) throw err;
            console.log(result);
            returnVal = {
                Status: 'Error',
                Data: result
            }
            db.close();
            return returnVal
        });
}


