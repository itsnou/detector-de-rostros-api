const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '8ac4a070129b4a12ba9309639b92d6ac'
});

const handleApiCall = (req,res) => {
    app.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err=> res.stats(400).json('No se logro trabajar con la API'));
}
  

const handleImage = (req,res,db)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=> {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('No se puede encontrar entradas'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
