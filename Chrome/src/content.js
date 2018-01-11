chrome.runtime.onMessage.addListener(message => {
    showDate(message.maj, message.depas);
});

function showDate(miseajour, depassement)
{

  var couleur_titre = 'pink';
  var couleur_texte = 'black';
  var couleur_partie_texte = 'red';
  var opacite_notif = '95';
  var position_notif_stockage = 'haut_gauche';
  var position_notif = '';
  var temps_affichage = 3;

  chrome.storage.sync.get({
    couleurNotif: 'pink',
    couleurTexteNotif: 'black',
    couleurPartieTexteNotif: 'red',
    emplacementNotif: 'haut_gauche',
    opaciteNotif: "95",
    tempsNotif: 3,
    affichageNotifPerm: true
  }, function(items) {
    // Attribution des valeurs aux variables
    opacite_notif = items.opaciteNotif;
    couleur_titre = items.couleurNotif;
    couleur_texte = items.couleurTexteNotif;
    couleur_partie_texte = items.couleurPartieTexteNotif;
    position_notif_stockage = items.emplacementNotif;
    temps_affichage = items.tempsNotif;
  });

  alert(opacite_notif);
  alert(couleur_titre);
  alert(couleur_texte);
  alert(couleur_partie_texte);
  alert(position_notif_stockage);
  alert(temps_affichage);

  switch (position_notif_stockage)
  {
  case "bas_droite":
    position_notif = 'bottom: 5%; right: 3%;';
    break;
  case "bas_gauche":
    position_notif = 'bottom: 5%; left: 3%;';
    break;
  case "haut_droite":
    position_notif = 'top: 5%; right: 3%;';
    break;
  case "haut_gauche":
    position_notif = 'top: 5%; left: 3%;';
    break;
  }

  var node = document.createElement('style');
  document.body.appendChild(node);
  window.addStyleString = function(str)
  {
    node.innerHTML = str;
  };
  addStyleString('#OCSP_check_div_titre {\
                 border-radius: 4px 4px 0px 0px;\
                 background-color: ' + couleur_titre + ';\
                 font-weight: bold; text-align: center;\
                 font-size: 20px; border: 0px;\
                 opacity: 0.' + opacite_notif + ';\
                 padding: 0px; margin-bottom: 0;\
                 color: ' + couleur_texte + ';\
                }\
                #OCSP_check_div_texte {\
                 background-color: ' + couleur_partie_texte + ';\
                 border-radius: 0px 0px 4px 4px;\
                 opacity: 0.' + opacite_notif + ';\
                 font-size: 18px;\
                 font-family: Arial;\
                 color: ' + couleur_texte + ';\
                }\
                #OCSP_check_div_notif {\
                 width: 400px;\
                 height: 100px;\
                 z-index: 9999;\
                 opacity: 0.' + opacite_notif + ';\
                 position: fixed;\
                 ' + position_notif + '\
                 font-family: NULL;\
                 font-family: Arial;\
                 color: ' + couleur_texte + ';\
               }\
               #OCSP_circle {\
                background-color: ' + couleur_partie_texte + ';\
                visibility: hidden;\
                width: 50px;\
                height: 50px;\
                z-index: 9999;\
                border-radius: 50%;\
                position: fixed;\
                ' + position_notif + '\
                font-family: NULL;\
                font-family: Arial;\
                color: ' + couleur_texte + ';\
                cursor: pointer;\
              }\
              #OCSP_circle:hover\
              {\
                width: 52px;\
                height: 52px;\
                bottom: 4.9%;\
                left: 2.9%;\
              }');
  div_notif = document.createElement('div');
  div_titre = document.createElement('div');
  var div_texte = document.createElement('div');
  div_notif.id = "OCSP_check_div_notif";
  div_titre.id = "OCSP_check_div_titre";
  div_texte.id = "OCSP_check_div_texte";
  div_titre.textContent = "Attestation OCSP trop ancienne";
  var depas = document.createElement('p');
  var maj = document.createElement('p');
  depas.id = "OCSP_check_texte";
  maj.id = "OCSP_check_texte";
  maj.textContent = "Dernière mise à jour : " + miseajour;
  depas.textContent = "Dépassement : " + depassement;
  div_texte.appendChild(maj);
  div_texte.appendChild(depas);
  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);
  document.body.appendChild(div_notif);
  // Montrer la notification
  showNotif();
  // La cacher après un temps défini dans les paramètres
  setTimeout(hideNotif, temps_affichage*1000);
}

function showNotif() {
  div_notif.style.visibility = "visible";
}

function hideNotif() {
  div_notif.style.visibility = "hidden";
}
