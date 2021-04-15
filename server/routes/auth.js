const router = require('express').Router();
const User = require('../models/user');
const verifyToken = require('../middlewares/verify-token');
const jwt = require('jsonwebtoken');

/* Signup route */
router.post('/auth/signup', async (req, res) => {
    if(!req.body.email || !req.body.password){
        res.json({
            success: false,
            message: "Please enter correct email and password"
        })
    }
    else{
        try{
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            await newUser.save();
            let token = jwt.sign(newUser.toJSON(), process.env.SECRET, {
                expiresIn: 604800   // 1week
            });
            res.json({
                success: true,
                token: token,
                message: "Signup Successful"
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                message: e.message
            })
        }
    }
});

/* user Profile */
router.get('/auth/user', verifyToken, async (req, res) => {
    try{
        let user = await User.findOne({ _id: req.decoded._id });
        if(user) {
            res.json({
                success: true,
                user: user
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
})

/* Login */
router.post("/auth/login", async (req, res) => {
    try{
        let user = await User.findOne({ email: req.body.email });
        if(!user)
        {
            res.json({
                success: false,
                message: "Authentication failed, User not found!!!"
            })
        } else {
            if(user.comparePassword(req.body.password)) {
                let token = jwt.sign(user.toJSON(), process.env.SECRET, {
                    expiresIn: 604800   // 1week
                });
                res.json({
                    success: true,
                    token: token
                });
            } else {
                res.json({
                    success: false,
                    message: "Authentication failed, Invalid password!!"
                })
            }
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
})

module.exports = router;
