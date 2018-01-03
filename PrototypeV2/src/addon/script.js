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
        addSite(url, 20);
        updateSiteState(url);
        // Envoyer une demande à l'application native via la background script 
        chrome.runtime.sendMessage({ query: 'sendURL' });
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
    if (storageAvailable('localStorage')) {
        if (getSite(url) == null) {
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