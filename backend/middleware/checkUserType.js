export default function CheckUserType(usertype){
   return (req,res,next) => {
        if(req.user.userType != usertype){
            return res.status(403).json({message : 'invalid user'})
        }
    
        return next()
    }
}