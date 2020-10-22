const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors= require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'itsnou',
        password: 'elemivl900',
        database: 'smart-brain'
    }
});


const app= express();
app.use(bodyParser.json());
app.use(cors());

const database={
    users:[
        {
            id:'123',
            name: 'jhon',
            email: 'jhon@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name: 'aaaa',
            email: 'aaaa@gmail.com',
            password: 'aaaa',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res)=>{
    res.send(database.users);
})

app.post('/signin', (req,res)=>{
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json (database.users [0]);
        }else
        {
            res.status(404).json('error logging in');
        }
})

app.post('/register', (req,res)=>{
    const {email,name, password} =req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
            .then(user =>{
                res.json(user[0])
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