// Recupere l'adresse d'un serveur depuis une url
function getServerAdress(url) {
    // Cree un lien
    var parser = document.createElement('a');
    // Lui associe l'url
    parser.href = url;
    // Recupere le nom de l'hôte
    return parser.hostname;
}

// Executer à chaque changement dans l'onglet courant
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    // Attendre que la page ai fini de charger
    if (changeInfo.status == 'complete') {
        // Recuperer l'url de l'onglet courant
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url;
            // Recuperer le nom d'hôte du serveur
            var hostname = getServerAdress(url);
            console.log(hostname);
            // L'envoyer à l'application
            chrome.runtime.sendNativeMessage('com.ptut.date_getter',
                {url: hostname},
                function (resp) {
                    // Afficher le réponse
                    console.log(resp);
                    console.log(resp.text);
                })
        });
    }
});
