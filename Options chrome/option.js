function save_options()
{
  var couleur = document.getElementById('couleur').value;
  var emplacement = document.getElementById('emplacement').value;
  var affichageNotif = document.getElementById('affNotif').checked;
  chrome.storage.sync.set({
    couleurNotif: couleur,
    emplacementNotif: emplacement,
    affichageNotifPerm: affichageNotif
  }, function() {
    var status = document.getElementById('status');
    status.style.visibility = "visible";
    status.textContent = 'Modifications enregistrées';
    setTimeout(function() {
      status.textContent = '';
      status.style.visibility = "hidden";
    }, 1000);
  });
}

function restore_options() {
  // Valeur par défaut
  chrome.storage.sync.get({
    couleurNotif: '#fffff',
    emplacementNotif: 'haut_gauche',
    affichageNotifPerm: true
  }, function(items) {
    document.getElementById('emplacement').value = items.emplacementNotif;
    document.getElementById('couleur').value = items.couleurNotif;
    document.getElementById('affNotif').checked = items.affichageNotifPerm;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('enregistrer').addEventListener('click', save_options);
