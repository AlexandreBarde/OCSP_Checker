// Ecouter une connexion du background script
chrome.runtime.onMessage.addListener(function (msg) {
    showDate(msg.date);
});

// TODO Vérifier que la réponse soit une date au format Dec 20 10:37:49
// et montrer la popup
function showDate(date) {
    alert(date);
}