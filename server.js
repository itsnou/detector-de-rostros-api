const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors= require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'user',
        password: 'password',
        database: 'smart-brain'
    }
});


const app= express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send('ok');
})

app.post('/signin', (req,res)=>{
    db.select('email','hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid= bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
            return db.select('*').from('users').where('email', '=', req.body.email)
            .then(user=>{
                res.json(user)
            })
            .catch(err=> res.status(400).json('no se puede traer al usuario'))
        }else {
            res.status(400).json('contraseña equivocada')
        }
    })
    .catch(err => res.status(400).json('contraseña equivocada'))
})

app.post('/register', (req,res)=>{
    const {email,name, password} = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx =>{
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user =>{
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err=> res.status(400).json('No se puede registrar'))
})

app.get('/profile/:id', (req,res)=>{
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
})

app.put('/image', (req,res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=> {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('No se puede encontrar entradas'))
})

app.listen(3000,()=>{
    console.log('funciona')
})