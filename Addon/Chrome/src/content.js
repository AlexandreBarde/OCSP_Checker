chrome.runtime.onMessage.addListener(message => {
    showDate(message.maj, message.depas)
});


let div_notif

function showDate(miseajour, depassement) {
    // Créer les elements HTML de la notif
    div_notif = document.createElement('div')
    let div_titre = document.createElement('div')
    let div_texte = document.createElement('div')
    let maj = document.createElement('p')
    let depas = document.createElement('p')
    div_notif.id = 'OCSP_check_div_notif'
    div_titre.id = 'OCSP_check_div_titre'
    div_texte.id = 'OCSP_check_div_texte'
    maj.classList.add('texte')
    depas.classList.add('texte')
    // Mettre en place la structure
    div_notif.appendChild(div_titre)
    div_notif.appendChild(div_texte)
    div_texte.appendChild(maj)
    div_texte.appendChild(depas)
    document.body.appendChild(div_notif)
    // Ecrire les informations ne dépendant pas des options
    div_titre.textContent = 'Attestation OCSP trop ancienne'
    maj.textContent = `Mise à jour: ${miseajour}`
    depas.textContent = `Depassement: ${depassement}`

    // Recuperer les valeurs des options
    let p_opts = new Promise((resolve) => {
        chrome.storage.sync.get({
            couleurNotif: 'red',
            couleurTexteNotif: 'black',
            couleurPartieTexteNotif: 'red',
            emplacementNotif: 'haut_gauche',
            opaciteNotif: '95',
            tempsNotif: 3,
        }, items => {
            resolve(items)
        })
    })

    // Une fois les options chargées, les prendre en compte
    p_opts.then(items => {
        let emplacement_notif_stockage = items.emplacementNotif
        let temps_affichage = items.temps_affichage = items.tempsNotif
        // Donner les couleurs aux elements
        div_titre.style.backgroundColor = items.couleurNotif
        div_texte.style.backgroundColor = items.couleurPartieTexteNotif
        div_texte.style.opacity = '' + items.opaciteNotif / 100
        maj.style.color = items.couleurTexteNotif
        depas.style.color = items.couleurTexteNotif
        let top, bottom, left, right
        switch (emplacement_notif_stockage) {
            case 'bas_droite':
                bottom = '5%'
                right = '3%'
                break;
            case 'bas_gauche':
                bottom = '5%'
                left = '3%'
                break;
            case 'haut_droite':
                top = '5%'
                right = '3%'
                break;
            case 'haut_gauche':
                top = '5%'
                left = '3%'
                break;
        }
        if (top)
            div_notif.style.top = top
        if (bottom)
            div_notif.style.bottom = bottom
        if (left)
            div_notif.style.left = left
        if (right)
            div_notif.style.right = right
        // Montrer la notification
        showNotif();
        // La cacher après un temps défini dans les paramètres
        setTimeout(hideNotif, temps_affichage * 1000);
    })


}

function showNotif() {
    div_notif.hidden = false
}

function hideNotif() {
    div_notif.hidden = true
}
