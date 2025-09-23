import { create } from "zustand";
import axios from "axios";

let url = 'http://localhost:3000'

let productStore = create((set, get) => ({
    addProduct: async (product_name, price, id, category, sub_category, desc, shortDetailInput, longDetailInput, imagesNo, quantity) => {
        try {

            let addProduct = await axios.post(`${url}/vendor/addproduct`, {
                productname: product_name,
                price,
                category,
                sub_category,
                desc,
                shortDetailInput,
                longDetailInput,
                imagesNo,
                quantity,
            }, {
                withCredentials: true
            })

            return addProduct

        } catch (err) {
            console.log(err)
        }
    },
    getProducts: async (page, pn, cat, p) => {

        try {
            let getProduct = await axios.get(`${url}/vendor/getAllProducts?page=${page}&cat=${cat}&p=${p}&pn=${pn}`, {
                withCredentials: true
            })

            return getProduct
        } catch (err) {
            console.log(err)
        }

    },
    deleteProduct: async (id) => {

        try {
            let deleteProduct = await axios.delete(`${url}/vendor/deleteProduct/${id}`, {
                withCredentials: true
            })

            return deleteProduct
        } catch (err) {
            console.log(err)
        }
    },
    updateProduct: async (product_name, price, id, category, sub_category, product_desc, product_short_details, product_long_details, imagesNo, quantity, update) => {

        let changeNumber = +quantity;

        try {
            let updateProduct = await axios.patch(`${url}/vendor/updateProduct`, {
                product_name,
                price,
                id,
                category,
                sub_category,
                product_desc,
                product_long_details,
                product_short_details,
                imagesNo,
                quantity : changeNumber,
                update
            }, {
                withCredentials: true
            })

            return updateProduct
        } catch (err) {
            console.log(err)
        }
    },
    getProduct: async (id) => {
        try {
            let getProduct = await axios.get(`${url}/vendor/getProduct/${id}`, {
                withCredentials: true
            })

            return getProduct;
        } catch (err) {
            console.log(err)
        }

    },
    searchSuggestion: async (q) => {
        try {
            let getSuggestion = await axios.get(`${url}/vendor/searchsuggestion?q=${q}`, {
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

export default productStore