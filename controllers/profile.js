const profile = (req, res,db) => {
    
const {id} = req.params;

db.select('*').from('users').where("id",id)
.then( user => {
    if(user.length > 0){
        res.status(200).json(user[0])
    }else{
        res.status(400).json('not found')
    }   
}).catch(error => res.status(400).json("error getting user"))

}

module.exports = {
    profile
}
