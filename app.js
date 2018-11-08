var express = require('express'),

    app = express(),

    server = require('http').createServer(app),

    path = require('path'),

    io = require('socket.io').listen(server),

    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

    coUsers = {};
    


// Chargement de la page index.html et me permet d'utiliser le js en externe de l'html

app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function (socket) {

    // io.on('connection', function(socket){
    // }); 
    // pas utile pour l'instant
    
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    
    socket.on('nouveau_client', function(pseudo) {
        
        pseudo = ent.encode(pseudo);        
        socket.pseudo = pseudo;       
        socket.broadcast.emit('nouveau_client', pseudo); // envoie nouveau connecté
        console.log(socket.pseudo + ' connected');
        coUsers[socket.pseudo] = socket.pseudo;
        io.emit('listUsers', Object.values(coUsers)); // envoie liste user connectés
        
    });
    
    // envoie du pseudo de la personne quittant le chat pour notifier tout le monde
    
    socket.on('disconnect', function(){
    
        console.log(socket.pseudo + ' disconnected');
        socket.broadcast.emit('client_left', socket.pseudo);
        delete coUsers[socket.pseudo]; 
    
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes

    socket.on('message', function (message) {

        message = ent.encode(message);

        io.emit('message', {pseudo: socket.pseudo, message: message});

    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on letransmet aux autres personnes
    socket.on('privMess', function (message, corres) {
        console.log(message);
        console.log(corres);        
        message = ent.encode(message);
        socket.to(corres).emit('privMess', {pseudo: socket.pseudo, message: message, corres: corres});
        socket.emit('privMess', {pseudo: socket.pseudo, message: message, corres: corres});

    });

});


server.listen(8080);