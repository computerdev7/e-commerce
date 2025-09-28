import { getPreSignedImageUrl, getDeletePreSignedUrl } from "../utils/presigned_url/getPresignedImageUrl.js";
import ProductSchema from "../model/productModel.js";

export async function addProduct(req, res) {

    let { productname, price, category, sub_category, desc, shortDetailInput, longDetailInput, imagesNo, quantity } = req.body
    let id = req.user._id
    let changeToNumber = +quantity

    try {

        let addProduct = new ProductSchema({
            product_owner: req.user._id,
            product_name: productname,
            price: price,
            product_desc: desc,
            product_short_details: shortDetailInput,
            product_long_details: longDetailInput,
            sub_category: sub_category,
            category: category,
            quantity: changeToNumber
        })

        let saveProduct = await addProduct.save()

        let imageUrl = {
            image300: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${id}/${saveProduct._id}300.webp`,
            image800: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${id}/${saveProduct._id}800.webp`,
            image1600: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${id}/${saveProduct._id}1600.webp`
        }

        let imageExtraUrl = [];
        let sizes = ['300', '800', '1600']

        for (let i = 1; i < imagesNo; i++) {
            let obj = {
                image800: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${id}/${saveProduct._id}${i}800.webp`,
                image1600: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${id}/${saveProduct._id}${i}1600.webp`
            }
            imageExtraUrl.push(obj)
        }

        await ProductSchema.findByIdAndUpdate({ _id: saveProduct._id }, { imageUrl: imageUrl, imageExtraUrl: imageExtraUrl })

        let presignedArray = [];
        let presignedNu = presignedArray.length < 3 ? 1 : 0;

        for (let i = 0; i < imagesNo; i++) {
            for (let j = presignedNu; j < 3; j++) {
                let sendPostImageUrl = await getPreSignedImageUrl(id, `${saveProduct._id}${i==0?'':i}${sizes[j]}.webp`)
                presignedArray.push(sendPostImageUrl)
            }
        }

        res.status(201).json({ message: presignedArray })
    } catch (err) {
        res.status(500).json({ message: 'error in adding product', err })
        console.log(err)
    }
}

export async function deleteProduct(req, res) {

    let { id } = req.params

    try {

        let getProducts = await ProductSchema.findByIdAndDelete({ _id: id })
        await getDeletePreSignedUrl(req.user._id, `${getProducts._id}`, getProducts.imageExtraUrl)
        res.status(200).json({ message: getProducts })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in getting product', err })
    }

}

export async function updateProduct(req, res) {

    let { imagesNo, update, id } = req.body
    let userid = req.user._id
    let wholeUpdate = req.body
    let presignedArray = [];

    try {
        if (update && imagesNo > 0) {
            let getProducts = await ProductSchema.find({ _id: id })
            await getDeletePreSignedUrl(userid, `${getProducts[0]._id}`, getProducts[0].imageExtraUrl)

            let sizes = ['300', '800', '1600']

            let imageExtraUrl = [];

            for (let i = 1; i < imagesNo; i++) {
                let obj = {
                    image800: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${req.user._id}/${getProducts[0]._id}${i}800.webp`,
                    image1600: `https://e-commerce-image.s3.ap-south-1.amazonaws.com/vendor-product/${req.user._id}/${getProducts[0]._id}${i}1600.webp`
                }
                imageExtraUrl.push(obj)
            }

            let presignedNu = presignedArray.length < 3 ? 0 : 1;

            for (let i = 1; i < imagesNo; i++) {
                for (let j = presignedNu; j < 3; j++) {
                    let sendPostImageUrl = await getPreSignedImageUrl(req.user._id, `${getProducts[0]._id}${i==0?'':i}${sizes[j]}.webp`)
                    presignedArray.push(sendPostImageUrl)
                }
            }
            wholeUpdate.imageExtraUrl = imageExtraUrl
        }

        let updateProduct = await ProductSchema.findByIdAndUpdate({ _id: id }, { $set: wholeUpdate }, { new: true })
        if (update) {
            res.status(200).json({ message: presignedArray })
        } else {
            res.status(200).json({ message: updateProduct })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'error in updating product', err })
    }

}