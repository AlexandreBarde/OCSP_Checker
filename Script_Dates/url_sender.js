var port = browser.runtime.connectNative("date_getter");

port.onMessage.addListener((response) => {
    console.log('Recu');
    console.log(response);
});

browser.browserAction.onClicked.addListener(() => {
    console.log("Envoi de l'url");
    port.postMessage("reddit.com");
});
