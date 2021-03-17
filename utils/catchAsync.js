module.exports = f => {
    return (req, res, next) => {
        f(req, res, next).catch(next);
    }
}
// take a function then return a function with an error catch if there's an error