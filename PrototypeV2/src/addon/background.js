/**
 * GESTION DE LA COMMUNICATION AVEC L'APPLICATION NATIVE
 */

// Nom d'hôte du site précedemment consulté
var old_hostname
// Vrai quand l'appel vient d'un ajout/ d'une modification dans la liste
var force

// Ecouter les mises à jour des pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    // Quand une page a fini de charger
    if (changeInfo.status === 'complete') {
        force = false
        transfer_date()
    }
})

// Ecouter les connection entrante
chrome.runtime.onConnect.addListener(function (port) {
    // Quand la popup envoie un message
    if (port.name === 'popup-bg-port') {
        port.onMessage.addListener(function (msg) {
            // On renverra forcement une reponse
            force = true
            transfer_date()
        })
    }
})

/**
 * Initialise le transfert de données.
 */
function transfer_date() {
    // Recupère les infos des onglets
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, getUpdate)
}

/**
 * Recupère la date depuis l'application native et la transmet 
 * au content script
 * @param {*} tabs 
 */
function getUpdate(tabs) {
    var hostname = getHostname(tabs[0].url)
    // Si on est pas sur le même site qu'avant // ou qu'on vient de suivre/modifier le site
    if (typeof old_hostname === 'undefined' || old_hostname !== hostname || force) {
        // Sauvegarder le site courant
        old_hostname = hostname
        // Si ce site est suivi
        if (isFollowed(hostname)) {
            chrome.runtime.sendNativeMessage('com.ptut.date_getter', { url: hostname }, function (response) {
                if (typeof response !== 'undefined') {
                    // Si l'ancienneté est critique, envoyer un message au content script
                    // contenant la date de la mise à jour et la différence entre la durée
                    // ecoulée et la durée critique
                    if (isCritical(response.text, localStorage.getItem(hostname))) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            date: response.text,
                            diff: getDiff(response.text, localStorage.getItem(hostname))
                        })
                    }
                }
            })
        }
    }
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
 * Vérifie qu'un site soit dans la liste
 * @param {String} hostname 
 */
function isFollowed(hostname) {
    if (storageAvailable()) {
        var site = localStorage.getItem(hostname);
        return site != null;
    } else {
        storageUnavailableError()
        return false;
    }
}

/**
 * Vérifie si la différence entre la date actuelle
 * et la date de mise à jours dépasse l'ancienneté max
 * @param {String} str_date 
 * @param {number} duration
 *      Ancienneté max en millisecondes
 */
function isCritical(str_date, duration) {
    return getDiff(str_date, duration) >= duration
}

/**
 * Calcule la différence en millisecondes
 * @param {String} str_date 
 * @param {Number} duration 
 */
function getDiff(str_date, duration) {
    // Date de la réponse de l'application native
    var d = new Date(str_date);
    // Différence en millisecondes entre le date
    // actuelle et la réponse
    return Math.abs(new Date() - d);
}

/**
 * Détermine si la localStorage est disponible
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