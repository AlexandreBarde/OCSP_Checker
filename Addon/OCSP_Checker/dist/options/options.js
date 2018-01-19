/**
 * Enregistre les options de la notification
 */
function save_options() {
  // Récupération des différents champs
  let couleur = document.getElementById('couleur').value
  let couleurPartieTexte = document.getElementById('couleurPartieTexte').value
  let couleurTexte = document.getElementById('couleurTexte').value
  let emplacement = document.getElementById('emplacement').value
  let opacite = document.getElementById('opacite').value
  let temps = document.getElementById('temps').value
  // Enregistrement de ces options
  let p_sync = new Promise((resolve) => {
    chrome.storage.sync.set({
      title_color: couleur,
      position: emplacement,
      text_color: couleurTexte,
      color: couleurPartieTexte,
      duration: temps,
      opacity: opacite
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

/**
 * Récupère les options de l'utilisateur pour en donner
 * les valeurs au champs
 */
function restore_options() {
  let p_opts = new Promise((resolve) => {
    // Valeur par défaut
    chrome.storage.sync.get({
      title_color: '#db4030',
      text_color: '#ecf0f1',
      color: '#c0392b',
      position: 'haut_gauche',
      opacity: 95,
      duration: 3,
    }, items => {
      resolve(items)
    })
  })

  p_opts.then(items => {
    document.getElementById('emplacement').value = items.position
    document.getElementById('couleur').value = items.title_color
    document.getElementById('opacite').value = items.opacity
    document.getElementById('couleurPartieTexte').value = items.color
    document.getElementById('couleurTexte').value = items.text_color
    document.getElementById('temps').value = items.duration
  })
}

// Listener
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('enregistrer').addEventListener('click', save_options)
