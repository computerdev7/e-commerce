import express from "express"
import authSchema from "../model/authModel.js"
import bcrypt from "bcryptjs"

let route = express.Router()

route.post('/signup', async (req, res, next) => {

    let { username, password } = req.body

    try {

        let findUser = await authSchema.find({ username })

        if (findUser.length != 0) {
            return res.status(401).json({ message: 'User already Exists' })
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassWord = await bcrypt.hash(password, salt)

        let addToDb = new authSchema({
            username: username,
            password: hashPassWord,
            provider: 'local'
        })

        let saveToDb = await addToDb.save()

        req.login(saveToDb, (err) => {
            if (err) {
                return next(err)
            } else {
                res.status(201).json(saveToDb);
            }
        })

    } catch (err) {
        console.log(err)
    }
})

route.post('/login', async (req, res, next) => {

    let { username, password } = req.body

    try {

        let findUser = await authSchema.find({ username })

        if (findUser.length == 0) {
            return res.status(401).json({ message: 'invlaid user' })
        }

        let comparePassword = await bcrypt.compare(password,findUser[0].password)

        if(!comparePassword){
            res.status(403).json({message : 'wrong password'})
        }

        req.login(findUser[0], (err) => {
            if (err) {
                return next(err)
            } else {
                res.status(201).json(findUser[0]);
            }
        })

    } catch (err) {
        console.log(err)
    }
})


export default route;