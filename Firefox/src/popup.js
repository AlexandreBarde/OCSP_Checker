const moment = require('moment')
const ui = require('./ui')
const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')
const stor = require('./storage')

var siteToModif;

/**
 * Vérifie un serveur utilise OCSP Stapling 
 * @param {String} hostname 
 * @returns {Promise}
 */
function hasStapling(hostname) {
    return new Promise((resolve, reject) => {
        messaging.sendBackground({ has_ocsp: hostname })
            .then(rep => {
                if (date.isDate(rep)) {
                    resolve(rep)
                } else {
                    reject()
                }
            })
    })
}

/**
 * Affiche le status (suivi/non suivi/désactive)
 * du site courant
 */
function updateSiteStatus() {
    // récupérer le nom d'hote
    url_parser.getCurrentHostname()
        .then(hostname => {
            // Demander au background script si le site utilise OCSP Stapling
            hasStapling(hostname)
                // Si c'est le cas
                .then(date_resp => {
                    // Si le site est pas suivi le montrer
                    if (stor.isFollowed(hostname)) {
                        ui.showFollowed()
                    } else {
                        // Sinon proposer de le suivre
                        ui.showUnfollowed()
                    }
                }).catch(() => {
                    // Si le background n'as pas renvoyé de date, le site n'utilise pas l'OCSP Stapling
                    ui.showDisabled()
                })
        })
}

// Quand on ouvre la popup
// afficher l'état du site courant et la liste des sites
updateSiteStatus()
ui.printSites()


// Quand on clique sur "Suivre"
ui.btn_follow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            let days = document.getElementById("days").value;
            let hours = document.getElementById("hours").value;
            let mins = document.getElementById("minutes").value;
            let secs = document.getElementById("seconds").value;

            if (valid_modif(days, hours, mins, secs)) {

                let time = moment.duration({
                    seconds: secs,
                    minutes: mins,
                    hours: hours,
                    days: days,
                    weeks: 0,
                    months: 0,
                    years: 0
                });
                ui.follow(hostname, time.asSeconds());
                // Envoyer une requête au background pour forcer la vérification
                messaging.sendBackground({ get_date: hostname })
            } else {
                //TODO: message d'erreur
            }
        })
})

// Quand on clique sur "Ne plus suivre"
ui.btn_unfollow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            ui.unfollow(hostname)
        })
})

// Quand on clique sur "Vider la liste des sites"
ui.btn_unfollowall.addEventListener('click', () => {
    ui.unfollowAllSites()
    // Actualiser la popup en fonction de la page ou on se trouve
    updateSiteStatus()

})

// Quand on clique sur la fenêtre
document.addEventListener('click', function (e) {

    // Si on a cliqué sur l'icone de modification d'un site
    if (e.target.classList.contains("edit_site")) {
        ui.div_modif.hidden = false;
        siteToModif = e.target.id;
    }

    // Si on a cliqué sur l'icone de suppression d'un site
    if (e.target.classList.contains("delete_site")) {
        url_parser.getCurrentHostname()
            .then(hostname => {
                stor.removeSite(e.target.id);
                if (hostname == e.target.id) ui.showUnfollowed();
                ui.printSites();
            })
    }
})

// Quand on clique sur "Développer" pour afficher la liste des sites
ui.btn_chevron_down.addEventListener('click', () => {
    ui.btn_chevron_down.hidden = true;
    ui.btn_chevron_up.hidden = false;
    ui.sites_list.hidden = false;
    ui.btn_unfollowall.hidden = false;
})

// Quand on clique sur "Réduire" pour cacher la liste des sites
ui.btn_chevron_up.addEventListener('click', () => {
    ui.btn_chevron_down.hidden = false;
    ui.btn_chevron_up.hidden = true;
    ui.sites_list.hidden = true;
    ui.btn_unfollowall.hidden = true;
})

// Quand on clique sur "Modifier" pour modifier le site concerné
ui.btn_modif_done.addEventListener('click', () => {

    let days = document.getElementById("days_modif").value;
    let hours = document.getElementById("hours_modif").value;
    let mins = document.getElementById("minutes_modif").value;
    let secs = document.getElementById("seconds_modif").value;

    if (valid_modif(days, hours, mins, secs)) {

        url_parser.getCurrentHostname()
            .then(hostname => {
                let time = moment.duration({
                    seconds: secs,
                    minutes: mins,
                    hours: hours,
                    days: days,
                    weeks: 0,
                    months: 0,
                    years: 0
                });

                stor.addSite(siteToModif, time.asSeconds())
                // Refaire une vérification auprès du background avec la nouvelle date
                messaging.sendBackground({ get_date: hostname })
                ui.printSites()
                ui.div_modif.hidden = true;
            })
    } else {
        //TODO: message d'erreur
    }
})

function valid_modif(days, hours, mins, secs) {
    return (
        !isNaN(days) && !isNaN(hours) && !isNaN(mins) && !isNaN(secs)
        && (days >= 0 && hours >= 0 && mins >= 0 && secs >= 0)
        && (hours < 24 && mins < 60 && secs < 60)
        && (days + hours + mins + secs > 0)
    )
}