const register = (req, res, db, bcrypt) => {

    const {email, name, password} = req.body
const hash = bcrypt.hashSync(password) // hashing the incoming password
db.transaction(trx => { //using transaction to share values between users and login tables
trx.insert({
    hash:hash,
    email:email
})
.into('login')
.returning('email') //here im returning the email as it is what i want to share as foreigh key between login and users
.then(loginEmail => {
    return trx('users')
    .returning('*') //with .returning('*') you will be able to return whole user object on the next .then\
    .insert({
        name:name,
        email:loginEmail[0], //notice how here im passing the email that come sfrom the transaction 
        joined:new Date()
    }).then(user => {
        res.status(200).json(user[0])})
})
.then(trx.commit) //then that commits once transaction is successfully done
.catch(trx.rollback) //catch rollsback changes in which errors are
}) 

}


module.exports = {
    register
}