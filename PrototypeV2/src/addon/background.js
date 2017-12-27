var prec_serv; // Dernier serveur consulté

// Recupere l'adresse d'un serveur depuis une url
function getServerAdress(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
}

// Envoie un message au content script
function sendToContent(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { date: msg });
    });
}

// Gère la réponse de l'application
var handleNativeResp = function (resp) {
    sendToContent(resp.text)
}

// Envoie un message à l'application native
function sendNative(msg) {
    chrome.runtime.sendNativeMessage('com.ptut.date_getter',
        { url: msg },
        handleNativeResp)
}

// Executer à chaque changement dans l'onglet courant
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        // Recuperer l'url de l'onglet courant
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
            var url = tabs[0].url;
            var hostname = getServerAdress(url);
            if (isFollowed(url)) {
                if (typeof prec_serv !== 'undefined') {
                    // Si le site n'est pas le même que le denier consulté
                    if (hostname !== prec_serv) {
                        sendNative(hostname);
                        prec_serv = hostname;
                    }
                } else {
                    sendNative(hostname);
                    prec_serv = hostname;
                }
            }
        });
    }
});

/**
 * Check if the website in parameter is in the local storage
 * @param url the url of the website
 * @returns true if the website is in the local storage, false if not
 */
function isFollowed(url) {
    if (storageAvailable('localStorage')) {
        var site = localStorage.getItem(new String(convertURL(url, false)));
        if(site == null) {
            return false;
        }
        return true;
    } else {
        console.error("[ error ] The local storage isn't available.");
        return null;
    }
}

/**
 * Convert an url (with https://www.* /) in a "pingable" url
 * @param url the url to convert
 * @param ext a boolean
 *          true = with .* (i.e: .fr)
 *          false = without .*
 * @returns the URL as a String
 */
function convertURL(url, ext) {
    if(url.indexOf("/") >= 0){
        var sl = url.split('/');
        if (sl[2].substring(0, 4) == "www.") {
            sl[2] = sl[2].substring(4, sl[2].length);
        }
        var value = sl[2];
    } else {
        var value = url;
    }
    if(ext == false) {
        value = value.substring(0, value.length - value.split('.')[value.split('.').length-1].length - 1);
    }
    return value;
}

/**
 * Permite to know if the local storage is available
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
    catch(e) {
        return false;
    }
}
