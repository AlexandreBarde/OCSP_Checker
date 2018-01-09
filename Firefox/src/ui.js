const storage = require('./storage')
const url_parser = require('./url')

let btn_follow = document.getElementById('follow')
let btn_unfollow = document.getElementById('unfollow')
let btn_unfollowall = document.getElementById('unfollowall')
var followed = document.getElementById('followed')
var no_stapling = document.getElementById('no_stapling')
var unfollowed = document.getElementById('unfollowed')
var sites_list = document.getElementById('sites')

/**
 * Affiche la liste des sites dans un tableau
 */
function printSites() {
    if (storage.isAvailable()) {
        // Vide l'ancien tableau
        clear()

        if (storage.isEmpty()) {
            row.insertCell(0).innerHTML += "Aucun site suivi.";
        } else {
            for (let i = 0; i < storage.getLength(); i++) {
                let row = sites_list.insertRow(-1)
                let hostname = storage.getHostname(i)
                let critical_age = storage.getCriticalAge(hostname)
                row.insertCell(0).innerHTML += hostname
                row.insertCell(1).innerHTML += critical_age
            }
        }
    } else {
        storageUnavailableError()
    }
}

/**
 * Vide la tableau
 */
function clear() {
    sites_list.innerHTML = '';
}

/**
 * Ajoute un site dans la liste
 * @param {String} site
 */
function follow(site) { //TODO: Durée
    storage.addSite(site, '12 jours')
    showFollowed()
    printSites()
    console.log(localStorage)
}

/**
 * Retire un site de la liste
 * @param {String} site
 */
function unfollow(site) {
    storage.removeSite(site)
    showUnfollowed()
    printSites()
    console.log(localStorage)
}

/**
 * Retire tous les sites de la liste
 */
function unfollowall() {
    storage.removeAllSites()
    showUnfollowed()
    printSites()
    console.log(localStorage)
}

/**
 * Affiche que le site est suivi
 */
function showFollowed() {
    followed.hidden = false
    unfollowed.hidden = true
    no_stapling.hidden = true
}

/**
 * Affiche que le site n'est pas suivi
 */
function showUnfollowed() {
    followed.hidden = true
    no_stapling.hidden = true
    unfollowed.hidden = false
}

function showDisabled() {
    followed.hidden = true
    unfollowed.hidden = true
    no_stapling.hidden = false
}

module.exports = {
    printSites,
    btn_follow,
    btn_unfollow,
    showFollowed,
    showUnfollowed,
    showDisabled,
    follow,
    unfollow
}
