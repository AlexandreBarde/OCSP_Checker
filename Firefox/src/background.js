const url_parser = require('./url')
const storage_manager = require('./storage')
const messaging = require('./messaging')
const date = require('./date')
const storage = require('./storage')
const moment = require('moment')

// Variable accessible à tout le fichier
// permet de ne pas refaire la verification
// à chaque fois qu'on navigue sur le site
let serveur_precedent

// Quand la popup se connecte
browser.runtime.onConnect.addListener(port => {
    // Attendre un message de sa part
    port.onMessage.addListener(message => {
        // Dans le cas ou on doit verifier que le site support OCSP Stapling
        if (message.check_stapling) {
            // Demander la date de la dernière mise à jour de l'attestation OCSP
            // à l'application native
            messaging.sendNative(message.check_stapling)
                .then(response => {
                    // Si on a reçu une date, OCSP Stapling est supporté
                    let is_date = date.isDate(response)
                    let stapling_infos = {
                        has_stapling: is_date,
                        hostname: message.check_stapling
                    }
                    port.postMessage(stapling_infos)
                })
        } else if (message.get_date) {
            // La popup peut aussi demander la date
            // dans ce cas envoyer la date au content si elle dépasse la limite
            checkUpdate(message.get_date)
        }
    })
})

/**
 * Envoie un nom d'hôte à l'application, et transmet
 * sa réponse au content script pour l'affichage si nécessaire
 * @param {String} hostname 
 */
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
    // Recuperer l'onglet actif
    browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
        // Verifier que ce soit bien lui qui ai été chargé
        if (changeInfo.status === 'complete' && tabId === tabs[0].id) {
            // Récuperer le nom d'hôte du serveur
            let p_hostname = url_parser.getCurrentHostname()
            p_hostname.then(hostname => {
                // Verifier qu'on ne soit pas encore sur le même serveur
                // et que le site soit suivi
                if ((typeof serveur_precedent === 'undefined' || serveur_precedent != hostname) && storage.isFollowed(hostname)) {
                    // Sauvegarder le serveur courant
                    serveur_precedent = hostname
                    checkUpdate(hostname)
                }
            })
        }
    })
})
