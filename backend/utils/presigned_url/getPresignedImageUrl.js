import { S3Client,PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region : 'ap-south-1',
    credentials : {
        accessKeyId : 'AKIAWCSNZLSWSOMBPDR6',
        secretAccessKey : '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'
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

export async function getDeletePreSignedUrl(username,filename){

    const command = new DeleteObjectCommand({
        Bucket : 'e-commerce-image',
        Key : `vendor-product/${username}/${filename}`,
    })

    try{
        await S3.send(command)
    }catch(err){
        console.log(err)
    }

}