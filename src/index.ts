import express from 'express';
import fspromises from 'fs/promises'
import fs from 'fs';
import path, { parse } from 'path';
import { stringify } from 'querystring';
import sharp from 'sharp';


const app = express();
const port = 3000;

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });

  app.use(express.static('assets'));




  app.get('/api/imageresize',async (req,res)=>{
    let imagename:string = req.query.imagename == undefined?'': req.query.imagename.toString();
    let width:number = req.query.width == undefined ? 0 : isNaN(parseInt(req.query.width.toString()))?0:parseInt(req.query.width.toString()) ;
    let height:number = req.query.height== undefined? 0 : isNaN(parseInt(req.query.height.toString()))?0:parseInt(req.query.height.toString()) ;
    const location = path.join(__dirname, '../assets/images_resized', `${imagename}_${width}_${height}.jpg`);
    const IsFileExist = await fspromises.stat(`assets/images_resized/${imagename}_${width}_${height}.jpg`).catch(e => false)
    if(IsFileExist){
        res.sendFile(location);
    }
    else{
        const isOriginalFileExist = await fspromises.stat(`assets/images/${imagename}.jpg`).catch(e => false)
        if(isOriginalFileExist)
        {
            await sharp(`assets/images/${imagename}.jpg`).resize(width,height).toFile(`assets/images_resized/${imagename}_${width}_${height}.jpg`);
            res.sendFile(location);
        }
        else{

            res.send(`<h3 style="color: red">File doesn't exist</h3>`)
        }
    

    }
   
  });