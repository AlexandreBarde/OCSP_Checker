function save_options()
{
  // Récupération des différents champs
  var couleur = document.getElementById('couleur').value;
  var couleurTexte = document.getElementById('couleurTexte').value;
  var emplacement = document.getElementById('emplacement').value;
  var affichageNotif = document.getElementById('affNotif').checked;
  // Stockage dans chrome storage
  chrome.storage.sync.set({
    couleurNotif: couleur,
    emplacementNotif: emplacement,
    affichageNotifPerm: affichageNotif,
    couleurTexteNotif: couleurTexte
  }, function() {
    // Récupération du div status
    var status = document.getElementById('status');
    // On le rend visible
    status.style.visibility = "visible";
    // Affichage du status
    status.textContent = 'Modifications enregistrées';
    // Fonction timer (1 sec)
    setTimeout(function() {
      // On vide la div de son texte
      status.textContent = '';
      // On cache la div
      status.style.visibility = "hidden";
    }, 1000);
  });
}

function restore_options()
{
  // Valeur par défaut
  chrome.storage.sync.get({
    couleurNotif: '#fffff',
    couleurTexteNotif: '#fffff',
    emplacementNotif: 'haut_gauche',
    affichageNotifPerm: true
  }, function(items) {
    // Attribution des valeurs aux différents champs de la page
    document.getElementById('emplacement').value = items.emplacementNotif;
    document.getElementById('couleur').value = items.couleurNotif;
    document.getElementById('couleurTexte').value = items.couleurTexteNotif;
    document.getElementById('affNotif').checked = items.affichageNotifPerm;
  });
}

// Listener
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('enregistrer').addEventListener('click', save_options);
