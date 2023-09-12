import { insert_data, get_data, get_all_data, update_data } from "../database/database.js"
import { capitalizeWords, generateRandomPassword } from "../utils/util.js"
import { sendEmail } from "../utils/email-sender.js"
class AdminController {
    async createAdmin(req, res) {
        var { email, firstname, middlename, lastname, phone, status } = req.body;

        if (email !== null && firstname !== null && lastname !== null && phone !== null && status !== null) {
            var superadmin = req.body.superadmin
            if (superadmin === 'undefined') superadmin = false
            else superadmin = true

            //capitalize names
            firstname = capitalizeWords(firstname)
            middlename = capitalizeWords(middlename)
            lastname = capitalizeWords(lastname)
            const password = generateRandomPassword()

            const checkExisting = await get_data("admin", "admin_email", email)

            if (checkExisting !== null) {
                res.status(400).json({ success: false, message: 'Account already exists' })
            }
            const addAdmin = await insert_data("admin",
                ["admin_fname", "admin_mname", "admin_lname", "admin_email", "admin_pass", "admin_phone", "admin_issuper", "admin_status"],
                [firstname, middlename, lastname, email, password, phone, superadmin, status]
            )

            if (addAdmin) {
                const sendEm = await sendEmail(email, firstname, password)
                if (sendEm === true) {
                    res.status(200).json({ success: true, message: 'Admin account created' })
                }
            }
            else {
                res.status(400).json({ success: false, message: 'Failed creating admin account' })
            }
        }
        else {
            res.status(400).json({ success: false, message: 'Incomplete fields' })
        }

    }
    async updateAdmin(req, res) {
        var { id, email, firstname, middlename, lastname, phone, status, issuper } = req.body;
        if (id !== null && email !== null && firstname !== null && lastname !== null && phone !== null && status !== null && issuper !== null) {
            try {
                const update_admin = await update_data(
                    "admin",
                    ["admin_id", "admin_fname", "admin_mname", "admin_lname", "admin_email", "admin_phone", "admin_issuper", "admin_status"],
                    [id, firstname, middlename, lastname, email, phone, issuper, status]
                )
                if (update_admin) {
                    res.status(200).json({ success: true, message: "Admin updated" })
                }
            } catch (error) {
                console.error("Error updating admin", error)
                res.status(400).json({ success: false, message: 'Error updating admin' })
            }

        } else {
            res.status(400).json({ success: false, message: 'Incomplete fields' })
        }
    }
    async getAdmin(req, res) {
        const admins = await get_all_data("admin")
        const finalAdmins = admins.map(({ admin_pass, ...rest }) => rest)
        res.status(200).json({ success: true, data: finalAdmins })
    }

    async getSingleAdmin(req, res) {
        const admin_id = req.params.admin_id

        if (admin_id != null) {
            const admin = await get_data("admin", "admin_id", admin_id)
            delete admin.admin_pass
            res.status(200).json({ success: true, data: admin , message:'admin found'})
        }
        else{
            res.status(200).json({ success: false, message:'admin not found' })
        }

       
    }
}

export default new AdminController()