// packages
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
// others
import GoogleAuth from "./utils/googleAuth.js";
import connectToDb from "./database/database.js";
// importing routes
import googleRoutes from "./routes/googleAuth.js";
import LocalAuth from "./routes/authRoutes.js";
import authSchema from "./model/authModel.js";
import productRoute from "./routes/vendor_productRoutes.js";
import productInfoRoute from "./routes/productInfo.js";
import productRouteUser from "./routes/user_productRoutes.js";
import userOrdersRoute from "./routes/userOrderRoutes.js"
import vendorOrderRoutes from "./routes/vendorOrderRoutes.js"

// this is the single change maybe on the backend to see the result of the deployment

dotenv.config();
let app = express();

// middlewares
app.use(cors({
    origin: 'https://akash-e-comm.vercel.app/',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 10 * 6 * 60,
        httpOnly: true,
        sameSite:'none',
        secure : true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        ttl: 10 * 6 * 60
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

// running util func for google auth
GoogleAuth()
 
const razorpay = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_SECRET_KEY
})

export default razorpay;

// routes
app.use('/auth/google', googleRoutes)
app.use('/auth/local', LocalAuth)
app.use('/vendor',productRoute)
app.use('/vendor',productInfoRoute)
app.use('/user',productRouteUser)
app.use('/userorder',userOrdersRoute)
app.use('/vendororder',vendorOrderRoutes)


app.listen(3000,'0.0.0.0', () => {
    connectToDb();
    console.log("Server running on http://localhost:3000")
}
);
