const handleId = (req,res,db)=>{
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user=>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('No se encontro')
        }
    })
    .catch(err=> res.status(400).json('Error'))
}

module.exports = {
    handleId: handleId
}