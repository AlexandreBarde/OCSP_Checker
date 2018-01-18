const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')
const storage = require('./storage')

// Variable accessible à tout le fichier
// permet de ne pas refaire la verification
// à chaque fois qu'on navigue sur le site
let serveur_precedent

/**
 * Envoie un message au content si
 * la limite est dépassée
 * @param update - date de la mise à jour
 * @param limit - ancienneté critique
 * @returns {boolean} - Faux si l'ancienneté est trop vieille
 */
function check_update(update, limit) {
    let dep = date.treatUpdate(update, limit)
    if (dep) {
        messaging.sendContent(dep)
    } else {
        return false;
    }
}

// Quand la popup se connecte
chrome.runtime.onConnect.addListener(port => {
    // Attendre un message de sa part
    port.onMessage.addListener(message => {
        // Dans tous les cas, on doit envoyer le nom d'hôte à l'application
        messaging.sendNative(message)
            .then(response => {
                // Si la popup a demandé que le serveur utilise OCSP Stapling
                if (message.action === 'check_stapling') {
                    let stapling_infos = {
                        has_stapling: date.isDate(response.update),
                        hostname: message.hostname
                    }
                    // Renvoyer true ou false à la popup pour le site concerné
                    port.postMessage(stapling_infos)
                } else if (message.action === 'get_date') {
                    // Si la popup a demandé la date de la dernière mise à jour
                    // Calculer le depassement de l'ancienneté critique
                    if (check_update(response.update, message.lim) === false && message.manual) {
                        port.postMessage({show_ok: true})
                    }
                }
            })
    })
})


// A chaque fois qu'un onglet est chargé
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        // Si l'onglet courant est chargé
        if (tabs[0].id === tabId && changeInfo.status === 'complete') {
            // Récuperer le nom d'hote courant
            url_parser.getCurrentHostname()
                .then(hostname => {
                    // Verifier qu'on était pas déjà sur ce site
                    if ((!serveur_precedent || serveur_precedent !== hostname) && storage.isFollowed(hostname)) {
                        serveur_precedent = hostname
                        // Envoyer l'adresse à l'application
                        messaging.sendNative({hostname: hostname})
                            .then(response => {
                                // Faire la vérification
                                check_update(response.update, storage.getCriticalSeconds(hostname))
                            })

                    }
                })
        }
    })
})
