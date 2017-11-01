var port = browser.runtime.connectNative("url_share");
port.onMessage.addListener((response) => {
  console.log("Date reçue " + response);
});

browser.browserAction.onClicked.addListener(() => {
  console.log("Envoi de l\'url ");
  port.postMessage("yahoo.fr");
});
