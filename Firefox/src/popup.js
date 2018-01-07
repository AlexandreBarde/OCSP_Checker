const ui = require('./ui')
const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')

// Quand on ouvre la popup
// récupérer le nom d'hote
url_parser.getCurrentHostname()
    .then((hostname) => {
        console.log(hostname)
        browser.runtime.sendMessage(hostname)
            .then((rep) => {
                console.log(rep)
                // Si le site n'utilise pas OCSP Stapling
                if (!date.isDate(rep.text)) {
                    // Ne pas afficher la div permettant de le suivre
                    ui.showDisabled()
                } else {
                    // Sinon donner la possibilité de suivre
                    ui.showUnfollowed()
                }
            })
    })