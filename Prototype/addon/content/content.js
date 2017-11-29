/**
* Le ou les scripts de content doivent injecter les notifs dans les pages, afficher la liste des site et tout le bordel en front end,  recuperer l'url
* et l'envoyer au background, et pouvoir recevoir la date et afficher la notif
*/

// Met à jour "l'info-bulle" lorsqu'on ouvre l'extension, un moyen plus simple existe mais pas maintenant, ça fonctionne pour le prototype
browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

    // Update info alert
    updateSiteState(tabs[0].url, true);

});

// Events related to click
document.addEventListener("click", function(e) {
    // Follow Site button
    if (e.target.classList.contains("notfollowed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            addSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    // Unfollow Site button
    } else if (e.target.classList.contains("followed")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeSite(tabs[0].url, 20);
            updateSiteState(tabs[0].url, false);
        });
    // Unfollow All Sites button
    } else if (e.target.classList.contains("unstorage")) {
        browser.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            removeAllSites();
            updateSiteState(tabs[0].url, false);
        });
    }
});
