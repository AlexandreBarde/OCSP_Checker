var port = browser.runtime.connectNative("date_getter");

port.onDisconnect.addListener((p) => {
    if(p.error) {
	console.log(`${p.error.message}`);
    }
});


port.onMessage.addListener((response) => {
    console.log('Recu');
    console.log(response);
});

browser.browserAction.onClicked.addListener(() => {
    console.log("Envoi de l'url");
    port.postMessage("google.com");
});
