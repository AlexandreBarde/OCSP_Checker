const ui = require('./ui')
const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')

// Quand on clique sur suivre
ui.btn_follow.addEventListener('click', () => {
    // Desactiver le bouton et afficher un chargement
    console.log('Chargement...')
    // Recuperer le nom d'hote courant
    url_parser.getCurrentHostname()
        // Puis l'envoyer au background script
        .then((hostname) => {
            browser.runtime.sendMessage(hostname)
                // Quand il a répondu
                .then((rep) => {
                    // Verifier que le site supporte l'OCSP Stapling
                    if (date.isDate(rep.text)) {
                        // OCSP Stapling activé
                        // Suivre le site et afficher la date
                    } else {
                        // Désactivé
                        // Avertir l'utilisateur qu'il ne peut pas
                        // suivre le site
                    }
                })
        })
})