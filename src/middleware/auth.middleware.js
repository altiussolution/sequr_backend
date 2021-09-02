function authUser(req, res, next){
    if(req.user == null ){
        res.status(403).send('User not found')
    }

    next()
}
module.exports = {
    authUser
}