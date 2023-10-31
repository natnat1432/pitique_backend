import {
  insert_data,
  get_single_data,
  get_all_data,
  update_data,
  get_active_data,
  create_pitiquer_notification,
  get_total_unread_notification,
  get_notifications,
} from "../database/database.js";
import { capitalizeWords } from "../utils/util.js";
import { sendEmail } from "../utils/email-sender.js";

class RealtorController {
  async createRealtor(req, res) {
    var { fname, mname, lname, email, pass, phone, birthdate } = req.body;

    if (
      fname !== null &&
      lname !== null &&
      email !== null &&
      pass !== null &&
      phone !== null &&
      birthdate !== null
    ) {
      const status = "active";
      try {
        const check_existing = await get_single_data(
          "realtor",
          "rltr_email",
          email
        );

        if (check_existing) {
          res
            .status(200)
            .json({ success: false, message: "Email already exist" });
        } else {
          const insert_realtor = await insert_data(
            "realtor",
            [
              "rltr_fname",
              "rltr_mname",
              "rltr_lname",
              "rltr_email",
              "rltr_pass",
              "rltr_phone",
              "rltr_birthdate",
              "rltr_status",
            ],
            [fname, mname, lname, email, pass, phone, birthdate, status]
          );

          if (insert_realtor) {
            res
              .status(200)
              .json({
                success: true,
                message: "Realtor account created successfully",
              });
          } else {
            res
              .status(200)
              .json({
                success: false,
                message: "There is a problem in creating realtor account",
              });
          }
        }
      } catch (error) {
        console.error("Error creating realtor account", error);
        res
          .status(400)
          .json({
            success: false,
            message: "There is a problem in creating realtor account",
          });
      }
    } else {
      console.error("Error creating realtor account", error);
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }
  async updateRealtor(req, res) {
    var { id, fname, mname, lname, email, phone, status } = req.body;

    var birthdate = req.body.birthdate;
    console.log(birthdate);
    birthdate = birthdate.split("T")[0];
    birthdate = birthdate.split("-");
    birthdate = `${birthdate[0]}-${birthdate[1]}-${Number(birthdate[2]) + 1}`;
    console.log(birthdate);

    if (
      id !== null &&
      fname !== null &&
      lname !== null &&
      email !== null &&
      phone !== null &&
      birthdate !== null &&
      status !== null
    ) {
      try {
        const check_existing = await get_single_data("realtor", "rltr_id", id);

        if (check_existing) {
          const update_realtor = await update_data(
            "realtor",
            [
              "rltr_id",
              "rltr_fname",
              "rltr_mname",
              "rltr_lname",
              "rltr_email",
              "rltr_phone",
              "rltr_birthdate",
              "rltr_status",
            ],
            [id, fname, mname, lname, email, phone, birthdate, status]
          );

          if (update_realtor) {
            res
              .status(200)
              .json({
                success: true,
                message: "Realtor account updated successfully",
              });
          } else {
            res
              .status(200)
              .json({
                success: false,
                message: "There is a problem in updating realtor account",
              });
          }
        } else {
          res
            .status(200)
            .json({ success: false, message: "Realtor doesn't exist" });
        }
      } catch (error) {
        console.error("Error updating realtor account", error);
        res
          .status(400)
          .json({
            success: false,
            message: "There is a problem in updating realtor account",
          });
      }
    } else {
      console.error("Error updating realtor account", error);
      res.status(400).json({ success: false, message: "Incomplete fields" });
    }
  }

  async getRealtors(req, res) {
    const realtors = await get_all_data("realtor");
    try {
      if (realtors) {
        const finalRealtors = realtors.map(({ rltr_pass, ...rest }) => rest);
        res
          .status(200)
          .json({
            success: true,
            data: finalRealtors,
            message: "Realtors found",
          });
      } else {
        res.status(200).json({ success: false, message: "No realtors data" });
      }
    } catch (error) {
      console.error("Error fetching realtors", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching realtors" });
    }
  }

  async getActiveRealtors(req, res) {
    const realtors = await get_active_data(
      "realtor",
      ["rltr_status", "rltr_status"],
      ["active", "suspended"]
    );
    try {
      if (realtors) {
        const finalRealtors = realtors.map(({ rltr_pass, ...rest }) => rest);
        res
          .status(200)
          .json({
            success: true,
            data: finalRealtors,
            message: "Realtors found",
          });
      } else {
        res.status(200).json({ success: false, message: "No realtors data" });
      }
    } catch (error) {
      console.error("Error fetching realtors", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching realtors" });
    }
  }

  async getSingleRealtor(req, res) {
    try {
      const rltr_id = req.params.rltr_id;
      if (rltr_id != null) {
        const realtor = await get_single_data("realtor", "rltr_id", rltr_id);
        delete realtor.rltr_pass;

        res
          .status(200)
          .json({ success: true, data: realtor, message: "Realtor found" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Realtor does not exist" });
      }
    } catch (error) {
      console.error("Error fetching realtor account", error);
      res
        .status(400)
        .json({ success: false, message: "Error fetching realtor account" });
    }
  }

  async terminateRealtor(req, res) {
    try {
      const { id } = req.body;
      if (id != null) {
        const realtor = await get_single_data("realtor", "rltr_id", id);
        if (realtor) {
          const update_realtor = await update_data(
            "realtor",
            ["rltr_id", "rltr_status"],
            [id, "terminated"]
          );

          if (update_realtor) {
            res
              .status(200)
              .json({
                success: true,
                message: "Realtor terminated successfully",
              });
          } else {
            res
              .status(200)
              .json({
                success: false,
                message: "Realtor cannot be terminated",
              });
          }
        } else {
          res
            .status(200)
            .json({ success: false, message: "Realtor account not found" });
        }
      } else {
        res.status(200).json({ success: false, message: "Missing Realtor ID" });
      }
    } catch (error) {
      console.error("Error terminating realtor account", error);
      res
        .status(400)
        .json({ success: false, message: "Error terminating realtor account" });
    }
  }

  async requestBook(req, res) {
    try {
      const request = await insert_data(
        "booking",
        [
          "pkg_id",
          "rltr_id",
          "ptqr_id",
          "book_status",
          "book_fee",
          "book_share",
          "book_date",
          "book_streetname",
          "book_unitno",
          "book_city",
          "book_province",
          "book_postal",
          "book_propertysize",
          "book_notes",
          "book_firstname",
          "book_lastname",
          "book_email",
          "book_phone",
          "book_company",
        ],
        [
          req.body.pkg_id,
          req.body.rltr_id,
          req.body.ptqr_id,
          req.body.book_status,
          req.body.book_fee,
          req.body.book_share,
          req.body.book_date,
          req.body.book_streetname,
          req.body.book_unitno,
          req.body.book_city,
          req.body.book_province,
          req.body.book_postal,
          req.body.book_propertysize,
          req.body.book_notes,
          req.body.book_firstname,
          req.body.book_lastname,
          req.body.book_email,
          req.body.book_phone,
          req.body.book_company,
        ]
      );
      if (request) {
        const realtor = await get_single_data("realtor","rltr_id", req.body.rltr_id)
        const pkg = await get_single_data("package","pkg_id", req.body.pkg_id)
        const notifyPitiquer = await create_pitiquer_notification(req.body.ptqr_id,`${realtor.rltr_fname} ${realtor.rltr_lname} requested a book on package ${pkg.pkg_name}`)

        return res
          .status(200)
          .json({ success: true, message: "Pitiquer booked successfully" });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Failed to book pitiquer" });
      }
    } catch (error) {
      console.error("Error making a book request", error);
      return res
        .status(400)
        .send({ message: "Error making book request", success: false });
    }
  }

  async getTotalUnreadNotifications(req,res) {
    const rltr_id = req.params.rltr_id;
    if(!rltr_id){return res.status(404).send({message:"Realtor ID not found"})}
    const data = await get_total_unread_notification("realtor_notification",rltr_id);
    return res.send(data)
  }
  async getAllNotification(req,res) {
    const rltr_id = req.params.rltr_id;
    if(!rltr_id){return res.status(404).send({message:"Realtor ID not found"})}
    const data = await get_notifications("realtor_notification",rltr_id);
    return res.send(data)
  }
}

export default new RealtorController();
