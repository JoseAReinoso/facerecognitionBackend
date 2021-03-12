const signin = (req, res, db, bcrypt) => {
db.select('email','hash').from('login')
.where('email','=', req.body.email)
.then(data => {
    const isValid = bcrypt.compareSync(req.body.password,data[0].hash)
    if(isValid){
       return db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
            res.status(200).json(user[0])
        })
        .catch(error => res.status(400).json('unable to get user'))
    }else{
        res.status(400).json('wrong credentials')
    }
})
.catch(error => res.status(400).json('wrong credentials'))
}

module.exports = {
    signin
}