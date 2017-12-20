var prec_serv; // Dernier serveur consulté

// Recupere l'adresse d'un serveur depuis une url
function getServerAdress(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
}

// Envoie un message au content script
function sendToContent(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { date: msg });
    });
}

// Gère la réponse de l'application
var handleNativeResp = function (resp) {
    console.log(resp.text);
    sendToContent(resp.text)
}

// Envoie un message à l'application native
function sendNative(msg) {
    chrome.runtime.sendNativeMessage('com.ptut.date_getter',
        { url: msg },
        handleNativeResp)
}

// Executer à chaque changement dans l'onglet courant
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        // Recuperer l'url de l'onglet courant
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
            var url = tabs[0].url;
            var hostname = getServerAdress(url);
            // TODO: Verifier que le site est suivi
            if (true) {
                if (typeof prec_serv !== 'undefined') {
                    // Si le site n'est pas le même que le denier consulté
                    if (hostname !== prec_serv) {
                        sendNative(hostname);
                        prec_serv = hostname;
                    }
                } else {
                    sendNative(hostname);
                    prec_serv = hostname;
                }
            }
        });
    }
});
