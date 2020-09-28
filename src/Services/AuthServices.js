import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import { response } from '';


export const CreateUser = async (req) => {
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            var userExsisting = await dbo.collection('users').findOne({
                username: req.body.username,
                email: req.body.email
            })

            if (userExsisting) {
                return {
                    Status: 'Error',
                    Data: 'Username or Email already registered'
                }
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
                        return {
                            Status: 'Success',
                            Data: 'New User ${req.body.username} Created'
                        }
                    })
            }
            db.close();
        });
}


export const Login = async (req) => {
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            var user = await dbo.collection("users").findOne({ username: req.body.username })
            if (user) {
                var result = await bcrypt.compare(req.body.password, user.passwordSaltedHash)
                if (result) {
                    let genToken = '12345fs'
                    await dbo.collection("users").updateOne({ _id: user._id },
                        { $set: { token: genToken } },
                        (err, result) => {
                            if (err) throw err;
                            console.log(result);
                            db.close();
                        });
                    return {
                        Status: 'Success',
                        Data: 'User Logged In.',
                        Token: genToken
                    }
                }
                else
                    return {
                        Status: 'Error',
                        Data: 'Invalid Password. User is not Authenticated.'
                    }
            }
            else
                return {
                    Status: 'Error',
                    Data: 'User not found.'
                }
        })

}

export const IsAuthed = async (req) => {
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");

            dbo.collection("users").findOne({ username: req.body.username }, (err, result) => {
                if (err) throw err;
                db.close();
            });
        }).then(isAuthed => {
            return {
                Status: 'Success',
                Data: 'User Authenticated Successfully.'
            }
        }
        )

}



