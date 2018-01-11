const url_parser = require('./url')
const storage_manager = require('./storage')
const messaging = require('./messaging')
const date = require('./date')
const storage = require('./storage')
const moment = require('moment')

var serveur_precedent

// Quand on reçoit une demande du background script
chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(message => {
        console.log(message)
        // Dans le cas ou on doit verifier que le site support OCSP Stapling
        if (message.check_stapling) {
            console.log("Vérification")
            console.log(message.check_stapling)
            // Demander la date de la dernière mise à jour de l'attestation OCSP
            // à l'application native
            messaging.sendNative(message.check_stapling)
                .then(response => {
                    console.log(response)
                    // Si on a reçu une date, OCSP Stapling est supporté
                    let is_date = date.isDate(response)
                    port.postMessage({
                        has_stapling: is_date,
                        hostname: message.check_stapling
                    })
                })
        } else if (message.get_date) {
            // La popup peut aussi demander la date
            // dans ce cas envoyer la date au content si elle dépasse la limite
            checkUpdate(message.get_date)
        }
    })
})


function checkUpdate(hostname) {
    // Recuperer la date auprès de l'application native
    messaging.sendNative(hostname)
        .then(response => {
            let dep = date.treatUpdate(response, hostname)
            if (dep) {
                messaging.sendContent(dep)
            }
        })
}


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

