const date = require('./date')

/**
 * Vérifie que le localstorage soit disponible
 * @returns {Boolean}
 */
function isAvailable() {
    try {
        let storage = window['localStorage'];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
}

function isUnavailableError() {
    console.error('[ error ] The local storage isn\'t available.');
}

/**
 * Ajoute un site à la liste
 * @param {String} hostname - Nom du site
 * @param {String} time - Durée limite
 */
function addSite(hostname, time) {
    if (isAvailable()) {
        localStorage.setItem(hostname, time);
    } else {
        isUnavailableError()
    }
}

/**
 * Récupère l'ancienneté pour un site stocké en secondes
 * @param {String} hostname - Nom du site à récuperer
 */
function getCriticalSeconds(hostname) {
    if (isAvailable()) {
        let critical = localStorage.getItem(hostname);
        if (critical == null) {
            return null;
        }
        return critical
    } else {
        isUnavailableError()
        return null;
    }
}


/**
 * Supprime un site de la liste
 * @param {String} hostname
 */
function removeSite(hostname) {
    if (isAvailable()) {
        localStorage.removeItem(hostname);
    } else {
        isUnavailableError();
    }
}

/**
 * Vide la liste
 */
function removeAllSites() {
    if (isAvailable()) {
        localStorage.clear();
    } else {
        isUnavailableError();
    }
}

/**
 * Donne le nombre de sites stockés
 * @returns {Number}
 */
function getLength() {
    return localStorage.length
}

/**
 * Retourne le nom d'hôte pour une position
 * donnée dans la liste
 * @param {Number} i - Position du site dans la liste
 */
function getHostname(i) {
    return localStorage.key(i)
}

/**
 * Vérifie si la liste est vide
 * @returns {Boolean}
 */
function isEmpty() {
    return localStorage.length === 0
}

/**
 * Vérifie qu'un site soit suivi
 * @param {String} hostname
 * @returns {Boolean}
 */
function isFollowed(hostname) {
    return getCriticalSeconds(hostname) != null
}

module.exports = {
    removeAllSites,
    removeSite,
    getCriticalSeconds,
    addSite,
    isAvailable,
    isUnavailableError,
    getLength,
    getHostname,
    isEmpty,
    isFollowed
}
