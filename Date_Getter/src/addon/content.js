// Ecouter une connexion du background script
chrome.runtime.onMessage.addListener(function (msg) {
    showDate(msg.date);
});

function showDate(date) {
    if (date !== 'Erreur')
        alert(date);
}