const url_parser = require('./url')
const storage_manager = require('./storage')
const sendNative = require('./nativeMessaging')
const date = require('./date')
const storage = require('./storage')
const moment = require('moment')

browser.browserAction.onClicked.addListener(() => {
    sendNative('www.reddit.com').then((response) => {
        let age = date.ocspAge(response.text)
        let offset = date.timeDiff(age, '01:00:00')
        // Si la temps écoulé depuis la mise à jour dépasse le temps limite
        if (offset < 0) {
            // Afficher la date de la mise à jour et à quel point elle dépasse
            // la date limite
            let m = date.formatDuration(moment.duration(Math.abs(offset), 'milliseconds'))
            console.log(`La mise à jour est vieille de ${date.formatDuration(age)} ce qui dépasse de ${m} votre date limite`)
        }
    })
})