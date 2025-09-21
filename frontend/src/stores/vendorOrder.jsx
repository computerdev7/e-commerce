import { create } from "zustand"
import axios from "axios"

let vendorOrder = create(()=> ({
    setAvailable : (id, cond) => {

        axios.put(`http://localhost:3000/vendororder/setavailable?id=${id}&cond=${cond}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    packaged : (id) => {

        axios.put(`http://localhost:3000/vendororder/packaged?id=${id}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    cancelOrder : (id) => {

        axios.delete(`http://localhost:3000/vendororder/confirmordercancel?id=${id}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    sentOrder : (id)=> {

        axios.put(`http://localhost:3000/vendororder/delivery?id=${id}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    getDelivery : (id)=> {

        axios.put(`http://localhost:3000/vendororder/getdelivery?id=${id}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    refunded : (id)=> {

        axios.put(`http://localhost:3000/vendororder/refunddelivered?id=${id}`, {}, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))

    },
    applyFilter : (selectFilter, setOrderProducts, setPage)=> {
        axios.get(`http://localhost:3000/vendororder/getorders?o=${selectFilter}&p=${1}`, {
            withCredentials: true
        })
            .then(res => setOrderProducts(res.data.message))
        
        setPage(1)
    }

}))

export default vendorOrder