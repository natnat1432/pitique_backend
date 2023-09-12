import { insert_data, get_data, get_all_data, update_data, get_data_conditions, get_active_data} from "../database/database.js"
import { capitalizeWords, generateRandomPassword } from "../utils/util.js"
import { sendEmail } from "../utils/email-sender.js"

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
            status
        } = req.body;
        if (email !== null &&
            firstname !== null &&
            lastname !== null &&
            phone !== null &&
            status !== null &&
            city !== null &&
            province !== null
        ) {

            var isphotog = req.body.isphotog
            var isphotogedt = req.body.isphotogedt
            var isvideog = req.body.isvideog
            var isvideogedt = req.body.isvideogedt
            var isamnty = req.body.isamnty
            var isamntyedt = req.body.isamntyedt

            if (isphotog === 'undefined') isphotog = false; else isphotog = true
            if (isphotogedt === 'undefined') isphotogedt = false; else isphotogedt = true
            if (isvideog === 'undefined') isvideog = false; else isvideog = true
            if (isvideogedt === 'undefined') isvideogedt = false; else isvideogedt = true
            if (isamnty === 'undefined') isamnty = false; else isamnty = true
            if (isamntyedt === 'undefined') isamntyedt = false; else isamntyedt = true
            //capitalize names
            firstname = capitalizeWords(firstname)
            middlename = capitalizeWords(middlename)
            lastname = capitalizeWords(lastname)
            const password = generateRandomPassword()

            const checkExisting = await get_data("pitiquer", "ptqr_email", email)

            if (checkExisting !== null) {
                res.status(200).json({ success: false, message: 'Pitiquer account already exists' })
            }
            else {


                const addPitiquer = await insert_data("pitiquer",
                    ["ptqr_fname", "ptqr_mname", "ptqr_lname", "ptqr_email", "ptqr_pass", "ptqr_phone", "ptqr_city", "ptqr_province",
                        "ptqr_isphotog", "ptqr_isphotogedt", "ptqr_isvideog", "ptqr_isvideogedt", "ptqr_isamnty", "ptqr_isamntyedt", "ptqr_status"],
                    [firstname, middlename, lastname, email, password, phone, city, province, isphotog, isphotogedt, isvideog, isvideogedt, isamnty, isamntyedt, status]
                )

                if (addPitiquer) {
                    const sendEm = await sendEmail(email, firstname, password)
                    if (sendEm === true) {
                        res.status(200).json({ success: true, message: 'Pitiquer account created' })
                    }
                }
                else {
                    res.status(400).json({ success: false, message: 'Failed creating pitiquer account' })
                }
            }
        }
        else {
            res.status(400).json({ success: false, message: 'Incomplete fields' })
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
        } = req.body

        if (id !== null && email !== null && firstname !== null && lastname !== null &&
            phone !== null && city !== null && province !== null && isphotog !== null &&
            isphotogedt !== null && isvideog !== null && isvideogedt !== null && isamnty !== null &&
            isamntyedt !== null && status !== null
        ) {
            try {
                const check_existing = await get_data("pitiquer", "ptqr_id", id)

                if (check_existing) {
                    const update_pitiquer = await update_data(
                        "pitiquer",
                        ["ptqr_id", "ptqr_fname", "ptqr_mname", "ptqr_lname", "ptqr_email", "ptqr_phone", "ptqr_city", "ptqr_province", "ptqr_bio", "ptqr_isphotog", "ptqr_isphotogedt", "ptqr_isvideog", "ptqr_isvideogedt", "ptqr_isamnty", "ptqr_isamntyedt", "ptqr_status"],
                        [id, firstname, middlename, lastname, email, phone, city, province, bio, isphotog, isphotogedt, isvideog, isvideogedt, isamnty, isamntyedt, status]
                    )
                    if (update_pitiquer) {
                        res.status(200).json({ success: true, message: 'Pitiquer updated successfully' })
                    }
                    else {
                        res.status(200).json({ success: false, message: 'Error updating pitiquer' })
                    }
                }
                else {
                    res.status(200).json({ success: false, message: "Pitiquer does not exist" })
                }
            } catch (error) {
                console.error("Error updating pitiquer", error)
                res.status(400).json({ success: false, message: 'Error updating pitiquer' })
            }
        }
        else {
            res.status(400).json({ success: false, message: 'Incomplete fields' })
        }
    }

    async getAllPitiquer(req, res) {
        const pitiquers = await get_data("pitiquer")
        try {
            if (pitiquers) {
                const finalPitiquers = pitiquers.map(({ ptqr_pass, ...rest }) => rest)
                res.status(200).json({ success: true, data: finalPitiquers, message: 'Pitiquers found' })
            }
            else {
                res.status(200).json({ success: false, message: 'No pitiquers data' })
            }
        }
        catch (error) {
            console.error("Error fetching pitiquers", error)
            res.status(400).json({ success: false, message: 'Error fetching pitiquers' })
        }


    }

    async getActivePitiquers(req,res){
        const pitiquers = await get_active_data("pitiquer",["ptqr_status", "ptqr_status"], ["active", "suspended"])
        try {
            if (pitiquers) {
                const finalPitiquers = pitiquers.map(({ ptqr_pass, ...rest }) => rest)
                res.status(200).json({ success: true, data: finalPitiquers, message: 'Pitiquers found' })
            }
            else {
                res.status(200).json({ success: false, message: 'No pitiquers data' })
            }
        }
        catch (error) {
            console.error("Error fetching pitiquers", error)
            res.status(400).json({ success: false, message: 'Error fetching pitiquers' })
        }

    }


    async getSinglePitiquer(req, res) {

        try {
            const ptqr_id = req.params.ptqr_id

            if (ptqr_id != null) {
                const pitiquer = await get_data("pitiquer", "ptqr_id", ptqr_id)
                const finalPitiquer = pitiquer.map(({ ptqr_pass, ...rest }) => rest)
                res.status(200).json({ success: true, data: finalPitiquer, message: 'Pitiquer found' })
            }
            else {
                res.status(200).json({ success: false, data: finalPitiquer, message: 'Missing Pitiquer ID' })
            }


        } catch (error) {
            console.error("Error fetching pitiquer account", error)
            res.status(400).json({ success: false, message: 'Error fetching pitiquer account' })
        }

    }

    async terminatePitiquer(req,res){
        try{

            const {id} = req.body
            if(id != null){ 
                const pitiquer = await get_data("pitiquer","ptqr_id", id)
                if(pitiquer){
                    const update_pitiquer = await update_data("pitiquer",["ptqr_id","ptqr_status"],[id,"terminated"])

                    if(update_pitiquer){
                        res.status(200).json({success:true, message:"Pitiquer terminated successfully"})

                    }
                    else{
                        res.status(200).json({success:false, message:'Pitiquer cannot be terminated'})    
                    }
                }   
                else{
                    res.status(200).json({success:false, message:'Pitiquer account not found'})    
                }
            }   
            else{
                res.status(200).json({success:false, message:'Missing Pitiquer ID'})
            }

        }catch(error){
            console.error("Error terminating pitiquer account", error)
            res.status(400).json({success:false,message:'Error terminating pitiquer account'})
        }
    }
}

export default new PitiquerController()