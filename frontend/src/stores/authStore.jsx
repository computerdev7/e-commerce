import {create} from "zustand"
import axios from "axios"

let url = 'https://loans-substance-retreat-rounds.trycloudflare.com'

let useStore = create((set,get)=> ({
    usersignUp : async(username,password,usertype)=> {
        let sendReq = await axios.post(`${url}/auth/local/user/signup`,{
            username : username,
            password : password,
            usertype : usertype
        },{
            withCredentials : true
        })

        return sendReq
    },
    userlogin : async(username,password,usertype)=> {
        console.log(username,usertype,password)
        let sendReq = await axios.post(`${url}/auth/local/user/login`,{
            username : username,
            password : password,
            usertype : usertype
        },{
            withCredentials : true
        })
        return sendReq
    },
    vendorLogin : async(username,password,usertype)=> {
        let sendReq = await axios.post(`${url}/auth/local/vendor/login`,{
            username : username,
            password : password,
            usertype : usertype
        },{
            withCredentials : true
        })

        return sendReq
    },
    vendorSignup : async(username,password,usertype)=> {
        let sendReq = await axios.post(`${url}/auth/local/vendor/signup`,{
            username : username,
            password : password,
            usertype : usertype
        },{
            withCredentials : true
        })

        return sendReq
    },
}))

export default useStore;