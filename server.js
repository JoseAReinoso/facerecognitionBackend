const express = require('express')
const bodyParser =  require('body-parser')
const cors = require('cors')



const app = express()


app.use(bodyParser.json())
app.use(cors())

const database = {
    users: [
        {
            id:'123',
            name:'Jose',
            email:'jose@gmail.com',
            password:'mets',
            entries:0, //to keep track on how many photos have been submitted
            joined: new Date()
        },
        {
            id:'124',
            name:'ramon',
            email:'ramon@gmail.com',
            password:'phillies',
            entries:0, //to keep track on how many photos have been submitted
            joined: new Date()
        }
    ]
}


app.get('/',(req,res)=> {
    res.send(database['users'])
})

app.post('/signin', (req, res)=> {
      if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
          res.json('Success')
      }else{
          res.status(400).json('error loggin in')
      }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body
    database.users.push(  {
        id:'125',
        name:name,
        email:email,
        password:password,
        entries:0, //to keep track on how many photos have been submitted
        joined: new Date()
    },)
    res.json(database.users[database.users.length -1])
})

app.get('/profile/:id',(req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(users => {
        if (users.id === id) {
            found = true
            return res.json(users)
        }
    })
    if (!found){
        res.status(400).json('User not found!')
    }
})

app.put("/image",(req, res)=> {
    const {id} = req.body;
    let found = false;
    database.users.forEach(users => {
        if (users.id === id) {
            found = true
            users.entries ++
            return res.json(users.entries)
        }
    })
    if (!found){
        res.status(400).json('User not found!')
    }

})

app.listen(3001, () => {
    console.log('app is running on port' )
})