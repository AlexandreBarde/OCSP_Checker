const ui = require('./ui')
const url_parser = require('./url')
const messaging = require('./messaging')
const date = require('./date')
const stor = require('./storage')


// Quand on ouvre la popup
// récupérer le nom d'hote
url_parser.getCurrentHostname()
    .then(hostname => {
        console.log(hostname)
        browser.runtime.sendMessage(hostname)
            .then(rep => {
                console.log(rep)
                ui.printSites()
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

// Quand on clique sur "Suivre"
ui.btn_follow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            stor.addSite(hostname, 'zidane')
            ui.showFollowed()
            ui.printSites()
        })

})
