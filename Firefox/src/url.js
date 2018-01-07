/**
 * Récupère le nom d'hote d'une URL donnée 
 * @param {String} url 
 */
function getHostname(url) {
    let parser = document.createElement('a')
    parser.href = url
    return parser.hostname
}

/**
 * Récupère le nom d'hote de l'onglet courant
 */
function getCurrentHostname() {
    let p_tabs = browser.tabs.query({ active: true, currentWindow: true })
    let p_hostname = new Promise((resolve, reject) => {
        p_tabs.then((tabs) => {
            resolve(getHostname(tabs[0].url))
        })
    })
    return p_hostname
}

module.exports = {
    getCurrentHostname,
    getHostname
}