const express = require('express')
const db = require('./config/db')
const DoctorModel = require('./models/Doctor')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

db.authenticate()
    .then(() => {
        console.log('PostgreSQL connected')
        
    })
    .catch((err) => console.log(err))



const app = express()

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.get('/', (req, res) => {
    DoctorModel.findAll()
        .then(doctors => {
            res.send(JSON.stringify(doctors, null, 4));
    });
});

app.get('/user', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            console.log(err);
            res.sendStatus(500)
        } else {
            DoctorModel.findOne({ where: {email: authData.doctor.email} })
                .then(doctor => {
                    res.send(JSON.stringify(doctor));
                })
                .catch((err) => {
                    console.log(err)
                    res.sendStatus(500)
                })
        }
    });
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.post('/user', (req, res) => {
    bcrypt.hash(req.body.password, 4)
        .then((hash) => {
            DoctorModel.create({ name: req.body.name, email: req.body.email, password: hash, communication: req.body.communication })
                .then((doctor) => {
                    res.send(JSON.stringify(doctor.id));
            });
    });
})

app.post('/login', (req, res) => {
    DoctorModel.findOne({ where: {email: req.body.email} })
        .then(doctor => {
            if (doctor) {
                bcrypt.compare(req.body.password, doctor.password, (err, match) => {
                    if (err) throw err;
                    if(match) {
                        jwt.sign({doctor: {email: doctor.email, password: doctor.password}}, 'secret', (err, token) => {
                            if (err) console.log(err);
                            if (token) res.send(JSON.stringify(token))
                        });
                    } else {
                        res.sendStatus(403);
                    }
                });
            } else {
                res.sendStatus(403);
            }
        })
        .catch((err) => {
            res.sendStatus(403);
        })
})

app.listen(PORT, console.log(`Server running on PORT: ${PORT}`));