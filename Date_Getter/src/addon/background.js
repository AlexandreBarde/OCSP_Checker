var port = chrome.runtime.connectNative('com.ptut.date_getter');

port.onMessage.addListener(function (message) {
    console.log('Recu: ' + message.text);
});
port.onDisconnect.addListener(function () {
    console.log("Port déconnecté");
});

chrome.browserAction.onClicked.addListener(function () {
    console.log("Envoi: reddit.com");
    port.postMessage({"url": "reddit.com"});
});
