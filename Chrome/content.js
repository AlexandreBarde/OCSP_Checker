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

  //Date actuelle
  dateNow = new Date();
  //Split de la date mise en paramètre
  dateTab = date.split(" ");
  //On récupère la partie des heures
  dateHeure = dateTab[2];
  //Split de la partie des heures
  dateHeure = dateHeure.split(":");
  //Transformation des mois (ang) en chiffres /!\ TODO /!\
  switch (dateTab[0])
  {
    case "Jan":
      month = "0";
      break;
    case "Feb":
      month = "01";
      break;
    case "Mar":
      month = "02";
      break;
    case "Apr":
      month = "03";
      break;
    case "May":
      month = "04";
      break;
    case "Jun":
      month = "05";
      break;
    case "Jul":
      month = "06";
      break;
    case "Aug":
      month = "07";
      break;
    case "Sep":
      month = "08";
      break;
    case "Oct":
      month = "09";
      break;
    case "Nov":
      month = "10";
      break;
    case "Dec":
      month = "11";
      break;
    default:
      break;
  }
  //Création d'une nouvelle date
  dateConvert = new Date();
  //Attribution des valeurs de la date passée en paramètre dans notre nouvelle date
  dateConvert.setDate(dateTab[1]);
  dateConvert.setFullYear(dateTab[3]);
  dateConvert.setHours(dateHeure[0]);
  dateConvert.setMinutes(dateHeure[1]);
  dateConvert.setSeconds(dateHeure[2]);
  dateConvert.setMonth(month);
  //On créer une nouvelle date qui est la différence entre les 2 dates
  dateBetween = new Date(dateNow - dateConvert);
  //Debug
  console.log("Date actuelle : " + dateNow.getDate() + "/" + (dateNow.getMonth()+1) + "/" + dateNow.getFullYear() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds());
  console.log("Date OCSP : " + dateConvert.getDate() + "/" + (dateConvert.getMonth()+1) + "/" + dateConvert.getFullYear() + " " + dateConvert.getHours() + ":" + dateConvert.getMinutes() + ":" + dateConvert.getSeconds());
  console.log("Date : " + dateBetween.getMonth() + " mois " + dateBetween.getDate() + " jour(s) " + dateBetween.getHours() + " heure(s)");

  if(isSecure())
  {
    var anciennete = document.createElement('p');
    var maj = document.createElement('p');
    anciennete.id = "OCSP_check_anciennete";
    anciennete.textContent = "Date de la dernière mise à jour: " + dateConvert.getDate() + "/" + (dateConvert.getMonth()+1) + "/" + dateConvert.getFullYear() + " à " + dateConvert.getHours() + ":" + dateConvert.getMinutes() + ":" + dateConvert.getSeconds();
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

  var myVar = setInterval(timer, 1000);
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

function timer()
{
  var d = new Date();
  document.getElementById("").style.visibility = "hidden";
}

/**
* Create a popup notification from incoming message
* @param msg received message
*/
function handleMessage(msg) {
    console.log(msg);
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
var url = 'yahoo.com';

// Envoi de l'adresse au background script
// Cet appel devrai être fait automatiquement quand on visite un site de la liste.
port.postMessage({url: url});
