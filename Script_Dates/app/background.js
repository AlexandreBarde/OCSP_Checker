var port = browser.runtime.connectNative("ping_pong");
port.onMessage.addListener((response) => {
	console.log("Reçu" + response);
});

browser.browserAction.onClicked.addListener(() => {
	console.log("Envoi: ping");
	port.postMessage("ping");
});
