import mongoose from "mongoose";

let connectToDb = ()=> {
    mongoose.connect(process.env.MONGO_DB)
    .then(res=> console.log('database connected'))
    .catch(err=> console.log(err))
}

export default connectToDb;