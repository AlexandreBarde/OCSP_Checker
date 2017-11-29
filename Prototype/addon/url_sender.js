// var port = browser.runtime.connectNative("date_getter");

// // Attends un message sur le port d'écoute
// port.onMessage.addListener((response) => {
//     console.log('Recu');
//     console.log(response);
// });

// Quand on clique sur l'icone
browser.browserAction.onClicked.addListener(() => {
    console.log("Envoi de l'url");
    // Envoyer un message sur le port
    port.postMessage("google.com");
});
