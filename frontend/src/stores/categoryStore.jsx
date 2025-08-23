import { create } from "zustand";
import axios from "axios";

let categoryStore = create((set,get)=> ({
    getCategory : async()=> {

        try{
            let data = await axios.get('http://localhost:3000/vendor/getCategories',{
                withCredentials : true
            })

            return data
        } catch(err){
            console.log(err)
        }

    },
    getCategoryU : async()=> {

        try{
            let data = await axios.get('http://localhost:3000/user/getCategories',{
                withCredentials : true
            })

            return data
        } catch(err){
            console.log(err)
        }

    }
}))

export default categoryStore