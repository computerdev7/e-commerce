import { create } from "zustand";
import axios from "axios";

let categoryStore = create((set,get)=> ({
    getCategory : async()=> {

        try{
            let data = await axios.get('https://loans-substance-retreat-rounds.trycloudflare.com/vendor/getCategories',{
                withCredentials : true
            })

            return data
        } catch(err){
            console.log(err)
        }

    },
    getCategoryU : async()=> {

        try{
            let data = await axios.get('https://loans-substance-retreat-rounds.trycloudflare.com/user/getCategories',{
                withCredentials : true
            })

            return data
        } catch(err){
            console.log(err)
        }

    }
}))

export default categoryStore