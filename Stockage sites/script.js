// Pour récupérer l'url de l'onglet actif
browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

    //Récupère l'url
    var url = tabs[0].url;

    //Mise à jour de l'alert
    updateSiteState(url, true);

});

document.addEventListener("click", function(e) {
    if (e.target.classList.contains("notfollowed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            addSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    } else if (e.target.classList.contains("followed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    } else if (e.target.classList.contains("unstorage")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeAllSites();
            updateSiteState(tabs[0].url, false);
        });
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
 * @param element le tableau dans lequel il faut afficher les données
 * @param init un booleen (true si la fonction est utilisée à l'initialisation de la page)
 */
function printSites(element, init) {
    if(!init) {
        element.innerHTML = "";
    }
    if (storageAvailable('localStorage')) {

        var header = element.insertRow(-1);
        header.insertCell(0).innerHTML += "Site";
        header.insertCell(1).innerHTML += "Adresse (URL)";
        header.insertCell(2).innerHTML += "Nb jours max (20 par défaut)";

        var line;
        for(var i = 0; i < localStorage.length; i++) {
            line = element.insertRow(-1);
            line.insertCell(0).innerHTML += convertURL(localStorage.getItem(localStorage.key(i)), false);
            line.insertCell(1).innerHTML += getSite(localStorage.getItem(localStorage.key(i)))[0];
            line.insertCell(2).innerHTML += getSite(localStorage.getItem(localStorage.key(i)))[1];
        }
        if(localStorage.length == 0) {
            line = element.insertRow(-1);
            line.insertCell(0).innerHTML += "";
            line.insertCell(1).innerHTML += "Aucun site tracké.";
            line.insertCell(2).innerHTML += "";
        }
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Supprimer un site stocké
 * @param url l'url du site à supprimer
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

/**
 * Met à jour l'alerte d'information
 * @param url l'url de l'onglet actif
 * @param init un booleen (true si la fonction est utilisée à l'initialisation de la page)
 */
function updateSiteState(url, init) {
    var track = document.getElementById('info_tracking');
    if (storageAvailable('localStorage')) {
        if(getSite(url) == null) {
            track.className = "alert alert-warning";
            track.innerHTML = "<strong>Attention: </strong>Ce site n'est pas suivi par OCSP Checker. "
                + "<button type=\"button\" class=\"btn btn-outline-success btn-sm notfollowed\">Suivre</button>";
        } else {
            track.className = "alert alert-success";
            track.innerHTML = "<strong>Site suivi: </strong>État : [todefine]"
                + "<button type=\"button\" class=\"btn btn-link btn-sm followed\">Ne plus suivre</button>";
        }
        printSites(document.getElementById('sites'), init);
    } else {
        track.className = "alert alert-danger";
        track.innerHTML = "<strong>Erreur: </strong>Les sites suivis sont indisponibles.";
    }
}