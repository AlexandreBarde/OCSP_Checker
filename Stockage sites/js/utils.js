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