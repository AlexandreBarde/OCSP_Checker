// Variable qui contiendra l'adresse du dernier
// serveur consulté
var prec_serv;

// Recupere l'adresse d'un serveur depuis une url
function getServerAdress(url) {
    // Cree un lien
    var parser = document.createElement('a');
    // Lui associe l'url
    parser.href = url;
    // Recupere le nom de l'hôte
    return parser.hostname;
}

// Envoie un message à l'application native
// et gere la réponse avec la fonction en
// parametre
function sendMessage(msg) {
    chrome.runtime.sendNativeMessage('com.ptut.date_getter',
        {url: msg},
        function (resp) {
            // Afficher le réponse
            console.log(resp.text);
        })
}

// Executer à chaque changement dans l'onglet courant
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    // Attendre que la page ai fini de charger
    if (changeInfo.status === 'complete') {
        // Recuperer l'url de l'onglet courant
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            // Si ce n'est pas le premier site qu'on consulte
            var url = tabs[0].url;
            // Recuperer le nom d'hôte du serveur
            var hostname = getServerAdress(url);
            // Si c'est pas le premier site qu'on consulte
            if (typeof prec_serv !== 'undefined') {
                // Verifier qu'on ne soit pas toujour sur le meme serveur
                if (hostname !== prec_serv) {
                    // Demander la date
                    sendMessage(hostname);
                    // Sauvegarder le serveur
                    prec_serv = hostname;
                }
            } else {
                // Sinon envoyer le message
                sendMessage(hostname);
                // Et sauvegarder le serveur
                prec_serv = hostname;
            }
        });
    }
});
