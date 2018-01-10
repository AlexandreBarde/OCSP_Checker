const moment = require('moment')

const ui = require('./ui')
const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')
const stor = require('./storage')


// Quand on ouvre la popup
// récupérer le nom d'hote
url_parser.getCurrentHostname()
    .then(hostname => {
        browser.runtime.sendMessage(hostname)
            .then(rep => {
                ui.printSites()
                // Si le site n'utilise pas OCSP Stapling
                if (!date.isDate(rep)) {
                    // Ne pas afficher la div permettant de le suivre
                    ui.showDisabled()
                } else {
                    // Sinon si le site n'est pas déjà suivi, lui proposer de le suivre
                    if (stor.getSite(hostname) == null) {
                        ui.showUnfollowed()
                    } else {
                        ui.showFollowed()
                    }
                }
            })
    })

// Quand on clique sur "Suivre"
ui.btn_follow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            var days = document.getElementById("days").value;
            var hours = document.getElementById("hours").value;
            var mins = document.getElementById("minutes").value;
            var secs = document.getElementById("seconds").value;

            if (!isNaN(days) && !isNaN(hours) && !isNaN(mins) && !isNaN(secs)
                && (days >= 0 && hours >= 0 && mins >= 0 && secs >= 0)
                && (days + hours + mins + secs > 0)) {

                var time = moment.duration({
                    seconds: secs,
                    minutes: mins,
                    hours: hours,
                    days: days,
                    weeks: 0,
                    months: 0,
                    years: 0
                });

                ui.follow(hostname, time.asSeconds());
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
})

// Quand on clique sur "Développer" pour afficher la liste des sites
ui.btn_chevron_down.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            ui.btn_chevron_down.hidden = true;
            ui.btn_chevron_up.hidden = false;
            ui.sites_list.hidden = false;
            ui.btn_unfollowall.hidden = false;
        })
})

// Quand on clique sur "Réduire" pour cacher la liste des sites
ui.btn_chevron_up.addEventListener('click', () => {
    ui.btn_chevron_down.hidden = false;
    ui.btn_chevron_up.hidden = true;
    ui.sites_list.hidden = true;
    ui.btn_unfollowall.hidden = true;
})
