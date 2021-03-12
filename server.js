const express = require('express')
const bodyParser =  require('body-parser')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')
require('dotenv').config()



const db = knex({
    client:"pg",
    connection: {
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASS,
        database:process.env.DB_NAME

    }
});
/* to console.log user list from users table that lives in the facerecognition database
db.select('*').from('users').then(data => {
    console.log("Console logging the data from users table inside of facerecognition database",data)
}); */


const app = express()


app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=> {
    res.send("Welcome to my faceRecognition APP!")
})

app.post('/signin', (req, res)=> {
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
})

app.post('/register', (req,res) => {
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
})

app.get('/profile/:id',(req, res) => {
    const {id} = req.params;

    db.select('*').from('users').where("id",id)
    .then( user => {
        if(user.length > 0){
            res.status(200).json(user[0])
        }else{
            res.status(400).json('not found')
        }   
    }).catch(error => res.status(400).json("error getting user"))

})

app.put("/image",(req, res)=> {
    const {id} = req.body;
    //where the id on database enquals id inputted by frontend increment count of entries by 1.
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(error => res.status(400).json('unable to get entries updated'))
})

app.listen(3001, () => {
    console.log('app is running on port' )
})