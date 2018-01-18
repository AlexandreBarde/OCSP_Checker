function save_options() {
  // Récupération des différents champs
  let couleur = document.getElementById('couleur').value
  let couleurPartieTexte = document.getElementById('couleurPartieTexte').value
  let couleurTexte = document.getElementById('couleurTexte').value
  let emplacement = document.getElementById('emplacement').value
  let opacite = document.getElementById('opacite').value
  let temps = document.getElementById('temps').value
  // Enregistrement de ces options
  let p_sync = new Promise((resolve, reject) => {
    chrome.storage.sync.set({
      couleurNotif: couleur,
      emplacementNotif: emplacement,
      couleurTexteNotif: couleurTexte,
      couleurPartieTexteNotif: couleurPartieTexte,
      tempsNotif: temps,
      opaciteNotif: opacite
    }, () => {
      resolve()
    })
  })

  // Quand les options ont bien été enregistrées, avertir l'utilisateur
  p_sync.then(() => {
    let status = document.getElementById('status')
    status.hidden = false
    status.textContent = 'Modifications enregistrées'
    setTimeout(() => {
      status.textContent = ''
      status.hidden = true
    }, 1000)
  })
}

function restore_options() {

  let p_opts = new Promise((resolve, reject) => {
    // Valeur par défaut
    chrome.storage.sync.get({
      couleurNotif: '#fffff',
      couleurTexteNotif: '#fffff',
      couleurPartieTexteNotif: 'black',
      emplacementNotif: 'haut_gauche',
      opaciteNotif: "95",
      temps: 2,
    }, items => {
      resolve(items)
    })
  })

  p_opts.then(items => {
    document.getElementById('emplacement').value = items.emplacementNotif
    document.getElementById('couleur').value = items.couleurNotif
    document.getElementById('opacite').value = items.opaciteNotif
    document.getElementById('couleurPartieTexte').value = items.couleurPartieTexteNotif
    document.getElementById('couleurTexte').value = items.couleurTexteNotif
    document.getElementById('temps').value = items.temps
  })
}

// Listener
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('enregistrer').addEventListener('click', save_options)