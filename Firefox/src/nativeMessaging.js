/**
 * Envoie un message à l'application native
 * @param {String} message 
 */
module.exports = function (message) {
    return browser.runtime.sendNativeMessage('com.ptut.date_getter', { url: message })
}