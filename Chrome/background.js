// Port de connexion à l'application native
var native_port = chrome.runtime.connectNative('date_getter');


/**
 * Envoie un message à l'application native
 * @param message: message à envoyer
 */
function sendMessage(message) {
    console.log('Envoi à l\'app');
    native_port.postMessage(message);
}

/**
 * Gère la reception de message depuis le script de contenu
 * @param message: message reçu
 */
function getContentMessage(message) {
    // Quand on recoit une url du content, la transmettre
    // a l'application native
    console.log('Message recu, transmission à l\'app');
    sendMessage(message.url);
}

// Attendre une connection
chrome.runtime.onConnect.addListener((port) => {
    // Si on est joint par le bon port
    if (port.name == "conn1") {
        console.log('Port activé');
        // L'ecouter et envoyer à l'application native à la reception
        port.onMessage.addListener(getContentMessage);
        // Puis attendre la reponse de l'application native
        native_port.onMessage.addListener((message) => {
            console.log('app a repondu');
            // Quand on le recoit, le retransmettrre au content
            port.postMessage({
                date: message
            });
        });
    }
});
