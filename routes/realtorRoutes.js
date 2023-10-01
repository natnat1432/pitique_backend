import express from "express"
const routes = express.Router();
import { authenticateToken } from "../middleware/authentication.js";
import multer from 'multer'
import realtorController from "../controllers/realtorController.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import { get_data_conditions } from "../database/database.js";
import cors from "cors"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { rimraf } from 'rimraf';

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const email = req.body.email

            const userUploadsDir = path.join('uploads', 'realtor', email)
            fs.mkdirSync(userUploadsDir, { recursive: true })
            cb(null, userUploadsDir)

        } catch (error) {
            cb(error, null)
        }
    },
    filename: async (req, file, cb) => {
        const email = req.body.email
        cb(null, `${email}_profile.${file.originalname.split('.'[1])}`)
    }
})


const update_storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const email = req.body.email
            const userUploadsDir = path.join('uploads', 'realtor', email)


            await rimraf(userUploadsDir, { recursive: false });

          
            fs.mkdirSync(userUploadsDir, { recursive: true })
            cb(null, userUploadsDir)

        } catch (error) {
            cb(error, null)
        }
    },
    filename: async (req, file, cb) => {
        const email = req.body.email
        cb(null, `${email}_profile.png`)
    }
})






const profile_upload = multer({ storage: storage })
const profile_update = multer({ storage: update_storage })


routes.post("/", realtorController.createRealtor)
routes.patch("/", authenticateToken, realtorController.updateRealtor)
routes.get("/", authenticateToken, realtorController.getActiveRealtors)
routes.patch("/terminate", authenticateToken,realtorController.terminateRealtor)
routes.get("/:rltr_id", authenticateToken, realtorController.getSingleRealtor)

routes.get('/:email/profileimage', (req, res) => {
    const email = req.params.email;
    const imagePath = path.join(__dirname, '..', 'uploads', 'realtor', email);
    const imageExtensions = ['.jpg', '.jpeg', '.png'];

    if (!fs.existsSync(imagePath)) {
        // If no valid images are found, send the alternate image
        const alternateImagePath = path.join(__dirname, '..', 'uploads', 'admin', 'user.png');

        fs.access(alternateImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
                res.sendFile(alternateImagePath);
            } else {
                res.status(404).send('Alternate image not found');
            }
        });
    }
    else {
        fs.readdir(imagePath, (err, files) => {
            if (err) {
                return res.status(200).send('No user image uploaded');
            }

            const validImages = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return imageExtensions.includes(ext);
            });

            if (validImages.length > 0) {
                // If valid images are found, send the first one in the array
                const imageToSend = validImages[0];
                res.sendFile(path.join(imagePath, imageToSend));
            } else {
                // If no valid images are found, send the alternate image
                const alternateImagePath = path.join(__dirname, '..', 'uploads', 'admin', 'user.png');

                fs.access(alternateImagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        res.sendFile(alternateImagePath);
                    } else {
                        res.status(404).send('Alternate image not found');
                    }
                });
            }
        });
    }
});

routes.post("/updateimage", profile_update.single('image'),(req,res) => {
    const email = req.body.email

    const image = req.file

    if(email === null) res.status(200).json({success:false, message:"Missing email"})
    if(image === null) res.status(200).json({success:false, message:"Missing image"})

   
    res.status(200).json({success:true,message:"Image updated"})
    

  

})

export default routes
