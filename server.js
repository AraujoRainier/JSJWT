const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const jwtSecret = 'Mysecretoussecretofthehidden';
const usersList = [
    {
        user: 'rainier',
        password: '123456',
        email: 'Rainier@gmail.com',
        admin: true
    },
    {
        user: 'jose',
        password: 'password',
        email: 'jose@gmail.com',
        admin: false
    }
];

server.listen(3000,function(){
    console.log("Servidor iniciado");
});

server.use(express.json());

function validateCredentials(user, password){
    let index = usersList.findIndex(function(userData){
        return userData.user == user;
    });

    if(index!=-1){
        if(user === usersList[index].user && password === usersList[index].password)
        {
            return true;
        }
    }
    return false;
}

function JWTMiddleware(req,res,next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token,jwtSecret);
        if(verifyToken){
            req.userData = verifyToken;
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
        let userData = usersList.filter(function(userData){
            return userData.user == user;
        });
        const token = {
            token: jwt.sign(userData[0],jwtSecret)
        }
        res.json(token);
    }
});

server.post('/register',function(req,res){
    let newUser = req.body.user;
    let newEmail =  req.body.email;
    let newPassword = req.body.password;
    let newUserData = {
        user: newUser,
        email: newEmail,
        password: newPassword,
        admin: false
    }
    usersList.push(newUserData);
    res.status(200).send("register successfull");
});

server.get('/users',JWTMiddleware,function(req,res){
    if(req.userData.admin){
        res.status(200).json(usersList);
    }
    res.status(403).send("You are not allowed to see this data");
});