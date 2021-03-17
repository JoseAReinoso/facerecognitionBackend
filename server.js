const express = require('express')
const bodyParser =  require('body-parser')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')
require('dotenv').config()
const signin = require('./controllers/signin')
const register = require('./controllers/register')
const image = require('./controllers/image')
const profile = require('./controllers/profile')


//if connecting to my heroku posgres databse
const db = knex({
    client:"pg",
    connection: {
        connectionString:process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }

    }
});
/* if connecting to the development database on my pc
const db = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});
});

*/



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

app.post('/signin', (req, res)=> {signin.signin(req, res, db,bcrypt)})

app.post('/register', (req,res) => {register.register(req,res,db, bcrypt)})

app.get('/profile/:id',(req, res) => {profile.profile(req, res,db)})

app.put("/image",(req, res)=> {image.image(req, res,db)})
app.post("/imageAPIcall",(req, res)=> {image.imageAPIcall(req, res)})

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}` )
})