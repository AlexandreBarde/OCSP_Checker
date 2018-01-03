/**
 * GESTION DE LA LISTE DES SITES
 */

// Permet d'acceder aux fonction du background script
function storageAvailable() {
    return chrome.extension.getBackgroundPage().storageAvailable()
}
function storageUnavailableError() {
    chrome.extension.getBackgroundPage().storageUnavailableError()
}

/**
 *  Retourne le nom d'hote d'une url donnée 
 * @param {String} url 
 */
function getHostname(url) {
    var parser = document.createElement('a')
    parser.href = url
    return parser.hostname
}

/** 
 * Permite (eh) to follow a website
 * @param url the url of the website
 * @param time the time max (eh) for a certificate validity
 */
function addSite(url, time) {
    if (storageAvailable()) {
        localStorage.setItem(getHostname(url), time);
    } else {
        storageUnavailableError()
    }
}

/**
 * Get informations about a stocked (eh) website
 * @param url the url of the website (eh)
 * @returns an array of values, first value correspond (eh) to the url of the website, the second to the time max (eh) for a certificate validity
 */
function getSite(url) {
    if (storageAvailable()) {
        var site = localStorage.getItem(getHostname(url));
        if (site == null) {
            return null;
        }
        return site
    } else {
        storageUnavailableError()
        return null;
    }
}


/**
 * Delete a stocked (eh) website
 * @param url the url of the website
 */
function removeSite(url) {
    if (storageAvailable()) {
        localStorage.removeItem(getHostname(url));
    } else {
        storageUnavailableError();
    }
}

/**
 * Delete all stocked (eh) websites
 */
function removeAllSites() {
    if (storageAvailable()) {
        localStorage.clear();
    } else {
        storageUnavailableError();
    }
}