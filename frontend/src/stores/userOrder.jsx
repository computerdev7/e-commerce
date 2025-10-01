import { create } from "zustand"
import axios from "axios"

let url = '`https://loans-substance-retreat-rounds.trycloudflare.com/userorder/'

let userOrder = create(() => ({

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

            let data = await axios.put(`${url}cancelorder?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    delivered: async (id) => {
        try {

            let data = await axios.put(`${url}delivered?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    returnOrder: async (id, refundFeedback) => {
        try {

            let data = await axios.post(`${url}return?id=${id}`, {
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

            let data = await axios.put(`${url}refunddelivery?id=${id}`, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }
    },
    applyFilter: (selectFilter, setOrders) => {
        try {

            axios.get(`${url}getorders?o=${selectFilter}`, {
                withCredentials: true
            })
                .then(res => setOrders(res.data.message))
        } catch (err) {
            console.log(err)
        }
    }


}))

export default userOrder