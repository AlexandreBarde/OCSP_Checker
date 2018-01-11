const date = require('./date')

/**
 * Envoie un message à l'application native
 * @param {String} message 
 * @returns {Promise}
 *      Promesse contenant la date de mise à jour
 */
function sendNative(message) {
    return browser.runtime.sendNativeMessage('com.e2.ocsp_checker', { url: message })
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
    let p_tabs = browser.tabs.query({ active: true, lastFocusedWindow: true });
    p_tabs.then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, message)
    })
}

module.exports = {
    sendNative,
    sendBackground,
    sendContent
}