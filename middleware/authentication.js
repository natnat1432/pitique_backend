import express from "express"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { get_single_data, get_single_data_conditions, insert_data, update_data } from '../database/database.js'

const routes = express.Router();
dotenv.config()
import { DateTime } from 'luxon';


routes.post("/token", async (req, res) => {
    const refreshToken = req.body.refreshToken
    const checkToken = await get_single_data('tokens', 'refreshToken', refreshToken)
    if (refreshToken === null) return res.status(401).json({ success: false, valid: false, message: 'No token included' })
    if (!checkToken || checkToken.status === 'expired') return res.status(403).json({ success: false, valid: false, message: 'Token not found' })

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, valid: false, message: 'Token invalid' })
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ success: true, valid: true, accessToken: accessToken })
    })
})

routes.post("/token/validate", async (req, res) => {
    const accessToken = req.body.accessToken
    if (accessToken === null) return res.status(401).json({ valid: false })
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ valid: false })
        else return res.status(202).json({ valid: true })
    })
})

routes.post("/login", async (req, res) => {
    const { user_type, email, password } = req.body
    var u_type = ''
    if (user_type !== null && email !== null && password !== null) {


        if (user_type === 'admin' || user_type === 'pitiquer' || user_type === 'realtor') {

            if (user_type === 'admin' && email === 'pitique@superadmin' && password === 'pitique@2023') {
                u_type = 'admin'
                const user = { name: email }
                const accessToken = generateAccessToken(user)
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                let now = DateTime.now().setZone('Asia/Manila');
                now = now.toFormat('yyyy-MM-dd HH:mm:ss');
                const insert_token = await insert_data('tokens', ['refreshToken', 'user_type', 'created_at', 'status'], [refreshToken, user_type, now, 'active'])
                res.json({
                    success: true, accessToken: accessToken, refreshToken: refreshToken, id: 'superadmin01', email: email,
                    fname: 'superadmin01', mname: '', lname: 'superadmin01', user_type: 'admin'
                })
            }
            else {
                var utype_acronym = ''
                if (user_type === 'admin') { utype_acronym = 'admin' }
                if (user_type === 'realtor') { utype_acronym = 'rltr' }
                if (user_type === 'pitiquer') { utype_acronym = 'ptqr' }

                const checkUser = await get_single_data_conditions(user_type, [`${utype_acronym}_email`, `${utype_acronym}_pass`, `${utype_acronym}_status`], [email, password, "active"])
                if (checkUser) {
                    const user = { name: email }
                    const accessToken = generateAccessToken(user)
                    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                    let now = DateTime.now().setZone('Asia/Manila');
                    now = now.toFormat('yyyy-MM-dd HH:mm:ss');
                    if (user_type === 'admin') {
                        const insert_token = await insert_data('tokens', ['refreshToken', 'user_type', 'admin_id', 'created_at', 'status'], [refreshToken, user_type, checkUser.admin_id, now, 'active'])
                        res.status(200).json({
                            success: true, message:'admin found', accessToken: accessToken, refreshToken: refreshToken, id: checkUser.admin_id, email: checkUser.admin_email,
                            fname: checkUser.admin_fname, mname: checkUser.admin_mname, lname: checkUser.admin_lname, user_type: 'admin'
                        })
                    }
                    if (user_type === 'pitiquer') {
                        const insert_token = await insert_data('tokens', ['refreshToken', 'user_type', 'ptqr_id', 'created_at', 'status'], [refreshToken, user_type, checkUser.ptqr_id, now, 'active'])
                        res.status(200).json({
                            success: true, message:'pitiquer found',accessToken: accessToken, refreshToken: refreshToken, id: checkUser.ptqr_id, email: checkUser.ptqr_email,
                            fname: checkUser.ptqr_fname, mname: checkUser.ptqr_mname, lname: checkUser.ptqr_lname, user_type: 'pitiquer'
                        })
                    }
                    if (user_type === 'realtor') {
                        const insert_token = await insert_data('tokens', ['refreshToken', 'user_type', 'rltr_id', 'created_at', 'status'], [refreshToken, user_type, checkUser.rltr_id, now, 'active'])
                        res.status(200).json({
                            success: true, message:'realtor found', accessToken: accessToken, refreshToken: refreshToken, id: checkUser.rltr_id, email: checkUser.rltr_email,
                            fname: checkUser.rltr_fname, mname: checkUser.rltr_mname, lname: checkUser.rltr_lname, user_type: 'realtor'
                        })
                    }

                }
                else {
                    res.status(200).json({ success: false, message: 'User doesnt exist', user_type:user_type })
                }
            }
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user type' })
        }
    }
    else {
        res.status(400).json({ success: false, message: 'Incomplete fields' })
    }
})

routes.delete('/logout', async (req, res) => {
    const refreshToken = req.headers['token']
    const checkToken = await get_single_data('tokens', 'refreshToken', refreshToken)
    let now = DateTime.now().setZone('Asia/Manila')
    now = now.toFormat('yyyy-MM-dd HH:mm:ss')
    if (checkToken) {
        const update_token = await update_data('tokens', ['token_id', 'expired_at', 'status'], [checkToken.token_id, now, 'expired'])
        res.status(204).json({ success: true, message: 'Log out success' })
    }
    else {
        res.status(400).json({ success: false, message: 'Refresh token not found' })
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
export async function authenticateToken(req, res, next) {
    // Bearer TOKEN
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
export default routes