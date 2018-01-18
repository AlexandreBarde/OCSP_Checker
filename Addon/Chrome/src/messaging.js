// Identifiant de l'application native
const id_app = 'com.e2.ocsp_checker'

/**
 * Envoie un message à l'application native
 * @param {Object} message - message à envoyer
 * @returns {Promise} - Date de la mise à jour
 */
function sendNative(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendNativeMessage(id_app, message, resolve)
    })
}

/**
 * Envoie un message depuis la popup a background
 * @param {Object} message - message à envoyer
 */
function sendBackground(port, message) {
    port.postMessage(message)
}

/**
 * Envoie un message au content script
 * @param {Object} message - message à envoyer
 */
function sendContent(message) {
    /// Recuperer l'onglet actif
    let p_tabs = new Promise((resolve) => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, resolve)
    })
    p_tabs.then(tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
}

module.exports = {
    sendNative,
    sendBackground,
    sendContent
}
