import { create } from "zustand";

let store_util = create((set,get) => ({
    product_id : {
        id : '',
        cond : false,
    },
    setProduct_id : (id)=> {
        set({product_id : id})
    }
}))

export default store_util;