/**
 * Quand le content reçoit un message du background script,
 * il doit toujours l'afficher. Le message contient un objet JSON:
 * {
 *  maj: Age de la mise à jour,
 *  depas: A quel point la mise à jour dépasse la duree critique
 * }
 *
 */
browser.runtime.onMessage.addListener(message => {
    alert("Dernière maj : " + message.maj);
    alert("Dépassement : " + message.depas);
    showDate(message.maj, message.depas);
});

function showDate(miseajour, depassement)
{
  alert(miseajour + " " + depassement);
  var node = document.createElement('style');
  document.body.appendChild(node);
  window.addStyleString = function(str)
  {
    node.innerHTML = str;
  };
  addStyleString('#OCSP_check_div_titre {\
                 border-radius: 4px 4px 0px 0px;\
                 background-color: rgba(207, 0, 15, 1);\
                 font-weight: bold; text-align: center;\
                 font-size: 20px; border: 0px;\
                 padding: 0px; margin-bottom: 0;\
                }\
                #OCSP_check_div_texte {\
                 background-color: rgba(217, 30, 24, 0.9);\
                 border-radius: 0px 0px 4px 4px;\
                 font-size: 18px;\
                 font-family: Arial;\
                 color: black;\
                }\
                #OCSP_check_div_notif {\
                 width: 400px;\
                 height: 100px;\
                 z-index: 9999;\
                 position: fixed;\
                 bottom: 5%;\
                 left: 3%;\
                 font-family: NULL;\
                 font-family: Arial;\
                 color: black;\
               }\
               #OCSP_circle {\
                background-color: rgba(217, 30, 24, 0.9);\
                visibility: hidden;\
                width: 50px;\
                height: 50px;\
                z-index: 9999;\
                border-radius: 50%;\
                position: fixed;\
                bottom: 5%;\
                left: 3%;\
                font-family: NULL;\
                font-family: Arial;\
                color: black;\
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
  setTimeout(hideNotif, 3000);
}

function showNotif() {
  div_notif.style.visibility = "visible";
}

function hideNotif() {
  div_notif.style.visibility = "hidden";
}
