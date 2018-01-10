const url_parser = require('./url')
const moment = require('moment')
const moment_formatter = require('moment-duration-format')
const date = require('./date')

/**
 * Vérifie que le localstorage soit disponible
 * @returns {boolean}
 */
function isAvailable() {
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

function isUnavailableError() {
    console.error("[ error ] The local storage isn't available.");
}

/**
 * Ajoute un site à la liste
 * @param {String} hostname
 * POUR L'INSTANT
 * @param {String} time
 */
function addSite(hostname, time) {
    if (isAvailable()) {
        localStorage.setItem(hostname, time);
    } else {
        isUnavailableError()
    }
}

/**
 * Récupère un site de la liste
 * @param {String} hostname
 */
function getSite(hostname) {
    if (isAvailable()) {
        var site = localStorage.getItem(hostname);
        if (site == null) {
            return null;
        }
        return site
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
 * Donne l'ancienneté critique pour un nom d'hote
 * @param {string} hostname
 */
function getCriticalAge(hostname) {
    if (isAvailable()) {
        var timesec = moment.duration(Number(localStorage.getItem(hostname)), 'seconds');
        return date.formatDuration(timesec);
    } else {
        isUnavailableError()
    }
}

function getLength() {
    return localStorage.length
}

function getHostname(i) {
    return localStorage.key(i)
}

function isEmpty() {
    return localStorage.length == 0
}

function isFollowed(hostname) {
    return getSite(hostname) != null
}

module.exports = {
    removeAllSites,
    removeSite,
    getSite,
    addSite,
    isAvailable,
    isUnavailableError,
    getCriticalAge,
    getLength,
    getHostname,
    isEmpty,
    isFollowed
}
