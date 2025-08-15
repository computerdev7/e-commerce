import express from "express"
import passport from "passport"

let routes = express.Router();

routes.get('/', 
    passport.authenticate("google", {scope : ["profile","email"], prompt : "select_account"}))

routes.get('/callback',
    passport.authenticate('google',{failureRedirect : '/'}),
    (req,res)=> {
        res.redirect('http://localhost:5173/home')
    }
)

export default routes