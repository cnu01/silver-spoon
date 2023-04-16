'use strict';
const user = require('../routes/users');
const roles = require('../routes/roles')
const transactions = require('../routes/transactions')


module.exports = function (app) {
    app.use('/api/user', user);
    app.use('/api/roles', roles);
    app.use('/api/transactions', transactions);
    
}