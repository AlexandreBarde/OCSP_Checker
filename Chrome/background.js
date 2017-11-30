// Port de connexion à l'application native
var native_port = chrome.runtime.connectNative('date_getter');

// Gere les message entrant du content script
function getContentMessage(message) {
    // Quand on recoit une url du content, la transmettre
    // a l'application native
    console.log('Message recu, transmission à l\'app');
    sendMessage(message.url);
}

chrome.runtime.onConnect.addListener((port) => {
    // Si on est joint par le bon port
    if(port.name == "conn1") {
    console.log('Port active');
    // L'ecouter et envoyer à l'application native à la reception
    port.onMessage.addListener(getContentMessage);
    // Puis attendre la reponse de l'application native
    native_port.onMessage.addListener((message) => {
        console.log('app a repondu');
	// Quand on le recoit, le retransmettrre au content
	port.postMessage({date: message});
    });
    }
});

// Envoie un message à l'application
function sendMessage(message) {
    console.log('Envoi à l\'app');
    native_port.postMessage(message);
}
