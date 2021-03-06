var mysql= require("mysql");
var express= require("express");
var session= require("express-session");
var bodyParser= require("body-parser");
var path= require("path");

var connection= mysql.createConnection({ //crear conexion con mysql
    host: 'localhost',
    database: 'nodelogin',
    user: 'root',
    password: ''
})

var app= express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/',function(resquest,response){
    response.sendFile(path.join(__dirname+'/login.html'));
});

app.post('/auth', function(request,response){
    var username= request.body.username;
    var password= request.body.password;

    if(username && password){
        connection.query('SELECT * FROM accounts WHERE username= ? AND password= ?',[username,password],function(error,result,fields){
            if(result.length>0){
                request.session.loggedin= true;
                request.session.username= username;
                request.session.facultad= 'Telematica';

                response.redirect('/home');
            }else{
                response.send('Usuario y password incorrectos');
            }
            response.end();
        });
    }else{
        response.send('Ingresa user y password');
        response.end();
    }
});

app.get('/home',function(request,response){
    if(request.session.loggedin){
        response.send('Bienvenido: <b>'+request.session.username+'</b> alumno de: '+request.session.facultad+'<br><br> <a href="/logout">Cerrar sesion</a>')
    }else{
        response.send('Iniciar sesion de nuevo, gracias');
    }
});

app.get('/logout', function(request,response){
    request.session.destroy();
    response.redirect('/');
});
app.listen(3000, function(){
    console.log("Escuchando en el puerto 3000");
});
