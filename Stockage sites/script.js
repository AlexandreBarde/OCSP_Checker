browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    //get current url page
    var url = tabs[0].url;


    if (storageAvailable('localStorage')) {
        addSite('https://google.com/', 10);
        addSite('https://facebook.com/', 20);
        addSite('https://twitter.com/', 30);
        printSites(document.getElementById('sites'));
    } else {
        console.log("ko");
    }

});

////// FONCTIONS //////

/**
 * Permet d'ajouter un site au stockage local
 * @param url l'url du site
 * @param time le temps max de la validité du cache du certificat
 */
function addSite(url, time) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem(new String(convertURL(url, false)), url + "#" + time);
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Récupère les informations d'un site stocké
 * @param url l'url du site à récupérer
 * @returns un tableau de valeurs, la première correspond à l'url, la seconde au temps max de la validité du cache du certificat
 */
function getSite(url) {
    if (storageAvailable('localStorage')) {
        var site = localStorage.getItem(new String(convertURL(url, false)));
        if(site == null) {
            console.error("The website " + convertURL(url, false) + " doesn't exist in the local storage.");
            return null;
        }
        return site.split('#');
    } else {
        console.error("[ error ] The local storage isn't available.");
        return null;
    }
}

/**
 * Affiche toutes les données des sites stockées dans un tableau
 * @param le tableau dans lequel il faut afficher les données
 */
function printSites(element) {
    if (storageAvailable('localStorage')) {

        var header = element.insertRow(-1);
        header.insertCell(0).innerHTML += "Site";
        header.insertCell(1).innerHTML += "Adresse (URL)";
        header.insertCell(2).innerHTML += "Nb jours max";

        var line;
        for(var i = 0; i < localStorage.length; i++) {
            line = element.insertRow(-1);
            line.insertCell(0).innerHTML += convertURL(localStorage.getItem(localStorage.key(i))[0], false);
            line.insertCell(1).innerHTML += localStorage.getItem(localStorage.key(i))[0];
            line.insertCell(2).innerHTML += localStorage.getItem(localStorage.key(i))[1];
        }
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Supprimer un site stocké
 * @param name le nom du site à supprimer
 */
function removeSite(url) {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem(new String(convertURL(url, false)));
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Supprime l'ensemble des sites stockés
 */
function removeAllSites() {
    if (storageAvailable('localStorage')) {
        localStorage.clear();
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Permet de savoir si le stockage local est disponible
 * @param type le stockage
 * @returns {boolean} true s'il est disponible
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

/**
 * Converti une URL brute (avec https://www.* /) en une URL "pingable"
 * @param link la chaine de l'URL a convertir
 * @param ext un booléen
 *          true = avec .* (ex: .fr)
 *          false = sans .*
 * @returns l'URL sous forme de chaine
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