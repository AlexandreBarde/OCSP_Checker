// Ecouter une connexion du background script
chrome.runtime.onMessage.addListener(function (msg) {
    showDate(msg.date);
});

var node = document.createElement('style');
document.body.appendChild(node);
window.addStyleString = function(str) {
    node.innerHTML = str;
};

addStyleString('#OCSP_check_div_titre { border-radius: 4px 4px 0px 0px; background-color: rgba(207, 0, 15, 1); font-weight: bold; text-align: center; font-size: 20px; border: 0px; padding: 0px; margin-bottom: 0;} #OCSP_check_div_texte {background-color: rgba(217, 30, 24, 0.9); border-radius: 0px 0px 4px 4px; font-size: 18px; font-family: Arial; color: black;} #OCSP_check_div_notif { width: 400px; height: 100px; z-index: 9999; position: fixed; bottom: 5%; left: 3%; font-family: NULL; font-family: Arial; color: black;}');

showDate('Dec 20 11:12:12');

/**
  * Génère la popup et la fait disparaitre 10 secondes après
  * @param date Ancienneté du certificat
  */
function showDate(var_date)
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
  dateTab = var_date.split(" ");
  //On récupère la partie des heures
  dateHeure = dateTab[2];
  //Split de la partie des heures
  dateHeure = dateHeure.split(":");
  //Transformation des mois (ang) en chiffres
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
  dateConvert.setHours(dateHeure[0]);
  dateConvert.setMinutes(dateHeure[1]);
  dateConvert.setSeconds(dateHeure[2]);
  dateConvert.setMonth(month);
  //On créer une nouvelle date qui est la différence entre les 2 dates
  dateBetween = new Date(dateNow - dateConvert);
  //Debug
  console.log("Date actuelle : " + dateNow.getDate()  + "/" + (dateNow.getMonth()+1) + "/" + dateNow.getFullYear() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds());
  console.log("Date OCSP : " + dateConvert.getDate() + "/" + (dateConvert.getMonth()+1) + "/" + dateConvert.getFullYear() + " " + dateConvert.getHours() + ":" + dateConvert.getMinutes() + ":" + dateConvert.getSeconds());
  console.log("Date : " + dateBetween.getMonth() + " mois " + (dateBetween.getDate() - 1) + " jour(s) " + dateBetween.getHours() + " heure(s)");

  if(isSecure())
  {
    var anciennete = document.createElement('p');
    var maj = document.createElement('p');
    anciennete.id = "OCSP_check_anciennete";
    anciennete.textContent = "Date de la dernière mise à jour: " + (dateConvert.getDate() - 1) + "/" + (dateConvert.getMonth()+1) + "/" + dateConvert.getFullYear() + " à " + dateConvert.getHours() + ":" + dateConvert.getMinutes() + ":" + dateConvert.getSeconds();
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

  var delai = setInterval(timer, 10000);
}

/**
 * Vérification du protocole
 * @returns {boolean} Si le site web utilise le protocole SSL
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
  *
  * Permet de cacher la popup au bout d'un certain temps
  */
function timer()
{
  var d = new Date();
  document.getElementById("OCSP_check_div_notif").style.visibility = "hidden";
}
