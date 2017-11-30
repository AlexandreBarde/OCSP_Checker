/**
* Create a popup notification from incoming message
* @param msg received message
*/
function handleMessage(msg) {
    if (msg.date.length == 1)
	generateErreur();
    else
	generatePopup(msg.date);
}


// Port de connexion au script de background
var port = chrome.runtime.connect({name: "conn1"});

//Récupération de l'url de l'onglet actif
chrome.tabs.onUpdated.addListener(sendurl);


function sendurl(tabId, changeInfo, tab) {

  //Vérification que l'url est définie
  if (typeof changeInfo.url !== 'undefined') {

    console.log("ok : " + changeInfo.url);
    addSite(changeInfo.url, 20);

    var url = convertURL(changeInfo.url, true);
    if(getSite(url) != null) {
      console.log("cbon");

      // Ecouter les messages sur le port
      port.onMessage.addListener(handleMessage);

      console.log("a");
      // Envoi de l'adresse au background script
      // Cet appel devrai être fait automatiquement quand on visite un site de la liste.
      port.postMessage({url: url});
      console.log("b");
    }
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
 * Update the info-alert
 * @param url the url of the current tab
 * @param init a boolean (true if the function is used for the initialization of the page)
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

//storage


/**
 * Permite to follow a website
 * @param url the url of the website
 * @param time the time max for a certificate validity
 */
function addSite(url, time) {
    if (storageAvailable('localStorage')) {
        localStorage.setItem(new String(convertURL(url, false)), url + "#" + time);
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Get informations about a stocked website
 * @param url the url of the website
 * @returns an array of values, first value correspond to the url of the website, the second to the time max for a certificate validity
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
 * Print all data into a HTML table
 * @param element the HTML table
 * @param init a boolean (true if the function is used for the initialization of the page)
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
 * Delete a stocked website
 * @param url the url of the website
 */
function removeSite(url) {
    if (storageAvailable('localStorage')) {
        localStorage.removeItem(new String(convertURL(url, false)));
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
}

/**
 * Delete all stocked websites
 */
function removeAllSites() {
    if (storageAvailable('localStorage')) {
        localStorage.clear();
    } else {
        console.error("[ error ] The local storage isn't available.");
    }
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
