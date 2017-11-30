var node = document.createElement('style');
document.body.appendChild(node);
window.addStyleString = function(str) {
    node.innerHTML = str;
};

addStyleString('#OCSP_check_div_titre { border-radius: 4px 4px 0px 0px; background-color: rgba(207, 0, 15, 1); font-weight: bold; text-align: center; font-size: 20px; border: 0px; padding: 0px; margin-bottom: 0;} #OCSP_check_div_texte {background-color: rgba(217, 30, 24, 0.9); border-radius: 0px 0px 4px 4px; font-size: 18px; font-family: Arial; color: black;} #OCSP_check_div_notif { width: 400px; height: 100px; z-index: 9999; position: fixed; bottom: 5%; left: 3%; font-family: NULL; font-family: Arial; color: black;}');

/**
* Generate a popup from parameters
 * @param website name of the website
 * @param update last update of the OCSP cache
 * @param date seniority of the certificate
 */
function generatePopup(date)
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
    anciennete.textContent = "Date de la dernière mise à jour: " + date;
    div_texte.appendChild(anciennete);
  }
  else
  {
    var texte = document.createElement('p');
    texte.textContent = "Ce site ne possède pas de certificat SSL";
    div_texte.appendChild(texte);
  }

  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);

  document.body.appendChild(div_notif);
}

function generateErreur()
{
  var div_notif = document.createElement('div');
  var div_titre = document.createElement('div');
  var div_texte = document.createElement('div');

  div_notif.id = "OCSP_check_div_notif";
  div_titre.id = "OCSP_check_div_titre";
  div_texte.id = "OCSP_check_div_texte";

  div_titre.textContent = "Information";

  var texte = document.createElement('p');
  texte.textContent = "Le site n\'utilise pas OCSP Stapling";
  div_texte.appendChild(texte);

  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);

  document.body.appendChild(div_notif);
}


/**
 * Queries the sites protocol
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

/**
* Create a popup notification from incoming message
* @param msg received message
*/
function handleMessage(msg) {
    if (msg.date.length == 1)
	generateErreur();
    else
	generatePopup(msg.date);
}

// Port de connexion au script de background
var port = chrome.runtime.connect({name: "conn1"});
// Ecouter les messages sur le port
port.onMessage.addListener(handleMessage);

// Adresse du serveur
var url = 'google.com';

// Envoi de l'adresse au background script
// Cet appel devrai être fait automatiquement quand on visite un site de la liste.
port.postMessage({url: url});
