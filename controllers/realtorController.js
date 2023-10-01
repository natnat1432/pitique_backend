import { insert_data, get_data, get_all_data, update_data, get_active_data } from "../database/database.js"
import { capitalizeWords } from "../utils/util.js"
import { sendEmail } from "../utils/email-sender.js"

class RealtorController{
    async createRealtor(req,res){
        var {
            fname,mname,lname,email,pass,phone,birthdate
        } = req.body

        if(fname !== null && lname !== null && email !== null && pass !== null && phone !== null && birthdate !== null){
            const status = "active"
            try{
                const check_existing = await get_data("realtor","rltr_email", email)

                if(check_existing){
                    res.status(200).json({success:false, message:"Email already exist"})
                }
                else{
                    const insert_realtor = await insert_data(
                        "realtor",
                        ["rltr_fname","rltr_mname","rltr_lname","rltr_email","rltr_pass","rltr_phone","rltr_birthdate","rltr_status"],
                        [fname,mname,lname,email,pass,phone,birthdate,status]
                        )

                    if(insert_realtor){
                        res.status(200).json({success:true,message:'Realtor account created successfully'})
                    }
                    else{
                        res.status(200).json({success:false, message:'There is a problem in creating realtor account'})
                    }
                }

            }catch(error){
                console.error("Error creating realtor account", error)
                res.status(400).json({success:false, message:'There is a problem in creating realtor account'})
            }
        }
        else{
            console.error("Error creating realtor account", error)
            res.status(400).json({success:false, message:'Incomplete fields'})
        }
    }
    async updateRealtor(req,res){
        var {
            id,fname,mname,lname,email,phone,status
        } = req.body

        var birthdate = req.body.birthdate
        console.log(birthdate)
        birthdate = birthdate.split("T")[0]
        birthdate = birthdate.split("-")
        birthdate = `${birthdate[0]}-${birthdate[1]}-${Number(birthdate[2])+1}`
        console.log(birthdate)

        if(id !== null && fname !== null && lname !== null && email !== null  && phone !== null && birthdate !== null && status !== null){
            
            try{
                const check_existing = await get_data("realtor","rltr_id", id)

                if(check_existing){
                    const update_realtor = await update_data(
                        "realtor",
                        ["rltr_id","rltr_fname","rltr_mname","rltr_lname","rltr_email","rltr_phone","rltr_birthdate","rltr_status"],
                        [id,fname,mname,lname,email,phone,birthdate,status]
                        )

                    if(update_realtor){
                        res.status(200).json({success:true,message:'Realtor account updated successfully'})
                    }
                    else{
                        res.status(200).json({success:false, message:'There is a problem in updating realtor account'})
                    }
                }
                else{
                    res.status(200).json({success:false, message:"Realtor doesn't exist"})
                }

            }catch(error){
                console.error("Error updating realtor account", error)
                res.status(400).json({success:false, message:'There is a problem in updating realtor account'})
            }
        }
        else{
            console.error("Error updating realtor account", error)
            res.status(400).json({success:false, message:'Incomplete fields'})
        }
    }


    async getRealtors(req, res) {
        const realtors = await get_all_data("realtor")
        try {
            if (realtors) {
                const finalRealtors = realtors.map(({ rltr_pass, ...rest }) => rest)
                res.status(200).json({ success: true, data: finalRealtors, message: 'Realtors found' })
            }
            else {
                res.status(200).json({ success: false, message: 'No realtors data' })
            }
        }
        catch (error) {
            console.error("Error fetching realtors", error)
            res.status(400).json({ success: false, message: 'Error fetching realtors' })
        }


    }

    async getActiveRealtors(req, res) {
        const realtors = await get_active_data("realtor",["rltr_status","rltr_status"],["active", "suspended"])
        try {
            if (realtors) {
                const finalRealtors = realtors.map(({ rltr_pass, ...rest }) => rest)
                res.status(200).json({ success: true, data: finalRealtors, message: 'Realtors found' })
            }
            else {
                res.status(200).json({ success: false, message: 'No realtors data' })
            }
        }
        catch (error) {
            console.error("Error fetching realtors", error)
            res.status(400).json({ success: false, message: 'Error fetching realtors' })
        }


    }

    async getSingleRealtor(req, res) {
        try {
            const rltr_id = req.params.rltr_id
            if (rltr_id != null) {
                const realtor = await get_data("realtor", "rltr_id", rltr_id)
                delete realtor.rltr_pass

                res.status(200).json({ success: true, data: realtor, message: 'Realtor found' })
            }
            else {
                res.status(200).json({ success: false,  message: 'Realtor does not exist' })
            }

        } catch (error) {
            console.error("Error fetching realtor account", error)
            res.status(400).json({ success: false, message: 'Error fetching realtor account' })
        }
    }

    async terminateRealtor(req,res){
        try{

            const {id} = req.body
            if(id != null){ 
                const realtor = await get_data("realtor","rltr_id", id)
                if(realtor){
                    const update_realtor = await update_data("realtor",["rltr_id","rltr_status"],[id,"terminated"])

                    if(update_realtor){
                        res.status(200).json({success:true, message:"Realtor terminated successfully"})

                    }
                    else{
                        res.status(200).json({success:false, message:'Realtor cannot be terminated'})    
                    }
                }   
                else{
                    res.status(200).json({success:false, message:'Realtor account not found'})    
                }
            }   
            else{
                res.status(200).json({success:false, message:'Missing Realtor ID'})
            }

        }catch(error){
            console.error("Error terminating realtor account", error)
            res.status(400).json({success:false,message:'Error terminating realtor account'})
        }
    }

}

export default new RealtorController()