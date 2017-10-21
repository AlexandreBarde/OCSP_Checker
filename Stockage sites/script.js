browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    //get current url page
    //var url = tabs[0].url;
    //document.getElementById('site').innerHTML = "URL de la page : " + pingableLink(url);

    //getSites("google", function(data) {
        //document.getElementById('url').innerHTML = data.url;
        //document.getElementById('duree').innerHTML = data.dtime;
    //});

});


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
 * Récupère un site dans la liste des sites
 * @param info l'information requise pour la recherche (le nom du site pour récupérer ses infos, "nbSites" pour récupérer le nombre de sites)
 * @param callback le callback permettant d'utiliser le site
 *
 * Utilisation du site : .url pour récupérer l'url et .dtime pour récupérer la durée en jours
 *
 */
function getSites(info, callback) {
    $(document).ready(function(){
        $.getJSON('sites.json',{
            format: "json"
        }).done(function(data){
            if(info == "nbSites") {
                callback(data.sites.length);
            } else {
                var found = -1;
                for(var i = 0; i < data.sites.length && found == -1; i++) {
                    var tmpname = convertURL(data.sites[i].url, false);
                    if(tmpname == info){
                        found = 0;
                        callback(data.sites[i]);
                    } else {
                        console.log("[ error ] The list doesn't contain the website " + info);
                    }
                }
            }
        });
    });
}