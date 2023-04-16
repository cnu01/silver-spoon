const isAdmin = (req, res, next) => {
    console.log(req.session)
    if (req.session.user && req.session.user.role.name === "Admin") {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role.name === "User") {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};
module.exports = {isAdmin,isUser};