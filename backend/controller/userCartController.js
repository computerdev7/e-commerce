import authSchema from "../model/authModel.js";

export async function addtocart(req, res) {
    let id = req.query.id
    let userId = req.user.id

    try {
        let data = await authSchema.findByIdAndUpdate({ _id: userId }, { $push: { cart: id } }, { new: true })

        res.status(201).json({ message: data })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export async function cartlist(req, res) {

    let userId = req.user.id

    try {
        let data = await authSchema.find({ _id: userId }).populate('cart')
        let sendData = data[0].cart
        res.status(200).json({ message: sendData })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}

export async function removeFromCart(req, res) {

    let userId = req.user.id
    let id = req.query.id

    try {
        let data = await authSchema.findByIdAndUpdate({ _id: userId }, { $pull: { cart: id } }, { new: true })

        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

}