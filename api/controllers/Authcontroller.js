import User from "../models/userModel.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const Register = async (req, res) => {
    try {
        const {name, email, password, role, adminCode} = req.body 
        const checkuser = await User.findOne({email})
        if(checkuser){
            // user already registered
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            })
        }

        // Check if trying to register as admin
        if (role === 'admin') {
            if (adminCode !== 'ADMIN') {
                return res.status(400).json({
                    success: false,
                    message: "Invalid admin code"
                });
            }
        }

        const hashedPassword = bcryptjs.hashSync(password)
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            isVerified: true // Set to true by default since we're not using email verification
        })

        await user.save();

        res.status(200).json({
            success: true,
            message: "Registration successful"
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const Logout = async (req, res) => {
    try {
        
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: "logout successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Email verified"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash new password
        const hashedPassword = bcryptjs.hashSync(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all users (excluding admins)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }, '_id name email');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};