import path from 'path';
import supertest from 'supertest';
import app from '../index';
import fspromises from 'fs/promises';
import processingImage from '../services/imageservice';
import sharp from 'sharp';

const request = supertest(app);

describe('Test endpoint responses', () => {
    it('gets the api endpoint', async () => {
        const response = await request.get(
            '/api/imageresize?imagename=fjord&width=500&height=900'
        );
        expect(response.status).toBe(200);
    });
});

describe('Test image processing', () => {
    const imagesResizedLocation = path.join(
        __dirname,
        '../../assets/images_resized',
        `fjord_500_900.jpg`
    );
    it('test apply width and height', async () => {
        await request.get(
            '/api/imageresize?imagename=fjord&width=500&height=900'
        );
        const isExist = await fspromises
            .stat(imagesResizedLocation)
            .catch(() => false);
        expect(isExist).not.toBe(false);
    });

    it('must resize imgae by 500w*900h', async () => {
        const newImagesResizedLocation = await processingImage(
            'fjord',
            500,
            900
        );
        const image = await sharp(newImagesResizedLocation);
        const metadata = await image.metadata();
        expect(metadata.width).toBe(500);
        expect(metadata.height).toBe(900);
    });
});
