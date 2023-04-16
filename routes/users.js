const express = require('express');
const router = express.Router();
const User = require('../models/users')
const bcrypt = require('bcrypt')
const { isAdmin } = require("../middleware/auth")
const nodemailer = require('nodemailer');
const emailService = require('../services/email.service');
const crypto = require('crypto');


router.post('/register', isAdmin, async (req, res) => {
    console.log("hit")
    const { email, name, mobile, role } = req.body;

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ message: 'User Already Exist' });
    }
    try {

        const oneTimePassword = crypto.randomBytes(20).toString('hex');
        const oneTimePasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
        try {
            const user = new User({ email, name, mobile, role, oneTimePassword, oneTimePasswordExpires });
            await user.save();
            req.session.user = user;
        } catch (err) {
            console.log(err)
        }

        const link = `http://localhost:5004/api/user/reset-password?email=${req.body.email}&token=${oneTimePassword}`;
        const subject = 'Reset Password';
        const text = `Click <a href="${link}">here</a> to set your new password.`
        const html = `Click <a href="${link}">here</a> to set your new password.`

        await emailService.sendEmail("vallalasinivas02@gmail.com", subject, html, text);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        let date = Date.now()
        const user = await User.find({ email: req.query.email, oneTimePassword: req.query.token, oneTimePasswordExpires: { $gte: date } });
        console.log(user)
        if (user.length === 0) {
            res.status(400).send('Invalid or expired one-time password');
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        await User.findByIdAndUpdate(user[0]._id, { $set: { password: hashedPassword, oneTimePassword: null, oneTimePasswordExpires: null } })
        res.status(200).send('Password reset successfully');
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password: { $exists: true }  })
            .populate('role', 'name');

        if (user) {

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                req.session.user = user;
                res.status(200).json({ message: 'Login successful', session: req.session });
            } else {
                res.status(401).json({ message: 'Invalid login credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid login credentials' });
        }
    } catch (err) {
        res.status(400).json({ message: 'Error logging in', error: err });
    }
});


router.post('/logout', (req, res) => {

    req.session.destroy(err => {
        if (err) {
            res.status(400).json({ message: 'Error logging out', error: err });
        } else {
            res.status(200).json({ message: 'Logout successful' });
        }
    });
});



module.exports = router;