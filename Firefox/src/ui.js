const storage = require('./storage')
const url_parser = require('./url')

// Boutons
let btn_follow = document.getElementById('follow')
let btn_unfollow = document.getElementById('unfollow')
var btn_chevron_down = document.getElementById('chevron-down')
var btn_chevron_up = document.getElementById('chevron-up')
//TODO: var btn_unfollowall = document.getElementById('unfollowall')

// Autres éléments
var followed = document.getElementById('followed')
var no_stapling = document.getElementById('no_stapling')
var unfollowed = document.getElementById('unfollowed')
var sites_list = document.getElementById('sites')
//Oui c'est pas beau mais je fais comment moi ?
// TODO ajouter id pour éditer/supprimer le site en question
var edit_site = "<i class=\"fa fa-pencil edit\"></i> <i class=\"fa fa-remove edit\"></i>"

/**
 * Affiche la liste des sites dans un tableau
 */
function printSites() {
    if (storage.isAvailable()) {
        // Vide l'ancien tableau
        clear()

        let row = sites_list.insertRow(0);

        if (storage.isEmpty()) {
            row.insertCell(0).innerHTML += "Aucun site suivi.";
        } else {
            for (let i = 0; i < storage.getLength(); i++) {
                let hostname = storage.getHostname(i)
                let critical_age = storage.getCriticalAge(hostname)
                row.insertCell(0).innerHTML += hostname
                row.insertCell(1).innerHTML += critical_age
                row.insertCell(2).innerHTML += edit_site
                row = sites_list.insertRow(0);
            }
        }

        //TODO: Entête du tableau direct dans le html
        row = sites_list.insertRow(0);
        row.insertCell(0).innerHTML += "<b>Site</b>"
        row.insertCell(1).innerHTML += "<b>Ancienneté critique</b>"
        row.insertCell(2).innerHTML += ""

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
    btn_chevron_down,
    btn_chevron_up,
    sites_list,
    showFollowed,
    showUnfollowed,
    showDisabled,
    follow,
    unfollow
}
