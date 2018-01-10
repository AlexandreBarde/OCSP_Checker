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
            ui.follow(hostname) //TODO : Durée
        })
})

// Quand on clique sur "Ne plus suivre"
ui.btn_unfollow.addEventListener('click', () => {
    url_parser.getCurrentHostname()
        .then(hostname => {
            ui.unfollow(hostname)
        })
})

//TODO marche pas encore
// Quand on clique sur "Vider la liste des sites"
/*ui.btn_unfollowall.addEventListener('click', () => {
  url_parser.getCurrentHostname()
      .then(hostname => {
          ui.unfollowall()
      })
})
*/

//TODO debug
// Quand on clique sur "Développer" pour afficher la liste des sites
ui.btn_chevron_down.addEventListener('click', () => {
  url_parser.getCurrentHostname()
      .then(hostname => {
        ui.btn_chevron_down.hidden = true;
        ui.btn_chevron_up.hidden = false;
        ui.sites_list.hidden = false;
      })
})

//TODO debug
// Quand on clique sur "Réduire" pour cacher la liste des sites
ui.btn_chevron_up.addEventListener('click', () => {
  ui.btn_chevron_down.hidden = false;
  ui.btn_chevron_up.hidden = true;
  ui.sites_list.hidden = true;
})
