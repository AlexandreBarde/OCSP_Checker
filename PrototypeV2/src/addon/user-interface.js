/**
 * CONTIENT LA LOGIQUE LIÉE AUX ACTIONS DE L'UTILISATEUR
 * ET A LA PRESENTATION DES DONNEES
 */

// Port de communication avec le background script
var port = chrome.runtime.connect({ name: 'popup-bg-port' });

port.onMessage.addListener(function (msg) {
    console.log(msg)
})


// URL du site courant
var url

// Recuperer l'onglet actif
chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    // Recuperer son url
    url = tabs[0].url;
    // Afficher si le site est suivi ou non
    updateSiteState(url, true);
});

// Quand on clique sur la fenêtre
document.addEventListener("click", function (e) {
    // Si on a cliqué sur suivre
    if (e.target.classList.contains("notfollowed")) {
        // On doit passer l'entrée de l'utilisateur en millisecondes
        var duree = prompt("Combien de millisecondes mon super pote ?")
        addSite(url, duree);
        updateSiteState(url);
        // Envoyer une demande à l'application native via la background script
        port.postMessage({ query: 'sendDate' })
        chrome.runtime.sendMessage({ query: 'sendURL' })
        // Unfollow Site button
    } else if (e.target.classList.contains("followed")) {
        removeSite(url);
        // Unfollow All Sites button
    } else if (e.target.classList.contains("unstorage")) {
        removeAllSites();
    }
    updateSiteState(url);
});

/**
 * Update the info-alert
 * @param url the url of the current tab
 * @param init a boolean (true if the function is used for the initialization of the page)
 */
function updateSiteState(url, init = false) {
    var track = document.getElementById('info_tracking');
    if (storageAvailable()) {
        if (getSite(url) == null) {
            track.className = "alert alert-warning";
            track.innerHTML = "<strong>Attention: </strong>Ce site n'est pas suivi par OCSP Checker. "
                + "<button type=\"button\" class=\"btn btn-outline-success btn-sm notfollowed\">Suivre</button>";
        } else {
            track.className = "alert alert-success";
            track.innerHTML = "<strong>Site suivi: </strong>État : [todefine]"
                + "<button type=\"button\" class=\"btn btn-link btn-sm followed\">Ne plus suivre</button>";
        }
        printSites(init);
    } else {
        track.className = "alert alert-danger";
        track.innerHTML = "<strong>Erreur: </strong>Les sites suivis sont indisponibles.";
    }
}

/**
 * Affiche la liste des sites dans un tableau
 * @param element
 * @param {boolean} init
 */
function printSites(init) {
    var element = document.getElementById('sites')
    if (!init) {
        element.innerHTML = "";
    }
    if (storageAvailable()) {
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
