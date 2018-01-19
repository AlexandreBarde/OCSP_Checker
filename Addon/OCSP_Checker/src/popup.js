const ui = require('./ui')
const date = require('./date')
const url_parser = require('./url')
const messaging = require('./messaging')
const stor = require('./storage')


let siteToModif;

// Se connecter au backgound
const port = chrome.runtime.connect()

// Ecouter les réponse du background script
port.onMessage.addListener(message => {
    // Dès qu'on reçoit la réponse, cacher l'écran de chargement
    document.getElementById('loading').hidden = true
    console.log(document.getElementById('loading'))
    // Si le site courant supporte OCSP Stapling
    if (message.has_stapling) {
        // Si il est déjà suivi
        if (stor.isFollowed(message.hostname)) {
            ui.showFollowed()
        } else {
            ui.showUnfollowed()
        }
    } else if (message.show_ok) {
        // Si la limite n'est pas dépassée, afficher l'icone OK
        ui.check.hidden = false
        ui.check.classList.add('ok_active')
        // Pendant 1 seconde
        setTimeout(() => {
            ui.check.hidden = true
        }, 1000)

    } else {
        // Sinon empecher de le suivre
        ui.showDisabled()
    }
})

/**
 * Met à jour l'état (suivi/non suivi/pas supporté) du
 * site courant
 */
function updateSiteStatus() {
    url_parser.getCurrentHostname()
        .then(hostname => {
            // Demander au background de vérifier si le site courant support OCSP Stapling
            messaging.sendBackground(port, {
                hostname: hostname,
                action: 'check_stapling'
            })
        })
}

// Quand on clique sur "Suivre"
ui.btn_follow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            let days = document.getElementById('days').value;
            let hours = document.getElementById('hours').value;
            let mins = document.getElementById('minutes').value;
            let secs = document.getElementById('seconds').value;
            if (valid_modif(days, hours, mins, secs)) {
                // Stocker la durée un millisecondes
                let time = date.asMilliseconds(days, hours, mins, secs)
                ui.follow(hostname, time);
                // Envoyer une requête au background pour forcer la vérification
                // avec l'adresse du serveur concerné et la duree limite
                messaging.sendBackground(port, {
                    hostname: hostname,
                    action: 'get_date',
                    lim: time
                })
            } else {
                ui.showAddWarning();
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
    if (e.target.classList.contains('edit_site')) {

        let time = stor.getCriticalSeconds(e.target.id)
        let obj_date = date.toObject(time)
        document.getElementById('days_modif').value = obj_date.days
        document.getElementById('hours_modif').value = obj_date.hours
        document.getElementById('minutes_modif').value = obj_date.minutes
        document.getElementById('seconds_modif').value = obj_date.seconds
        // Afficher les champs de modification
        ui.showModif()
        siteToModif = e.target.id;
    }

    // Si on a cliqué sur l'icone de suppression d'un site
    if (e.target.classList.contains('delete_site')) {
        url_parser.getCurrentHostname()
            .then(hostname => {
                stor.removeSite(e.target.id);
                if (hostname === e.target.id) ui.showUnfollowed();
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

    let days = document.getElementById('days_modif').value;
    let hours = document.getElementById('hours_modif').value;
    let mins = document.getElementById('minutes_modif').value;
    let secs = document.getElementById('seconds_modif').value;

    // Si les valeurs à modifier sont correctes
    if (valid_modif(days, hours, mins, secs)) {
        url_parser.getCurrentHostname()
            .then(hostname => {
                let time = date.asMilliseconds(days, hours, mins, secs)
                stor.addSite(siteToModif, time)
                // Refaire une vérification auprès du background avec la nouvelle date si le site modifié est le site visité
                if (hostname === siteToModif) messaging.sendBackground(port, {
                    hostname: hostname,
                    action: 'get_date',
                    lim: time
                })
                ui.printSites()
                // Rafficher l'écran précedent
                updateSiteStatus()
            })

    } else {
        ui.showModifWarning();
    }
})

// Retourne vrai si ce sont des entiers positifs, avec days < 24 et hours, mins et secs < 60
function valid_modif(days, hours, mins, secs) {
    return (
        !isNaN(days) && !isNaN(hours) && !isNaN(mins) && !isNaN(secs)
        && (days >= 0 && hours >= 0 && mins >= 0 && secs >= 0)
        && (hours < 24 && mins < 60 && secs < 60)
        && (days + hours + mins + secs > 0)
    )
}

// Quand un site est suivi et qu'on clique sur l'icone pour refaire la vérification
ui.btn_refresh.addEventListener('click', () => {
    // Faire tourner la petite fleche
    ui.btn_refresh.classList.add('active')
    setTimeout(() => {
        ui.btn_refresh.classList.remove('active')
    }, 800)
    // Refaire la requête en précisant qu'il s'agit d'une demande manuelle
    url_parser.getCurrentHostname()
        .then(hostname => {
            messaging.sendBackground(port, {
                hostname: hostname,
                action: 'get_date',
                lim: stor.getCriticalSeconds(hostname),
                manual: true
            })
        })
})


// Quand on charge la page
// afficher la liste des sites
ui.printSites()
// Puis verifier l'état du site
updateSiteStatus()
