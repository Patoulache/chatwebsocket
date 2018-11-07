// Connexion à socket.io

var socket = io.connect('http://localhost:8080');
var containerUsers = document.querySelector("#co_users");
containerUsers.addEventListener("click", listener);
// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre

var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;

// Quand on reçoit un message, on l'insère dans la page

socket.on('message', function(data) {
    insereMessage(data.pseudo, data.message)
})

// Quand un nouveau client se connecte, on affiche l'information

socket.on('nouveau_client', function(pseudo) {
    $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
})

// affichage liste users

socket.on('listUsers', function(coUsers){
    $('#co_users p').remove();
    coUsers.forEach(function(e){
        if (e !== pseudo) {
            $('#co_users').prepend('<p><span>' + e + '</span> est en ligne.</p>');
        }
    })  
})

// Quand un client quitte le chat

socket.on('client_left', function(pseudo) {
    $('#zone_chat').prepend('<p><em>' + pseudo + ' a quitté le Chat !</em></p>');
    $("#co_users p").filter(":contains(" + pseudo + ")").remove();
})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page

$('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    socket.emit('message', message); // Transmet le message aux autres
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Ajoute un message dans la page

function insereMessage(pseudo, message) {
    $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
};

// event lancement chat privé

function listener(evt) {
    var corres = evt.target.innerText;
    if (evt.target == document.querySelector("span")) {
        createDiv(pseudo, corres);        
    }
};

// Création div chat privé

function createDiv(pseudo, corres) {
    var newDiv = document.createElement("div");
    var newInput = document.createElement("input");
    newDiv.id = pseudo.concat('-').concat(corres);
    newDiv.className = "chatprive";
    document.body.appendChild(newDiv);
}