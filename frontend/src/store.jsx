import {create} from "zustand"
import axios from "axios"

let url = 'http://localhost:3000'

let useStore = create((set,get)=> ({
    signUp : async(username,password)=> {
        let sendReq = await axios.post(`${url}/auth/local/signup`,{
            username : username,
            password : password
        },{
            withCredentials : true
        })

        return sendReq
    },
    login : async(username,password)=> {
        let sendReq = await axios.post(`${url}/auth/local/login`,{
            username : username,
            password : password
        },{
            withCredentials : true
        })

        return sendReq
    }
}))

export default useStore;