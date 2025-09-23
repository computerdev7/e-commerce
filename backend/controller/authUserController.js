import authSchema from "../model/authModel.js"
import bcrypt from "bcryptjs"

export async function signup(req, res, next) {
   
    let { username, password, usertype } = req.body
    let checkUniqueChar = /[@#$%&]/.test(username)
    let checkSpaces = /^\s+$/.test(username)

    try {

        let findUser = await authSchema.find({ username , userType : usertype})

        if (findUser.length != 0) {
            return res.status(401).json({ message: 'User already Exists' })
        }

        if(username.length < 5 || username.length > 15 || password.length < 5 || password.length > 15){
            return res.status(403).json({message : 'username or password lengths are inappropriate'})
        } else if(!checkUniqueChar){
            return res.status(403).json({message : 'include one unique charachters'})
        } else if(checkSpaces){
            return res.status(403).json({message : 'please right charachter instead of spaces'})
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassWord = await bcrypt.hash(password, salt)

        let addToDb = new authSchema({
            username: username,
            password: hashPassWord,
            provider: 'local',
            userType: usertype
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
        res.status(500).json({message : 'error in user signup', err})
        console.log(err)
    }
}

export async function login(req,res,next){
    let { username, password, usertype } = req.body

    try {

        let findUser = await authSchema.find({ username, userType : usertype })

        if (findUser.length == 0) {
            return res.status(401).json({ message: 'invlaid user' })
        }

        let comparePassword = await bcrypt.compare(password,findUser[0].password)

        if(!comparePassword){
           return res.status(403).json({message : 'wrong password'})
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
        res.status(500).json({message : 'error in user login', err})
    }
}