import MongoClient from "mongodb";
import dotenv from "dotenv/config";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import moment from "moment";
import globals from "../../globals";
import { GetUserData } from "./AccountService";



export const CreateUser = async (req) => {
    let returnVal = null;

    let saltRounds = 10;
    let hashed = await bcrypt.hash(req.body.password, saltRounds)
    console.log(hashed);
    return returnVal;

}
export const Login = async (req) => {
    var debugUser = globals.DebugUserList.find(user => user.username === req.body.username)
    console.log(debugUser);
    if (debugUser) {
        var isAuthed = await bcrypt.compare(req.body.password, debugUser.salt)
        if (isAuthed) {
            let userData = await GetUserData(req.body.username);
            const accessToken = JWT.sign({ username: req.body.username, userData }, process.env.TOKEN_SECRET);
            console.log(accessToken);
            return {
                Status: 'Success',
                Data: 'User Logged In.',
                Token: accessToken,
                UserData: userData
            }
        }
        else {
            return {
                Status: 'Error',
                Data: 'Invalid Password. User is not Authenticated.'
            }
        }
    }
    else
        return {
            Status: 'Error',
            Data: 'User not found. User is not Authenticated.'
        }
}

export const GetUserFromToken = async (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        let user = [];
        JWT.verify(token, process.env.TOKEN_SECRET, (err, tokenUser) => {
            user = tokenUser
        });

        return user;
    }
    else
        return false


}


