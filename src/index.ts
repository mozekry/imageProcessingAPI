import express from 'express';
import fspromises from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const app = express();
const port = 3000;

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

app.use(express.static('assets'));

app.get('/api/imageresize', async (req, res) => {
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
            await sharp(`assets/images/${imagename}.jpg`)
                .resize(width, height)
                .toFile(imagesResizedLocation);
            res.sendFile(imagesResizedLocation);
        } else {
            res.send(`<h3 style="color: red">File doesn't exist</h3>`);
        }
    }
});
