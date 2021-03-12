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
    image
}