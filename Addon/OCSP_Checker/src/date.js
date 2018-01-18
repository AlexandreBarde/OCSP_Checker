/**
 * Calcule le temps écoulé depuis la dernière mise
 * à jour de l'attestation
 * @param {String} str_date - date de la mise à jour
 * @return {Number} ancienneté de l'attestation en millisecondes
 */
function ocspAge(str_date, current_date) {
    let update = new Date(str_date)
    return current_date.getTime() - update.getTime()
}

/**
 * Donne la différence entre l'ancienneté critique
 * et l'ancienneté actuelle
 * @param {Number} duration
 * @param {Number} critical - Ancienneté critique
 * @returns {Number} - différence en millisecondes
 */
function timeDiff(duration, critical) {
    return duration - critical
}

/**
 * Converti une durée en milliseconds
 * @param {Number} days - Jours de la durée
 * @param {Number} hours - Heures de la durée
 * @param {Number} minutes - Minutes de la durée
 * @param {Number} seconds - Secondes de la durée
 */
function asMilliseconds(days, hours, minutes, seconds) {
    let d = days * 24 * 3600 * 1000
    let h = hours * 3600 * 1000
    let m = minutes * 60 * 1000
    let s = seconds * 1000
    return d + h + m + s
}

/**
 * Crée un objet durée en fonction
 * d'une durée en millisecondes
 * @param {Number} duration - Durée à mettre sous forme d'objet
 * @returns {Object} - Objet représentant la durée
 */
function toObject(duration) {
    let s = duration / 1000
    let days = Math.floor(s / 3600 / 24)
    let hours = Math.floor((s / 3600) - days * 24)
    let minutes = Math.floor(s / 60 - (days * 24 * 60 + hours * 60))
    let seconds = Math.floor(s - (days * 3600 * 24 + hours * 3600 + minutes * 60))
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

/**
 * Formate le temps écoulé depuis la mise à jour
 * @param {Number} duration - Durée à formatter
 * @returns {String} - durée formattée
 */
function formatDuration(duration) {
    // Recupérer la durée sous la forme d'un objet
    let date_obj = toObject(duration)
    // Rajouter un 0 devant les heures/minutes/secondes si elles n'ont qu'un chiffre
    if (date_obj.hours < 10) date_obj.hours = '0' + date_obj.hours
    if (date_obj.minutes < 10) date_obj.minutes = '0' + date_obj.minutes
    if (date_obj.seconds < 10) date_obj.seconds = '0' + date_obj.seconds
    let format = `${date_obj.hours}:${date_obj.minutes}:${date_obj.seconds}`
    // Condition vraie si la durée n'est composée que de jours
    let only_days = parseInt(date_obj.hours) === 0 && parseInt(date_obj.minutes) === 0 && parseInt(date_obj.seconds) === 0
    // Si il n'y a qu'un jour
    if (date_obj.days === 1) {
        // Si c'est le seul élément, afficher 1 jour
        if (only_days) format = '1 jour'
        // Sinon rajouter hms
        else format = `1 jour ${format}`
    } else if (date_obj.days > 1) {
        if (only_days) format = `${date_obj.days} jours`
        else format = `${date_obj.days} jours ${format}`
    }

    return format
}

/**
 * Vérifie si une chaîne de caractère est une date
 * @param {String} text - Chaîne à vérifier
 * @returns {Boolean}
 */
function isDate(text) {
    return !isNaN(new Date(text))
}

/**
 * Vérifie si l'ancienneté de l'attestation
 * dépasse l'ancienneté critique pour une
 * date et un nom d'hôte donné
 * @param {String} date_str - date de la mise à jour
 * @param {String} lim - ancienneté critique en millisecondes
 * @returns {Object | boolean} - Age de la mise à jour et dépassement si l'attestation est trop vieille
 */
function treatUpdate(date_str, lim) {
    // Calculer l'age de la mise à jour
    let age = ocspAge(date_str, new Date())
    // Calculer la différence entre l'age de la maj et l'ancienneté critique
    let diff = timeDiff(age, lim)
    // Si la différence est positive, l'ancienneté critique est dépassée
    if (diff > 0) {
        // Preparer le message a envoyer au content
        return {
            maj: formatDuration(age),
            depas: formatDuration(diff)
        }
    } else {
        return false
    }
}


module.exports = {
    ocspAge,
    formatDuration,
    isDate,
    treatUpdate,
    timeDiff,
    asMilliseconds,
    toObject
}
