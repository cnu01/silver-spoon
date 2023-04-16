const express = require('express');
const router = express.Router();
const Roles = require('../models/roles')

router.post('/new', async (req, res) => {
    try {
        const isRole = await Roles.find({ name: req.body.name }).lean()

        if (isRole.length !== 0) {
            return res.status(400).json({ message: 'Role is alredy exist' });
        }
        const roles = new Roles({ name: req.body.name });
        await roles.save();
        res.status(201).json({ message: 'Role created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating role', error: err });
    }

})

router.get('/roles', async (req, res) => {
    try {
        const role = await Roles.find({}).lean()
        res.status(200).json(role);
    } catch (err) {
        res.status(400).json({ message: 'Error', error: err });
    }
})


module.exports = router;