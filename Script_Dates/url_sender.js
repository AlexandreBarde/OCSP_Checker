function onResponse(response) {
    console.log("Recu " + response);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

browser.browserAction.onClicked.addListener(() => {
    console.log("Envoi url");
    var sending = browser.runtime.sendNativeMessage(
	"date_getter",
	"google.com");
    sending.then(onResponse, onError);
});
