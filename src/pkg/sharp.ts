import sharp from 'sharp'

export type Resize = {
    resize: boolean
    height: number
    width: number
}

class Sharp {
    public static async Convert(
        source: Buffer,
        filename: string,
        convertTo: 'webp' | 'jpeg',
        quality: number,
        resize?: Resize
    ) {
        let sharpImage = sharp(source)
        if (resize?.resize)
            sharpImage = sharpImage.resize({
                height: resize.height,
                width: resize.width,
                fit: 'inside',
            })
        const { data, info } = await sharpImage[convertTo]({
            quality,
        }).toBuffer({ resolveWithObject: true })

        const mimetype = 'image/' + info.format

        return {
            meta: {
                filename: filename + '.' + convertTo,
                size: info.size,
                mimetype,
            },
            source: data,
        }
    }
}

export default Sharp
