import { S3Client,PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv"

dotenv.config();

const S3 = new S3Client({
    region : 'ap-south-1',
    credentials : {
        accessKeyId : process.env.S3_ACCESS_KEY,
        secretAccessKey : process.env.S3_SECRET_KEY
    }
})

export async function getPreSignedImageUrl(username,filename){

    const command = new PutObjectCommand({
        Bucket : 'e-commerce-image',
        Key : `vendor-product/${username}/${filename}`,
        ContentType : 'image/webp',
        CacheControl : "public, max-age=120"
    })

    try{

        let url = await getSignedUrl(S3,command, {expiresIn : 60})

        return url

    }catch(err){
        console.log(err)
    }

}

export async function getDeletePreSignedUrl(username,filename,extraImage){

    let sizes = [300,800,1600]
// deleting main image(3 copies for main image)
    for(let i = 0; i < 3; i++){
        
        const command = new DeleteObjectCommand({
            Bucket : 'e-commerce-image',
            Key : `vendor-product/${username}/${filename}${sizes[i]}.webp`,
        })
    
        try{
            let data =  await S3.send(command)
        }catch(err){
            console.log(err)
        }
    }
// deleting extra image (2 copy for each images)
    for(let i = 1; i <= extraImage.length; i++){

        for(let j = 1; j < 3; j++) {
            
            const command = new DeleteObjectCommand({
               Bucket : 'e-commerce-image',
               Key : `vendor-product/${username}/${filename}${i}${sizes[j]}.webp`,
           })
           try{
               let data =  await S3.send(command)
           }catch(err){
               console.log(err)
           }
        }

    }

}