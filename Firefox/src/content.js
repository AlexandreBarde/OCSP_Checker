browser.runtime.onMessage.addListener(message => {
  showDate(message.maj, message.depas)
});

var div_notif

function showDate(miseajour, depassement) {
  alert('kek')
  // Créer les elements HTML de la notif
  div_notif = document.createElement('div')
  let div_titre = document.createElement('div')
  let div_texte = document.createElement('div')
  let txt = document.createElement('p')
  div_notif.id = "OCSP_check_div_notif"
  div_titre.id = "OCSP_check_div_titre"
  div_texte.id = "OCSP_check_div_texte"
  depas.id = "OCSP_check_texte"
  maj.id = "OCSP_check_texte"
  // Mettre en place la structure
  div_texte.appendChild(maj)
  div_texte.appendChild(depas)
  div_notif.appendChild(div_titre)
  div_notif.appendChild(div_texte)
  document.body.appendChild(div_notif)
  // Ecrire les informations statiques
  div_titre.textContent = "Attestation OCSP trop ancienne"

  // Recuperer les valeurs des options
  let p_opts = browser.storage.sync.get({
    couleurNotif: 'red',
    couleurTexteNotif: 'black',
    couleurPartieTexteNotif: 'red',
    emplacementNotif: 'haut_gauche',
    opaciteNotif: "95",
    tempsNotif: 3,
  })

  // Une fois les options chargées, les prendre en compte
  p_opts.then(params => {
    let emplacement_notif_stockage = params.emplacementNotif
    // Donner les couleurs aux elements
    div_titre.style.backgroundColor = params.couleurNotif
    div_texte.style.backgroundColor = params.couleurPartieNotif
    div_texte.style.opacity = `0.${params.opaciteNotif}`
    txt.style.color = params.couleurTexteNotif
    let top, bottom, left, right
    switch (position_notif_stockage) {
      case 'bas_droite':
        bottom = '5%'
        right = '3%'
        break;
      case "bas_gauche":
        bottom = '5%'
        left = '3%'
        break;
      case "haut_droite":
        top = '5%'
        right = '3%'
        break;
      case "haut_gauche":
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
      div_notif.style.left = top
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
