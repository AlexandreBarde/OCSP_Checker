// Ecouter les mises à jour des pages
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        transfer_date()
    }
})

// Ecouter les message du content script
chrome.runtime.onMessage.addListener(function () {
    transfer_date()
})

/**
 * Recupère la date depuis l'application native et la transmet 
 * au content script
 * @param {*} tabs 
 */
function getUpdate(tabs) {
    var hostname = getHostname(tabs[0].url)
    if (isFollowed(hostname)) {
        chrome.runtime.sendNativeMessage('com.ptut.date_getter', { url: hostname }, function (response) {
            if (typeof response !== 'undefined')
                chrome.tabs.sendMessage(tabs[0].id, { date: response.text })
        })
    }
}

/**
 * Initialise le transfert de données.
 */
function transfer_date() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, getUpdate)
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
    if (storageAvailable('localStorage')) {
        var site = localStorage.getItem(hostname);
        return site != null;
    } else {
        console.error("[ error ] The local storage isn't available.");
        return false;
    }
}

/**
 * Récupère l'ancienneté critique d'un site
 * @param {String} hostname 
 */
function getDuration(hostname) {
    if (!isFollowed)
        return null;
    return localStorage.getItem(hostname)
}

/**
 * Détermine si une ancienneté d'attestation est critique
 * @param {*} hostname 
 * @param {*} duration 
 */
function isCritical(hostname, duration) {
    console.log('Site ' + hostname)
    console.log('Anciennete ' + duration)
}

/**
 * DOIT ETRE GLOBALE
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