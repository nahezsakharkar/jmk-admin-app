
const Logger = (req, res, next) => {
    console.log(`\x1b[34mRequest : \x1b[32m${req.method} \x1b[33m${req.protocol}://${req.get('host')}${req.originalUrl} \x1b[0m`)
    next();
}

module.exports = {Logger}