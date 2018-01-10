const url_parser = require('./url')
const storage_manager = require('./storage')
const messaging = require('./messaging')
const date = require('./date')
const storage = require('./storage')
const moment = require('moment')


// Ecouter les message de la popup
browser.runtime.onMessage.addListener((request, sender, response) => {
    // Renvoyer à la popup la promesse contenant la réponse
    response(messaging.sendNative(request))
})


/* browser.browserAction.onClicked.addListener(() => {
    // Recuperer le nom d'hote de la page courante
    let p_hostname = url_parser.getCurrentHostname()
    // Quand le nom est récupéré, l'envoyer à l'application native
    p_hostname.then((hostname) => {
        let p_date = sendNative(hostname)
        // Quand l'application a répondu, calculer l'age de la maj
        p_date.then((response) => {
            let age = date.ocspAge(response.text)
            // Calculer la différence entre l'anciennete de la maj
            // et l'ancienneté critique pour ce site
            let offset = date.timeDiff(age, '01:00:00')
            // Si la temps écoulé depuis la mise à jour dépasse le temps limite
            if (offset < 0) {
                // Afficher l'age de la date et à quel point elle dépasse la limite
                let exc = date.formatDuration(moment.duration(Math.abs(offset), 'milliseconds'))
                console.log(`Dépassement de ${exc}.\nL'attestation a ${date.formatDuration(age)}`)
            }

        })
    })
}) */