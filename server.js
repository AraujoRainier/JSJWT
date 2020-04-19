const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const jwtSecret = 'Mysecretoussecretofthehidden';
const bodyParser = require('body-parser');
const credentials = {
    user: 'rainier',
    password: '12345678'
};
const payload = {
    nombre: "Rainier"
}

server.listen(3000,function(){
    console.log("Servidor iniciado");
});

server.use(express.json());

function validateCredentials(user, password){
    console.log(user, password);
    if(user === credentials.user && password === credentials.password)
    {
        return true;
    }
    return false;
}

function JWTMiddleware(req,res,next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token,jwtSecret);
        if(verifyToken){
            req.nombre = verifyToken;
            return next();
        }
    } catch (e) {
        res.status(401).json({error:'Invalid JWT authentication'});
    }
}

server.post('/login',function(req,res){
    let {user,password} = req.body;
    if(!validateCredentials(user,password)){
        res.status(401).json({error:'Invalid user or password'});
        res.statusCode
    }
    else{
        const token = {
            token: jwt.sign(payload,jwtSecret)
        }
        res.json(token);
    }
});

server.get('/userinfo',JWTMiddleware,function(req,res){
    res.json(req.nombre);
});