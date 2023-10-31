import express from "express"
const routes = express.Router();
import { authenticateToken } from "../middleware/authentication.js";
import multer from 'multer'
import adminController from "../controllers/adminController.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as path from 'path'; 
import * as fs from 'fs';      
import { get_single_data_conditions } from "../database/database.js";
import cors from "cors"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





const storage = multer.diskStorage({
    destination: async(req,file,cb) => {
        try{
            const email  = req.body.email
            // const user = await get_single_data_conditions('admin', ['admin_email'], [email])

            // if(user){
                const userUploadsDir = path.join('uploads','admin',email)
                fs.mkdirSync(userUploadsDir,{recursive:true})
                cb(null,userUploadsDir)
            // }
          
        }catch(error){
            cb(error,null)
        }
    },
    filename: async (req,file,cb) => {
        const email  = req.body.email
        // const user = await get_single_data_conditions('admin', ['admin_email'], [email])

        // if(user){
            cb(null,`${email}_profile.${file.originalname.split('.'[1])}`)
        // }
    }
})

const profile_upload = multer({storage:storage})

routes.post("/", authenticateToken, profile_upload.single('image'),adminController.createAdmin)
routes.patch("/", authenticateToken,adminController.updateAdmin)
routes.get("/", authenticateToken, adminController.getAdmin)
routes.get("/:admin_id", authenticateToken, adminController.getSingleAdmin)

routes.get('/:email/profileimage', (req, res) => {
  const email = req.params.email;
  const imagePath = path.join(__dirname, '..', 'uploads', 'admin', email);
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
  else{
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

export default routes;

