import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import moment from "moment";



export const CreateUser = async (req) => {
    let returnVal = null;
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            var userExsisting = await dbo.collection('users').findOne({
                username: req.body.username,
                email: req.body.email
            })

            if (userExsisting) {
                returnVal = {
                    Status: 'Error',
                    Data: 'Username or Email already registered'
                }
            }
            else {
                let saltRounds = 10;
                let hashed = await bcrypt.hash(req.body.password, saltRounds)

                dbo.collection("users").insertOne({
                    username: req.body.username,
                    email: req.body.email,
                    passwordSaltedHash: hashed,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    createdDate: moment.utc().format('MM/DD/YYYY HH:mm:ss'),
                    lastLogin: moment.utc().format('MM/DD/YYYY HH:mm:ss')
                }, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                });
                returnVal =  {
                    Status: 'Success',
                    Data: 'New User ${req.body.username} Created'
                }

            }
            db.close();
            return returnVal;
        });
}


export const Login = async (req) => {
    return MongoClient.connect(process.env.DB_CONNECTION)
        .then(async (db, err) => {
            if (err) throw err;
            var dbo = db.db("gateslayer");
            var user = await dbo.collection("users").findOne({ username: req.body.username })
            if (user) {
                const accessToken = JWT.sign({ username: user.username, _id: user._id }, process.env.TOKEN_SECRET);
                var result = await bcrypt.compare(req.body.password, user.passwordSaltedHash)
                if (result) {
                    await dbo.collection("users").updateOne({ _id: user._id },
                        { $set: { token: accessToken } },
                        (err, result) => {
                            if (err) throw err;
                            console.log(result);
                            db.close();
                        });
                    return {
                        Status: 'Success',
                        Data: 'User Logged In.',
                        Token: accessToken
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
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let user = [];
        JWT.verify(token, process.env.TOKEN_SECRET, (err, tokenUser) => {
            user = tokenUser
        });

        if (user)
            return true
        else
            return false
    }
    else
        return false


}



