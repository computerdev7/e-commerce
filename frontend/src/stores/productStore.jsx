import { create } from "zustand";
import axios from "axios";

let url = 'http://localhost:3000'

let productStore = create((set, get) => ({
    addProduct: async (product_name, price) => {
        try {

            let addProduct = await axios.post(`${url}/vendor/addproduct`, {
                productname: product_name,
                price: price
            }, {
                withCredentials : true
            })

            return addProduct

        } catch (err) {
            console.log(err)
        }
    },
    getProducts : async()=> {

        try{
            let getProduct = await axios.get(`${url}/vendor/getAllProducts`,{
                withCredentials : true
            })

            return getProduct
        }catch(err){
            console.log(err)
        }

    },
    deleteProduct : async(id)=> {

        try{
            let deleteProduct = await axios.delete(`${url}/vendor/deleteProduct/${id}`,{
                withCredentials : true
            })

            return deleteProduct
        }catch(err){
            console.log(err)
        }
    },
    updateProduct : async(product_name,price, id)=> {

        try{
            let updateProduct = await axios.patch(`${url}/vendor/updateProduct`, {
                product_name,
                price,
                id
            }, {
                withCredentials : true
            })

            return updateProduct
        }catch(err){
            console.log(err)
        }
    },
    getProduct : async(id)=> {
        try {
            let getProduct = await axios.get(`${url}/vendor/getProduct/${id}`,{
                withCredentials : true
            })

            return getProduct;
        }catch(err){
            console.log(err)
        }

    }
}))

export default productStore