import imageCompression from 'browser-image-compression';

export async function compressImage(e) {

    let imageFile = e.currentTarget.files[0]

    const img = new Image();

    img.src = URL.createObjectURL(imageFile)
    img.onload = () => {
        if (img.width > 2000 || img.height > 2000) {
            return 0
        }
    }

    if (imageFile.size > 1024 * 1024) {
        return 1
    }

    let sizes = [300, 800, 1600];

    let compressImageArr = [];

    for (let i = 0; i < 3; i++) {

        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: sizes[i],
            useWebWorker: true
        }

        let compressimg = await imageCompression(imageFile, options).then(res => {
            compressImageArr.push(res)
        })

    }


    return compressImageArr

}