const moment = require('moment')
const moment_formatter = require('moment-duration-format')

/**
 * Calcule le temps écoulé depuis la dernière mise
 * à jour de l'attestation
 * @param {String} str_date 
 * @returns {moment.duration}
 */
function ocspAge(str_date) {
    let update = buildMoment(str_date)
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
    let critical_ms = moment.duration(critical).asMilliseconds()
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

/**
 * Construit une date depuis le string
 * renvoyé par l'application native
 * @param {String} str_date 
 * @returns {moment}
 */
function buildMoment(str_date) {
    // Retirer le "UTC"
    let d = str_date.replace('UTC ', '')
    return moment(d, 'MMM DD HH:mm:ss YYYY')
}

function isDate(text) {
    return !isNaN(new Date(text))
}

module.exports = {
    ocspAge,
    timeDiff,
    formatDuration,
    isDate
}