import express from 'express'
import { Login, Logout, Register, forgotPassword, resetPassword, getAllUsers } from '../controllers/Authcontroller.js'

const AuthRoute = express.Router()

AuthRoute.post('/register', Register)
AuthRoute.post('/login', Login)
AuthRoute.get('/logout', Logout)
AuthRoute.post('/forgot-password', forgotPassword)
AuthRoute.post('/reset-password', resetPassword)
AuthRoute.get('/users', getAllUsers)

export default AuthRoute; 