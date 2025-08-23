export default function checkCookie(req,res,next){
    console.log(req.method, req.path, req.user);

    if(req.user){
        return next();
    }
    // console.log(req.user)
    res.status(401).json({message : 'please login'})
}