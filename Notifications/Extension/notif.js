generatePopup("IUT Paul Sabatier Toulouse III", "24 octobre 2017 à 14h", "12h:35m:23s");

/**
 * Permite to generate a popup with many informations
 * @param website name of the website
 * @param update last update of the OCSP cache
 * @param date seniority of the certificate
 */
function generatePopup(website, update, date)
{
  var div_notif = document.createElement('div');
  var div_titre = document.createElement('div');
  var div_texte = document.createElement('div');

  div_notif.id = "OCSP_check_div_notif";
  div_titre.id = "OCSP_check_div_titre";
  div_texte.id = "OCSP_check_div_texte";

  div_titre.textContent = website;

  div_notif.style.width = "400px";
  div_notif.style.height = "100px";
  div_notif.style.zindex = "9999";
  div_notif.style.position = "fixed";
  div_notif.style.bottom = "5%";
  div_notif.style.left = "3%";
  div_notif.style.fontFamily = "Arial";
  div_notif.style.border = "0";
  div_notif.style.margin = "0";

  div_titre.style.borderRadius = "4px 4px 0px 0px";
  div_titre.style.backgroundColor = "rgba(207, 0, 15, 1)";
  div_titre.style.fontWeight = "bold";
  div_titre.style.textAlign = "center";
  div_titre.style.fontSize = "20px";

  div_texte.style.backgroundColor = "rgba(217, 30, 24, 0.9)";
  div_texte.style.borderRadius = "0px 0px 4px 4px";
  div_texte.style.fontSize = "18px";
  div_texte.style.fontFamily = "Arial";

  if(isSecure())
  {
    var anciennete = document.createElement('p');
    var maj = document.createElement('p');
    anciennete.id = "OCSP_check_anciennete";
    maj.id = "OCSP_check_maj";
    anciennete.textContent = "Ancienneté de l'attestation : " + date; //12h:35m:23s
    maj.textContent = " Date de la dernière mise à jour du cache OCSP : " + update; //24 octobre 2017 à 14h
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







