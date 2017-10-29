/*
  Ceci est l'exemple du tuto de mozilla sur Nativemessaging: https://developer.mozilla.org/fr/Add-ons/WebExtensions/Native_messaging
  Il sert juste a tester le protocole et a debugger mon firefox mais là ça marche alors c'est cool
*/



/*
On startup, connect to the "ping_pong" app.
*/
var port = browser.runtime.connectNative("ping_pong");

/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});

/*
On a click on the browser action, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  console.log("Sending:  ping");
  port.postMessage("ping");
});
