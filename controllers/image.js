const Clarifai = require('clarifai') ;
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_KEY
   });

const imageAPIcall =(req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
    .then(data => res.status(200).json(data))
    .catch( error => res.status(400).json("from clarifai API", error))
}   


const image = (req,res, db) => {
    const {id} = req.body;
    //where the id on database enquals id inputted by frontend increment count of entries by 1.
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(error => res.status(400).json('unable to get entries updated'))
}

module.exports = {
    image,
    imageAPIcall
}