import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import authSchema from "../model/authModel.js"


export default async function GoogleAuth() {

    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            let findUser = await authSchema.find({username : profile.emails[0].value})
            if(findUser.length != 0){
                console.log('username already exists')
                return done(null, findUser[0])
            } else {
                let addToDb = new authSchema({
                    username : profile.emails[0].value,
                    googleId : profile.emails[0].id,
                    provider : 'google'
                })

                let saveToDb = await addToDb.save();
                return done(null, saveToDb)
            }
        }
    ))
}