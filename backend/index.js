import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import googleRoutes from "./routes/googleAuth.js";
import GoogleAuth from "./utils/googleAuth.js";
import connectToDb from "./database/database.js";
import LocalAuth from "./routes/authRoutes.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import authSchema from "./model/authModel.js";
import productRoute from "./routes/vendor_productRoutes.js";
import productInfoRoute from "./routes/productInfo.js";
import productRouteUser from "./routes/user_productRoutes.js";
import Razorpay from "razorpay";
import crypto from "crypto"

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
        maxAge: 1000 * 10 * 6 * 60,
        httpOnly: true,
        sameSite: 'lax',
        secure : false
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

GoogleAuth()

app.use('/auth/google', googleRoutes)
app.use('/auth/local', LocalAuth)
app.use('/vendor',productRoute)
app.use('/vendor',productInfoRoute)
app.use('/user',productRouteUser)

const razorpay = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_SECRET_KEY
})

app.post('/create-order',async(req,res)=> {
    try{
        const options = {
            amount : 50000,
            currency : 'INR',
            receipt : 'receipt#1'
        }

        const order = await razorpay.orders.create(options)
        res.status(201).json({message : order})

    }catch(err){
        res.status(500).json({message : err})
    }
})

app.post('/check-order',(req,res)=> {
    try{

        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const generated_signature = crypto
        .createHmac("sha256","jGWXRF5D6HbsNjgiatmEKUsL")
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex')

        if(generated_signature === razorpay_signature){
            res.status(200).json({message : 'success'})
        } else {
            res.status(500).json({message : 'failed' })
        }

    }catch(err){
        console.log(err)
        res.status(500).json({message : err})
    }
})

app.listen(3000, () => {
    connectToDb();
    console.log("Server running on http://localhost:3000")
}
);
