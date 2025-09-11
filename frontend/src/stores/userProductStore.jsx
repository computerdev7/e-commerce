import { create } from "zustand";
import axios from "axios";

let url = 'http://localhost:3000/user'

let userProductStore = create((set, get) => ({

    getUserProducts: async () => {
        try{
            let data = await axios.get(`${url}/getAllProducts`, {
                withCredentials: true
            })
    
            return data

        } catch(err){
            console.log(err)
        }
    },
    getUserProduct: async (id)=> {
        try{
            let data = await axios.get(`${url}/getProduct?id=${id}`,{
                withCredentials : true
            })

            return data
        }catch(err){
            console.log(err)
        }
    },
    addToCart: async (id) => {
        try{
            let data = await axios.post(`${url}/addtocart?id=${id}`,{}, {
                withCredentials: true
            })
    
            return data

        } catch(err){
            console.log(err)
        }
    },
    getCart: async () => {
        try{
            let data = await axios.get(`${url}/cartlist`, {
                withCredentials: true
            })
    
            return data

        } catch(err){
            console.log(err)
        }
    },
    removeFromCart: async (id) => {
        try{
            let data = await axios.delete(`${url}/removefromcart?id=${id}`, {
                withCredentials: true
            })
    
            return data

        } catch(err){
            console.log(err)
        }
    },
    searchProduct: async(q,page,chooseCategory,choosePrice) => {
        try{
            let data = await axios.get(`${url}/search?q=${q}&page=${page}&cat=${chooseCategory}&p=${choosePrice}`,{
                withCredentials: true
            })

            return data 
        }catch(err){
            console.log(err)
        }
    },
    searchSuggestion: async (q) => {
        try {
            let getSuggestion = await axios.get(`${url}/searchsuggestion?q=${q}`, {
                withCredentials: true
            })

            let data = getSuggestion.data.message

            let arr = [];
            
            arr = data.map((e) => {
                return e.product_name
            })

            return arr
        } catch (err) {
            console.log(err)
        }
    }

}))

export default userProductStore