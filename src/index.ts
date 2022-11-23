import express from 'express';
import fspromises from 'fs/promises';
import path from 'path';
import processingImage from './services/imageservice';

const app = express();
const port = 3000;

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

app.use(express.static('assets'));

app.get('/api/imageresize', async (req, res): Promise<void> => {
    const imagename: string =
        req.query.imagename == undefined ? '' : req.query.imagename.toString();
    const width: number =
        req.query.width == undefined
            ? 0
            : isNaN(parseInt(req.query.width.toString()))
            ? 0
            : parseInt(req.query.width.toString());
    const height: number =
        req.query.height == undefined
            ? 0
            : isNaN(parseInt(req.query.height.toString()))
            ? 0
            : parseInt(req.query.height.toString());

    const imagesResizedLocation = path.join(
        __dirname,
        '../assets/images_resized',
        `${imagename}_${width}_${height}.jpg`
    );
    const IsFileExist = await fspromises
        .stat(imagesResizedLocation)
        .catch(() => false);
    if (IsFileExist) {
        res.sendFile(imagesResizedLocation);
    } else {
        const isOriginalFileExist = await fspromises
            .stat(`assets/images/${imagename}.jpg`)
            .catch(() => false);
        if (isOriginalFileExist) {
            try {
                const newImagesResizedLocation = await processingImage(
                    imagename,
                    width,
                    height
                );
                res.sendFile(newImagesResizedLocation);
            } catch (error: unknown) {
                res.status(400);
                res.send(
                    `<h3 style="color: red">Can't process the image</h3> <br/> <p>${error}</p>`
                );
            }
        } else {
            res.status(404);
            res.send(`<h3 style="color: red">File doesn't exist</h3>`);
        }
    }
});

export default app;
