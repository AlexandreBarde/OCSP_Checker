const url_parser = require('./url')

/**
 * Vérifie que le localstorage soit disponible
 * @returns {boolean}
 */
function storageAvailable() {
    try {
        var storage = window['localStorage'];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
}

function storageUnavailableError() {
    console.error("[ error ] The local storage isn't available.");
}

/**
 * Ajoute un site à la liste
 * @param {String} url 
 * POUR L'INSTANT
 * @param {String} time 
 */
function addSite(url, time) {
    if (storageAvailable()) {
        localStorage.setItem(url_parser(url), time);
    } else {
        storageUnavailableError()
    }
}

/**
 * Récupère un site de la liste
 * @param {String} url 
 */
function getSite(url) {
    if (storageAvailable()) {
        var site = localStorage.getItem(url_parser(url));
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
 * Supprime un site de la liste
 * @param {String} url 
 */
function removeSite(url) {
    if (storageAvailable()) {
        localStorage.removeItem(url_parser(url));
    } else {
        storageUnavailableError();
    }
}

/**
 * Vide la liste
 */
function removeAllSites() {
    if (storageAvailable()) {
        localStorage.clear();
    } else {
        storageUnavailableError();
    }
}

module.exports = {
    removeAllSites,
    removeSite,
    getSite,
    addSite,
    storageAvailable,
    storageUnavailableError
}