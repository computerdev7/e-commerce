import { create } from "zustand"
import axios from "axios"

let url = '`http://localhost:3000/userorder/'

let userOrder = create((set, get) => ({

    orderIsNotAvailable: async (id) => {
        try {

            let data = await axios.delete(`${url}notavailable?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    cancelOrder: async (id) => {
        try {

            let data = await axios.put(`http://localhost:3000/userorder/cancelorder?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    delivered: async (id) => {
        try {

            let data = await axios.put(`http://localhost:3000/userorder/delivered?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    returnOrder: async (id, refundFeedback) => {
        try {

            let data = await axios.post(`http://localhost:3000/userorder/return?id=${id}`, {
                f: refundFeedback
            }, {
                withCredentials: true
            })
            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    giveOrderToDelivery: async (id) => {
        try {

            let data = await axios.put(`http://localhost:3000/userorder/refunddelivery?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    applyFilter: (selectFilter, setOrders) => {
        try {

            axios.get(`http://localhost:3000/userorder/getorders?o=${selectFilter}`, {
                withCredentials: true
            })
                .then(res => setOrders(res.data.message))
        } catch (err) {
            console.log(err)
        }
    }


}))

export default userOrder