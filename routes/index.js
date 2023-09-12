
import adminRoutes from './adminRoutes.js'
import pitiquerRoutes from './pitiquerRoutes.js'
import realtorRoutes from './realtorRoutes.js'
import authentication from '../middleware/authentication.js'
import express from "express"
import cors from "cors"
const app = express()


app.use(express.json()); 
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:8100'],
}));
app.use(express.static('public'));

//Admin Route
app.use('/admin', adminRoutes)
//Pitiquer Route
app.use('/pitiquer',pitiquerRoutes)
//Realtor Route
app.use('/realtor',realtorRoutes)
//Authentication Route
app.use('/auth', authentication)


export default app
