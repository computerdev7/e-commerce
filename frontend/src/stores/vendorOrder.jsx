import { create } from "zustand"
import axios from "axios"

let url = 'https://loans-substance-retreat-rounds.trycloudflare.com'

let vendorOrder = create(() => ({
    setAvailable: async (id, cond) => {
        try {

            let data = await axios.put(`${url}/vendororder/setavailable?id=${id}&cond=${cond}`, {}, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    packaged: async (id) => {
        try {

            let data = await axios.put(`${url}/vendororder/packaged?id=${id}`, {}, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    cancelOrder: async (id) => {
        try {

            let data = await axios.delete(`${url}/vendororder/confirmordercancel?id=${id}`, {}, {
                withCredentials: true
            })
            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    sentOrder: async (id) => {
        try {

            let data = await axios.put(`${url}/vendororder/delivery?id=${id}`, {}, {
                withCredentials: true
            })

            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    getDelivery: async (id) => {
        try {

            let data = await axios.put(`${url}/vendororder/getdelivery?id=${id}`, {}, {
                withCredentials: true
            })
            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    refunded: async (id) => {
        try {

            let data = await axios.put(`${url}/vendororder/refunddelivered?id=${id}`, {}, {
                withCredentials: true
            })
            return data.data.message
        } catch (err) {
            console.log(err)
        }

    },
    applyFilter: async (selectFilter, setOrderProducts, setPage) => {
        try {

            axios.get(`${url}/vendororder/getorders?o=${selectFilter}&p=${1}`, {
                withCredentials: true
            })
                .then(res => setOrderProducts(res.data.message))

            setPage(1)
        } catch (err) {
            console.log(err)
        }
    }

}))

export default vendorOrder