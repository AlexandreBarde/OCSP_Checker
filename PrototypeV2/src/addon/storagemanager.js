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
    if (storageAvailable('localStorage')) {
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
    if (storageAvailable('localStorage')) {
        var site = localStorage.getItem(getHostname(url));
        if (site == null) {
            return null;
        }
        return site
    } else {
        console.error("[ error ] The local storage isn't available.");
        return null;
    }
}

/**
 * Print all data into a HTML table
 * @param element the HTML table
 * @param init a boolean (true if the function is used for the initialization of the page)
 */
function printSites(element, init) {
    if (!init) {
        element.innerHTML = "";
    }
    if (storageAvailable('localStorage')) {

        var header = element.insertRow(-1);
        header.insertCell(0).innerHTML += "Site";
        header.insertCell(1).innerHTML += "Ancienneté";
        var line;
        for (var i = 0; i < localStorage.length; i++) {
            line = element.insertRow(-1);
            line.insertCell(0).innerHTML += localStorage.key(i)
            line.insertCell(1).innerHTML += localStorage.getItem(localStorage.key(i))
        }
        if (localStorage.length == 0) {
            line = element.insertRow(-1);
            line.insertCell(0).innerHTML += "Aucun site suivi.";
        }
    } else {
        storageUnavailableError()
    }
}

/**
 * Delete a stocked (eh) website
 * @param url the url of the website
 */
function removeSite(url) {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem(getHostname(url));
    } else {
        storageUnavailableError();
    }
}

/**
 * Delete all stocked (eh) websites
 */
function removeAllSites() {
    if (storageAvailable('localStorage')) {
        localStorage.clear();
    } else {
        storageUnavailableError();
    }
}

/**
 * Permite (eh) to know if the local storage is available
 * @param type the local storage
 * @returns {boolean} true if its available
 */
function storageAvailable(type) {
    try {
        var storage = window[type];
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