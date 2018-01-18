/**
 * Récupère le nom d'hote d'une URL donnée
 * @param {String} url
 * @returns {String} - Nom d'hôte du serveur
 */
function getHostname(url) {
    let parser = document.createElement('a')
    parser.href = url
    return parser.hostname
}

/**
 * Récupère le nom d'hote de l'onglet courant
 * @returns {Promise} - Nom d'hôte du site courant
 */
function getCurrentHostname() {
    let p_tabs = new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, resolve)
    })
    return new Promise((resolve) => {
        p_tabs.then((tabs) => {
            resolve(getHostname(tabs[0].url))
        })
    })
}

module.exports = {
    getCurrentHostname,
    getHostname
}