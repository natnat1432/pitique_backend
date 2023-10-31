import {
  insert_data,
  get_single_data,
  get_all_data,
  update_data,
  get_single_data_conditions,
  get_multiple_data,
  delete_data,
  get_active_data,
  get_min_price,
  getRating,
  get_total_unread_notification,
  get_notifications,
} from "../database/database.js";
import {
  capitalizeWords,
  generateRandomPassword,
  generatePitiquerPortfolioFolder,
} from "../utils/util.js";
import { sendEmail } from "../utils/email-sender.js";

class PitiquerController {
  async createPitiquer(req, res) {
    var {
      email,
      firstname,
      middlename,
      lastname,
      phone,
      city,
      province,
      isphotog,
      isphotogedt,
      isvideog,
      isvideogedt,
      isamnty,
      isamntyedt,
      status,
    } = req.body;
    if (
      email !== null &&
      firstname !== null &&
      lastname !== null &&
      phone !== null &&
      status !== null &&
      city !== null &&
      province !== null
    ) {
      var isphotog = req.body.isphotog;
      var isphotogedt = req.body.isphotogedt;
      var isvideog = req.body.isvideog;
      var isvideogedt = req.body.isvideogedt;
      var isamnty = req.body.isamnty;
      var isamntyedt = req.body.isamntyedt;

      if (isphotog === "undefined") isphotog = false;
      else isphotog = true;
      if (isphotogedt === "undefined") isphotogedt = false;
      else isphotogedt = true;
      if (isvideog === "undefined") isvideog = false;
      else isvideog = true;
      if (isvideogedt === "undefined") isvideogedt = false;
      else isvideogedt = true;
      if (isamnty === "undefined") isamnty = false;
      else isamnty = true;
      if (isamntyedt === "undefined") isamntyedt = false;
      else isamntyedt = true;
      //capitalize names
      firstname = capitalizeWords(firstname);
      middlename = capitalizeWords(middlename);
      lastname = capitalizeWords(lastname);
      const password = generateRandomPassword();

      const checkExisting = await get_single_data("pitiquer", "ptqr_email", email);

      if (checkExisting) {
        res
          .status(200)
          .json({ success: false, message: "Pitiquer account already exists" });
      } else {
        const addPitiquer = await insert_data(
          "pitiquer",
          [
            "ptqr_fname",
            "ptqr_mname",
            "ptqr_lname",
            "ptqr_email",
            "ptqr_pass",
            "ptqr_phone",
            "ptqr_city",
            "ptqr_province",
            "ptqr_isphotog",
            "ptqr_isphotogedt",
            "ptqr_isvideog",
            "ptqr_isvideogedt",
            "ptqr_isamnty",
            "ptqr_isamntyedt",
            "ptqr_status",
          ],
          [
            firstname,
            middlename,
            lastname,
            email,
            password,
            phone,
            city,
            province,
            isphotog,
            isphotogedt,
            isvideog,
            isvideogedt,
            isamnty,
            isamntyedt,
            status,
          ]
        );

        if (addPitiquer !== null) {
          generatePitiquerPortfolioFolder(email);
          const sendEm = await sendEmail(email, firstname, password);
          if (sendEm === true) {
            res
              .status(200)
              .send({ success: true, message: "Pitiquer account created" });
          }
        } else {
          res.status(400).json({
            success: false,
            message: "Failed creating pitiquer account",
          });
        }
      }
    } else {
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }

  async updatePitiquer(req, res) {
    var {
      id,
      email,
      firstname,
      middlename,
      lastname,
      phone,
      city,
      province,
      bio,
      isphotog,
      isphotogedt,
      isvideog,
      isvideogedt,
      isamnty,
      isamntyedt,
      status,
    } = req.body;

    if (
      id !== null &&
      email !== null &&
      firstname !== null &&
      lastname !== null &&
      phone !== null &&
      city !== null &&
      province !== null &&
      isphotog !== null &&
      isphotogedt !== null &&
      isvideog !== null &&
      isvideogedt !== null &&
      isamnty !== null &&
      isamntyedt !== null &&
      status !== null
    ) {
      try {
        const check_existing = await get_single_data("pitiquer", "ptqr_id", id);

        if (check_existing) {
          const update_pitiquer = await update_data(
            "pitiquer",
            [
              "ptqr_id",
              "ptqr_fname",
              "ptqr_mname",
              "ptqr_lname",
              "ptqr_email",
              "ptqr_phone",
              "ptqr_city",
              "ptqr_province",
              "ptqr_bio",
              "ptqr_isphotog",
              "ptqr_isphotogedt",
              "ptqr_isvideog",
              "ptqr_isvideogedt",
              "ptqr_isamnty",
              "ptqr_isamntyedt",
              "ptqr_status",
            ],
            [
              id,
              firstname,
              middlename,
              lastname,
              email,
              phone,
              city,
              province,
              bio,
              isphotog,
              isphotogedt,
              isvideog,
              isvideogedt,
              isamnty,
              isamntyedt,
              status,
            ]
          );
          if (update_pitiquer) {
            res.status(200).json({
              success: true,
              message: "Pitiquer updated successfully",
            });
          } else {
            res
              .status(200)
              .json({ success: false, message: "Error updating pitiquer" });
          }
        } else {
          res
            .status(200)
            .json({ success: false, message: "Pitiquer does not exist" });
        }
      } catch (error) {
        console.error("Error updating pitiquer", error);
        res
          .status(400)
          .json({ success: false, message: "Error updating pitiquer" });
      }
    } else {
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }

  async getAllPitiquer(req, res) {
    const pitiquers = await get_single_data("pitiquer");
    try {
      if (pitiquers) {
        const finalPitiquers = pitiquers.map(({ ptqr_pass, ...rest }) => rest);
        res.status(200).json({
          success: true,
          data: finalPitiquers,
          message: "Pitiquers found",
        });
      } else {
        res.status(200).json({ success: false, message: "No pitiquers data" });
      }
    } catch (error) {
      console.error("Error fetching pitiquers", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching pitiquers" });
    }
  }

  async getActivePitiquers(req, res) {
    const pitiquers = await get_active_data(
      "pitiquer",
      ["ptqr_status", "ptqr_status"],
      ["active", "suspended"]
    );
    try {
      if (pitiquers) {
        const finalPitiquers = pitiquers.map(({ ptqr_pass, ...rest }) => rest);
        res.status(200).json({
          success: true,
          data: finalPitiquers,
          message: "Pitiquers found",
        });
      } else {
        res.status(200).json({ success: false, message: "No pitiquers data" });
      }
    } catch (error) {
      console.error("Error fetching pitiquers", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching pitiquers" });
    }
  }

  async getSinglePitiquer(req, res) {
    try {
      const ptqr_id = req.params.ptqr_id;

      if (ptqr_id != null) {
        const pitiquer = await get_single_data("pitiquer", "ptqr_id", ptqr_id);
        delete pitiquer.ptqr_pass;
        res
          .status(200)
          .json({ success: true, data: pitiquer, message: "Pitiquer found" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Missing Pitiquer ID" });
      }
    } catch (error) {
      console.error("Error fetching pitiquer account", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching pitiquer account" });
    }
  }

  async terminatePitiquer(req, res) {
    try {
      const { id } = req.body;
      if (id != null) {
        const pitiquer = await get_single_data("pitiquer", "ptqr_id", id);
        if (pitiquer) {
          const update_pitiquer = await update_data(
            "pitiquer",
            ["ptqr_id", "ptqr_status"],
            [id, "terminated"]
          );

          if (update_pitiquer) {
            res.status(200).json({
              success: true,
              message: "Pitiquer terminated successfully",
            });
          } else {
            res.status(200).json({
              success: false,
              message: "Pitiquer cannot be terminated",
            });
          }
        } else {
          res
            .status(200)
            .json({ success: false, message: "Pitiquer account not found" });
        }
      } else {
        res
          .status(200)
          .json({ success: false, message: "Missing Pitiquer ID" });
      }
    } catch (error) {
      console.error("Error terminating pitiquer account", error);
      res.status(400).json({
        success: false,
        message: "Error terminating pitiquer account",
      });
    }
  }

  async createPackage(req, res) {
    var {
      pkg_name,
      pkg_min_price,
      pkg_desc,
      pkg_isphotog,
      pkg_isphotoedt,
      pkg_isvideog,
      pkg_isvideogedt,
      pkg_isamnty,
      pkg_isamntyedt,
      ptqr_id,
      pkg_isavailable,
      pkg_isvisible,
    } = req.body;
    if (
      pkg_name !== null &&
      pkg_min_price !== null &&
      pkg_desc !== null &&
      pkg_isphotog !== null &&
      pkg_isphotoedt !== null &&
      pkg_isvideog !== null &&
      pkg_isvideogedt !== null &&
      pkg_isamnty !== null &&
      pkg_isamntyedt !== null &&
      ptqr_id !== null &&
      pkg_isavailable !== null &&
      pkg_isvisible !== null
    ) {
      const checkExisting = await get_single_data("package", "pkg_name", pkg_name);

      if (checkExisting) {
        res
          .status(200)
          .json({ success: false, message: "Package already exists" });
      } else {
        const addPackage = await insert_data(
          "package",
          [
            "pkg_name",
            "pkg_min_price",
            "pkg_desc",
            "pkg_isphotog",
            "pkg_isphotoedt",
            "pkg_isvideog",
            "pkg_isvideogedt",
            "pkg_isamnty",
            "pkg_isamntyedt",
            "ptqr_id",
            "pkg_isavailable",
            "pkg_isvisible",
          ],
          [
            pkg_name,
            pkg_min_price,
            pkg_desc,
            pkg_isphotog,
            pkg_isphotoedt,
            pkg_isvideog,
            pkg_isvideogedt,
            pkg_isamnty,
            pkg_isamntyedt,
            ptqr_id,
            pkg_isavailable,
            pkg_isvisible,
          ]
        );
        if (addPackage !== null) {
          return res
            .status(200)
            .send({ success: true, message: "Package created" });
        } else {
          res.status(400).json({
            success: false,
            message: "Failed creating package",
          });
        }
      }
    } else {
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }

  async updatePackage(req, res) {
    var {
      pkg_id,
      pkg_name,
      pkg_min_price,
      pkg_desc,
      pkg_isphotog,
      pkg_isphotoedt,
      pkg_isvideog,
      pkg_isvideogedt,
      pkg_isamnty,
      pkg_isamntyedt,
      pkg_isavailable,
      pkg_isvisible,
      ptqr_id,
    } = req.body;

    if (
      pkg_id !== null &&
      pkg_name !== null &&
      pkg_min_price !== null &&
      pkg_desc !== null &&
      pkg_isphotog !== null &&
      pkg_isphotoedt !== null &&
      pkg_isvideog !== null &&
      pkg_isvideogedt !== null &&
      pkg_isamnty !== null &&
      pkg_isamntyedt !== null &&
      pkg_isavailable !== null &&
      pkg_isvisible !== null &&
      ptqr_id !== null 
    ) {
      try {
        const check_existing = await get_single_data("package", "pkg_id", pkg_id);

        if (check_existing) {
          const update_package = await update_data(
            "package",
            [
              "pkg_id",
              "pkg_name",
              "pkg_min_price",
              "pkg_desc",
              "pkg_isphotog",
              "pkg_isphotoedt",
              "pkg_isvideog",
              "pkg_isvideogedt",
              "pkg_isamnty",
              "pkg_isamntyedt",
              "pkg_isavailable",
              "pkg_isvisible",
              "ptqr_id",
            ],
            [
              pkg_id,
              pkg_name,
              pkg_min_price,
              pkg_desc,
              pkg_isphotog,
              pkg_isphotoedt,
              pkg_isvideog,
              pkg_isvideogedt,
              pkg_isamnty,
              pkg_isamntyedt,
              pkg_isavailable,
              pkg_isvisible,
              ptqr_id,
            ]
          );
          if (update_package) {
            res.status(200).json({
              success: true,
              message: "Package updated successfully",
            });
          } else {
            res
              .status(400)
              .json({ success: false, message: "Error updating package" });
          }
        } else {
          res
            .status(400)
            .json({ success: false, message: "Package does not exist" });
        }
      } catch (error) {
        console.error("Error updating package", error);
        res
          .status(400)
          .json({ success: false, message: "Error updating package" });
      }
    } else {
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }
  async getPackages(req,res){
    const id = req.params.id;

    if(!id){return res.status(404).send({message:"Missing ID field"})}
    const data = await get_multiple_data("package","ptqr_id",id)
    return res.send(data)

  }
  async deletePackage(req,res){
    const id = req.params.id;
    if(!id){return res.status(404).send({message:"Package ID not found"});}

    const checkExisting = await get_single_data("package","pkg_id",id)
    if(!checkExisting){
      return res.status(404).send({message:"Package not found"})
    }
    const deletePackage = await delete_data("package","pkg_id",id)
    return res.send(deletePackage)
  }

  async getPackage(req,res){
    const id = req.params.id
    if(!id){return res.status(404).send({message:"Missing ID field"})}
    const data = await get_single_data("package","pkg_id",id)
    return res.send(data)
  }

  
  async getMinPrice(req,res){
    const ptqr_id = req.params.ptqr_id;
    if(!ptqr_id){return res.status(404).send({message:"Pitiquer ID not found"})}
    const data = await get_min_price(ptqr_id);
    return res.send(data)
  }
  async getRating(req,res){
    const ptqr_id = req.params.ptqr_id;
    if(!ptqr_id){return res.status(404).send({message:"Pitiquer ID not found"})}
    const data = await getRating(ptqr_id);
    return res.send(data)
  }

  async getTotalUnreadNotifications(req,res) {
    const ptqr_id = req.params.ptqr_id;
    if(!ptqr_id){return res.status(404).send({message:"Pitiquer ID not found"})}
    const data = await get_total_unread_notification("pitiquer_notification",ptqr_id);
    return res.send(data)
  }
  async getAllNotification(req,res) {
    const ptqr_id = req.params.ptqr_id;
    if(!ptqr_id){return res.status(404).send({message:"Pitiquer ID not found"})}
    const data = await get_notifications("pitiquer_notification",ptqr_id);
    return res.send(data)
  }

}



export default new PitiquerController();
