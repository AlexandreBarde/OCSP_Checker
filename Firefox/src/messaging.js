/**
 * Envoie un message à l'application native
 * @param {String} message 
 * @returns {Promise}
 *      Promesse contenant la date de mise à jour
 */
function sendNative(message) {
    return browser.runtime.sendNativeMessage('com.ptut.date_getter', { url: message })
}

/**
 * Envoie un message depuis la popup a background
 * @param {Port} port 
 * @param {String} message 
 */
function sendBackground(port, message) {
    return port.postMessage(message)
}

module.exports = {
    sendNative,
    sendBackground
}