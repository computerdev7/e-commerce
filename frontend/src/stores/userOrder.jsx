import { create } from "zustand"
import axios from "axios"

let url = '`http://localhost:3000/userorder/'

let userOrder = create((set, get) => ({

    orderIsNotAvailable: async (id) => {
        axios.delete(`${url}notavailable?id=${id}`, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))
    },
    cancelOrder: async(id) => {
        axios.put(`http://localhost:3000/userorder/cancelorder?id=${id}`, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))
    },
    delivered: (id)=> {
        axios.put(`http://localhost:3000/userorder/delivered?id=${id}`, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))
    },
    returnOrder: (id, refundFeedback)=> {
        axios.post(`http://localhost:3000/userorder/return?id=${id}`, {
            f: refundFeedback
        }, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))
    },
    giveOrderToDelivery: (id)=> {
        axios.put(`http://localhost:3000/userorder/refunddelivery?id=${id}`, {
            withCredentials: true
        })
            .then(res => console.log(res.data.message))
    },
    applyFilter : (selectFilter, setOrders)=> {
        axios.get(`http://localhost:3000/userorder/getorders?o=${selectFilter}`, {
            withCredentials: true
        })
            .then(res => setOrders(res.data.message))
    }


}))

export default userOrder