var port = browser.runtime.connectNative("date_getter");

// Quand on clique sur l'icone
browser.browserAction.onClicked.addListener(() => {
    console.log("Envoi de l'url");
    // Envoyer un message sur le port
    port.postMessage("google.com");
});

// Attends un message sur le port d'écoute
port.onMessage.addListener((response) => {
    console.log('Recu');
    console.log(response);
    generatePopup(response, "2");
});

//generatePopup(reponse, "2");

var node = document.createElement('style');
document.body.appendChild(node);
window.addStyleString = function(str) {
    node.innerHTML = str;
};

addStyleString('#OCSP_check_div_titre { border-radius: 4px 4px 0px 0px; background-color: rgba(207, 0, 15, 1); font-weight: bold; text-align: center; font-size: 20px; border: 0px; padding: 0px; margin-bottom: 0;} #OCSP_check_div_texte {background-color: rgba(217, 30, 24, 0.9); border-radius: 0px 0px 4px 4px; font-size: 18px; font-family: Arial; color: black;} #OCSP_check_div_notif { width: 400px; height: 100px; z-index: 9999; position: fixed; bottom: 5%; left: 3%; font-family: NULL; font-family: Arial; color: black;}');

/**
 * Permite to generate a popup with many informations
 * @param website name of the website
 * @param update last update of the OCSP cache
 * @param date seniority of the certificate
 */
function generatePopup(update, date)
{
  var div_notif = document.createElement('div');
  var div_titre = document.createElement('div');
  var div_texte = document.createElement('div');

  div_notif.id = "OCSP_check_div_notif";
  div_titre.id = "OCSP_check_div_titre";
  div_texte.id = "OCSP_check_div_texte";

  div_titre.textContent = "Attestation OCSP trop ancienne";


  if(isSecure())
  {
    var anciennete = document.createElement('p');
    var maj = document.createElement('p');
    anciennete.id = "OCSP_check_anciennete";
    maj.id = "OCSP_check_maj";
    anciennete.textContent = "Date limite dépassée de " + date + " jours"; //12h:35m:23s
    maj.textContent = " L'Attestation a " + update; //24 octobre 2017 à 14h
    div_texte.appendChild(anciennete);
    div_texte.appendChild(maj);
  }
  else
  {
    var texte = document.createElement('p');
    texte.textContent = "Ce site ne possède pas de certificat";
    div_texte.appendChild(texte);
  }

  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);

  document.body.appendChild(div_notif);

}

/**
 * Permite to know if the website is secure
 * @returns {boolean} if the website use the SSL protocol
 */
function isSecure()
{
  if(location.protocol == 'https:')
  {
    return true;
  }
  else
  {
    return false;
  }
}
