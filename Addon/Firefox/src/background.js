const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')

// Variable accessible à tout le fichier
// permet de ne pas refaire la verification
// à chaque fois qu'on navigue sur le site
let serveur_precedent

// Quand la popup se connecte
browser.runtime.onConnect.addListener(port => {
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
                    let dep = date.treatUpdate(response.update, message.lim)
                    if (dep) {
                        messaging.sendContent(dep)
                    } else if (message.manual) {
                        // Si la date limite n'est pas dépassée mais que l'utilisateur
                        // a demandé manuellement une verification, demander à la popup
                        // d'afficher une confirmation
                        port.postMessage({ show_ok: true })
                    }
                }
            })
    })
})


/* // A chaque fois qu'un onglet est chargé
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
 */