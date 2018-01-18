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
 * Formate le temps écoulé depuis la mise à jour
 * @param {moment.duration} duration
 * @returns {String} - date formattée
 */
function formatDuration(duration) {
    let s = duration / 1000
    let days = Math.floor(s / 3600 / 24)
    let hours = Math.floor((s / 3600) - days * 24)
    let minutes = Math.floor(s / 60 - (days * 24 * 60 + hours * 60))
    let seconds = s - (days * 3600 * 24 + hours * 3600 + minutes * 60)

    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds
    let format = `${hours}:${minutes}:${seconds}`
    let only_days = hours == 0 && minutes == 0 && seconds == 0
    if (days > 0) {
        if (days === 1) {
            if (only_days) {
                format = `${days} jour`
            } else {
                format = `${days} jour ${format}`
            }
        }
        else {
            if (only_days) {
                format = `${days} jours`
            } else {
                format = `${days} jours ${format}`
            }
        }
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
 * @param {String} lim - ancienneté critique
 * @returns {Object | boolean} - Age de la mise à jour et dépassement si l'attestation est trop vieille
 */
function treatUpdate(date_str, lim) {
    // Calculer l'age de la mise à jour
    let age = ocspAge(date_str, new Date())
    // Calculer la différence entre l'age de la maj et l'ancienneté critique
    let diff = timeDiff(age, lim)
    // Si la différence est négative, l'ancienneté critique est dépassée
    if (diff < 0) {
        // Formatter le depassement
        let offset = formatDuration(Math.abs(diff))
        // Preparer le message a envoyer au content
        return {
            maj: formatDuration(age),
            depas: offset
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
    timeDiff
}
