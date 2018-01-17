const storage = require('./storage')

// Boutons

// Suivre le site
let btn_follow = document.getElementById('follow')
// Ne plus suivre
let btn_unfollow = document.getElementById('unfollow')
// Afficher la liste des sites
let btn_chevron_down = document.getElementById('chevron-down')
// Cacher la liste
let btn_chevron_up = document.getElementById('chevron-up')
// Vider la liste
let btn_unfollowall = document.getElementById('unfollowall')
// Confirmer la modification
let btn_modif_done = document.getElementById('modif_done')
// Refaire la vérification
let btn_refresh = document.getElementById('refresh')

// Autres éléments

// Le site est suivi
let followed = document.getElementById('followed')
// OCSP Stapling est désactivé
let no_stapling = document.getElementById('no_stapling')
// Le site n'est pas suivi
let unfollowed = document.getElementById('unfollowed')
// Liste des sites suivis
let sites_list = document.getElementById('sites')
// Champs de modification
let div_modif = document.getElementById('modif_site')
// Erreur lors de l'ajout
let add_err = document.getElementById('add_err')
// Erreur lors de la modification
let modif_err = document.getElementById('modif_err')
// Message de confirmation quand on vérifie le site manuellement
let check = document.getElementById('check')

/**
 * Affiche la liste des sites dans un tableau
 */
function printSites() {
    if (storage.isAvailable()) {
        // Vide l'ancien tableau
        clear()

        let row = sites_list.insertRow(0);

        if (storage.isEmpty()) {
            row.insertCell(0).innerHTML += 'Aucun site suivi.';
            row.insertCell(1).innerHTML += '';
            row.insertCell(2).innerHTML += '';
        } else {
            for (let i = 0; i < storage.getLength(); i++) {
                let hostname = storage.getHostname(i)
                let critical_age = storage.getCriticalAge(hostname)
                row.insertCell(0).innerHTML += hostname
                row.insertCell(1).innerHTML += critical_age
                row.insertCell(2).innerHTML += iconsWithId(hostname)
                row = sites_list.insertRow(0);
            }
        }

        row = sites_list.insertRow(0);
        row.insertCell(0).innerHTML += '<b>Site</b>'
        row.insertCell(1).innerHTML += '<b>Ancienneté critique</b>'
        row.insertCell(2).innerHTML += ''

    } else {
        storage.isUnavailableError()
    }
}

/**
 * Renvoie le string permettant d'ajouter les icônes de modification et de suppression
 */
function iconsWithId(site) {
    return '<i class="fa fa-pencil edit edit_site" id="' + site + '">\</i> <i class="fa fa-remove edit delete_site" id="' + site + '"></i>'
}

/**
 * Vide la tableau
 */
function clear() {
    sites_list.innerHTML = '';
}

/**
 * Ajoute un site dans la liste
 * @param {String} site - nom d'hôte du site à ajouter
 * @param {Number} duree - ancienneté critique en secondes
 */
function follow(site, duree) {
    storage.addSite(site, duree)
    showFollowed()
    printSites()
}

/**
 * Retire un site de la liste
 * @param {String} site - nom d'hôte du site à retirer
 */
function unfollow(site) {
    storage.removeSite(site)
    showUnfollowed()
    printSites()
}

/**
 * Retire tous les sites de la liste
 */
function unfollowAllSites() {
    storage.removeAllSites()
    printSites()
}

/**
 * Affiche que le site est suivi
 */
function showFollowed() {
    followed.hidden = false
    unfollowed.hidden = true
    no_stapling.hidden = true
    div_modif.hidden = true

}

/**
 * Affiche que le site n'est pas suivi
 */
function showUnfollowed() {
    followed.hidden = true
    no_stapling.hidden = true
    unfollowed.hidden = false
    div_modif.hidden = true
}

/**
 * Affiche que le site n'utilise pas OCSP Stapling
 */
function showDisabled() {
    followed.hidden = true
    unfollowed.hidden = true
    no_stapling.hidden = false
    div_modif.hidden = true
}

/**
 * Affiche les champs de modification
 */
function showModif() {
    // Cacher la div courant (suivi/non suivi)
    followed.hidden = true
    unfollowed.hidden = true
    unfollowed.hidden = true
    div_modif.hidden = false


}

/**
 * Afficher l'erreur lors de l'ajout d'une durée invalide
 */
function showAddWarning() {
    add_err.hidden = false
}

/**
 * Afficher l'erreur lors de la modification d'une durée invalide
 */
function showModifWarning() {
    modif_err.hidden = false
}

module.exports = {
    printSites,
    unfollowAllSites,
    showFollowed,
    showUnfollowed,
    showDisabled,
    showModif,
    follow,
    unfollow,
    showAddWarning,
    showModifWarning,
    btn_follow,
    btn_unfollow,
    btn_unfollowall,
    btn_chevron_down,
    btn_chevron_up,
    btn_modif_done,
    sites_list,
    div_modif,
    btn_refresh,
    check
}
