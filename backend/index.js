import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import googleRoutes from "./routes/googleAuth.js"
import GoogleAuth from "./utils/googleAuth.js";
import connectToDb from "./database/database.js";
import LocalAuth from "./routes/authRoutes.js"
import MongoStore from "connect-mongo"
import session from "express-session"
import passport from "passport"
import authSchema from "./model/authModel.js";
import checkCookie from "./middleware/checkCookies.js";
import CheckUserType from "./middleware/checkUserType.js";

let app = express();

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 10 * 6,
        httpOnly: true,
        sameSite: 'lax',
        secure : false
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        ttl: 10 * 6
    })
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async (user, done) => {

    try {
        let findUser = await authSchema.findById(user)
        done(null, findUser)
    } catch (err) {
        done(err)
    }
})

GoogleAuth()

app.use('/auth/google', googleRoutes)
app.use('/auth/local', LocalAuth)

app.get('/user', checkCookie,CheckUserType('user'),(req, res) => {
    res.send('userlogin')
})

app.get('/vendor', checkCookie,CheckUserType('vendor'),(req, res) => {
    res.send('vendorlogin')
})

app.listen(3000, () => {
    connectToDb();
    console.log("Server running on http://localhost:3000")
}
);
