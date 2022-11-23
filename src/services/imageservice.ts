import path from 'path';
import sharp from 'sharp';

const processingImage = async (
    imagename: string,
    width: number,
    height: number
): Promise<string> => {
    const imagesResizedLocation =
        path.resolve('./') +
        '/assets/images_resized/' +
        `${imagename}_${width}_${height}.jpg`;
    await sharp(`assets/images/${imagename}.jpg`)
        .resize(width, height)
        .toFile(imagesResizedLocation);
    return imagesResizedLocation;
};

export default processingImage;
