const date = require('./date')

const id_app = 'com.e2.ocsp_checker'

/**
 * Envoie un message à l'application native
 * @param {String} message 
 * @returns {Promise}
 *      Promesse contenant la date de mise à jour
 */
function sendNative(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendNativeMessage(id_app, { url: message }, resolve)
    })
}

/**
 * Envoie un message depuis la popup a background
 * @param {String} message 
 */
function sendBackground(port, message) {
    port.postMessage(message)
}

/**
 * Envoie un message au content script
 * @param {Object} message 
 */
function sendContent(message) {
    /// Recuperer l'onglet actif
    let p_tabs = new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, resolve)
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
