const moment = require('moment')
const stor = require('./storage')
const moment_formatter = require('moment-duration-format')

/**
 * Calcule le temps écoulé depuis la dernière mise
 * à jour de l'attestation
 * @param {String} str_date 
 * @returns {moment.duration}
 */
function ocspAge(str_date) {
    let update = moment(str_date)
    let now = moment()
    let diff = now.diff(update)
    let duration = moment.duration(diff, 'millisecond')
    return duration
}

/**
 * Donne la différence entre l'ancienneté critique
 * et l'ancienneté actuelle
 * @param {Moment.duration} duration 
 * @param {String} critical 
 * @returns {Number}
 */
function timeDiff(duration, critical) {
    // Prendre les 2 durées en millisecondes
    let duration_ms = duration.asMilliseconds()
    let critical_ms = moment.duration({ seconds: critical }).asMilliseconds()
    // Calculer la différence entre les 2
    let difference_ms = critical_ms - duration_ms
    return difference_ms
}

/**
 * Formate le temps écoulé depuis la mise à jour
 * @param {moment.duration} duration 
 * @returns {String}
 */
function formatDuration(duration) {
    return duration.format('d [jours] HH:mm:ss')
}

function isDate(text) {
    return !isNaN(new Date(text))
}

function treatUpdate(date_str, hostname) {
    // Calculer l'age de la mise à jour
    let age = ocspAge(date_str)
    // Calculer la différence entre l'age de la maj et l'ancienneté critique
    // TODO Remplacer par la fonction de ./storage quand ça aura fini de buguer
    let dur = localStorage.getItem(hostname)
    let diff = timeDiff(age, dur)
    // Si la différence est négatif, l'ancienneté critique est dépassée
    if (diff < 0) {
        // Formatter le depassement
        let offset = formatDuration(moment.duration(Math.abs(diff)))
        // Preparer le message a envoyer au content
        let msg = {
            maj: formatDuration(age),
            depas: offset
        }
        return msg
    } else {
        return false
    }
}



module.exports = {
    ocspAge,
    timeDiff,
    formatDuration,
    isDate,
    treatUpdate
}