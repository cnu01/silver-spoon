const express = require('express');
const router = express.Router();
const Transactions = require('../models/transactions')
const { isUser } = require("../middleware/auth")

router.post('/newTransaction', isUser, async (req, res) => {
    try {
        const transactionId = Math.random().toString(36).substring(2, 36);
        const trans = new Transactions({ name: req.body.name, accountNo: req.body.accountNo, user: req.session.user._id, transactionId });
        await trans.save();
        res.status(201).json({ message: 'Transaction created successfully' });

    } catch (err) {
        res.status(400).json({ message: 'Error creating transaction', error: err });
    }
})


router.get('/viewTransData', async (req, res) => {
    let query = {}
    if (req.session.user.role.name === "User") {
        query.user = req.session.user._id
    }
    try {
        const transactions = await Transactions.find({ ...query }).lean()
        res.status(200).json(transactions);
    } catch (err) {
        res.status(400).json({ message: 'Error', error: err });
    }
})

router.put('/UpdateTransaction/:id', async (req, res) => {
    const transaction = await Transactions.findById(req.params.id);
    if (req.session.user.role.name === "User" || req.session.user.role.name === "Power User") {
        if (req.session.user.role.name === "User") {
            if (transaction.user.toString() !== req.session.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            try {
                const response = await Transactions.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                return res.status(201).json({ message: "updated successfully " })
            } catch (error) {
                return res.status(400).json({ message: 'Error Updating Transaction', error: error });
            }
        } else {
            try {
                const response = await Transactions.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                return res.status(201).json({ message: "updated successfully " })
            } catch (error) {
                return res.status(400).json({ message: 'Error Updating Transaction', error: error });
            }
        }
    }
    return res.status(400).json({ message: 'Error' });
})

router.delete('/remove/:id', async (req, res) => {
    const transaction = await Transactions.findById(req.params.id);
    if (req.session.user.role.name === "User" || req.session.user.role.name === "Power User") {
        if (req.session.user.role.name === "User") {
            if (transaction.user.toString() !== req.session.user._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized' });
        }
        try {    
            const response = await Transactions.findByIdAndRemove(req.params.id)
            return res.status(201).json({ message: "Removed successfully " })
        } catch (error) {
            return res.status(400).json({ message: 'Error getting while Transaction', error: error });
        }
        }else{
            try {
                const response = await Transactions.findByIdAndRemove(req.params.id)
                return res.status(201).json({ message: "Removed successfully " })
            } catch (error) {
                return res.status(400).json({ message: 'Error getting while Transaction', error: error });
            }
        }
    }
    return res.status(400).json({ message: 'Error' });


});


module.exports = router;