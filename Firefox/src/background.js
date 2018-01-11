const url_parser = require('./url')
const storage_manager = require('./storage')
const messaging = require('./messaging')
const date = require('./date')
const storage = require('./storage')
const moment = require('moment')

var serveur_precedent

// Ecouter les message de la popup
browser.runtime.onMessage.addListener((request, sender, response) => {
    // Si la popup a juste demandé si l'OCSP Stapling est supporté
    // essayer de renvoyer la date
    if (request.has_ocsp) {
        response(messaging.sendNative(request.has_ocsp))
        // Si la popup demande une verification de la date
    } else if (request.get_date) {
        // Forcer la verification de l'hote demandé
        messaging.sendNative(request.get_date)
            .then(update => {
                let dep = date.treatUpdate(update, request.get_date)
                if (dep)
                    messaging.sendContent(dep)
            })
    }
})

// A chaque fois qu'un onglet est chargé
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // Récuperer le nom d'hôte du serveur
        let p_hostname = url_parser.getCurrentHostname()
        p_hostname.then(hostname => {
            // Verifier qu'on ne soit pas encore sur le même serveur
            // et que le site soit suivi
            if ((typeof serveur_precedent === 'undefined' || serveur_precedent != hostname) && storage.isFollowed(hostname)) {
                // Sauvegarder le serveur courant
                serveur_precedent = hostname
                // Recuperer la date 
                let p_date = messaging.sendNative(hostname)
                p_date.then(update => {
                    let dep = date.treatUpdate(update, hostname)
                    // Si la date a été dépassée, envoyer l'information au content script
                    if (dep) {
                        messaging.sendContent(dep)
                        // Et forcer la verification à la prochaine actualisation
                        serveur_precedent = undefined
                    }
                })
            }
        })
    }
})
