const storage = require('./storage')
const url_parser = require('./url')

let btn_follow = document.getElementById('follow')
let btn_unfollow = document.getElementById('unfollow')
var followed = document.getElementById('followed')
var unfollowed = document.getElementById('unfollowed')
var sites_list = document.getElementById('sites')

/**
 * Affiche la liste des sites dans un tableau
 */
function printSites() {
    if (storage.isAvailable()) {
        let row = sites_list.insertRow(0)
        if (storage.isEmpty()) {
            row.insertCell(0).innerHTML += "Aucun site suivi.";
        } else {
            for (let i = 0; i < storage.getLength(); i++) {
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
 * Ajoute un site dans la liste
 * @param {String} site 
 */
function follow(site) {
    storage.addSite(site, '12 jours')
    showFollowed()
    console.log(localStorage)
}

/**
 * Retire un site de la liste
 * @param {String} site 
 */
function unfollow(site) {
    storage.removeSite(site)
    showUnfollowed()
    console.log(localStorage)
}

/**
 * Affiche que le site est suivi
 */
function showFollowed() {
    followed.classList.remove('hidden')
    unfollowed.classList.add('hidden')
}

/**
 * Affiche que le site n'est pas suivi
 */
function showUnfollowed() {
    followed.classList.add('hidden')
    unfollowed.classList.remove('hidden')
}

module.exports = {
    printSites,
    btn_follow,
    btn_unfollow,
    showFollowed,
    showUnfollowed,
    follow,
    unfollow
}