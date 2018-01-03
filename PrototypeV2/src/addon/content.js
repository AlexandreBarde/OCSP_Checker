/**
 * MANIPULATION DE LA PAGE
 */


var div_notif
var div_notif

// Ecouter une connexion du background script
chrome.runtime.onMessage.addListener(function (msg) {
  // Verifier qu'on ai bien reçu une date
  if (!isNaN(Date.parse(msg.date)))
    showDate(msg.date);
  else
    console.log('Impossible de recuperer l\'attestation: ' + msg.date);
});

/**
 * Génère la popup et la fait disparaitre 10 secondes après
 * @param var_date Ancienneté du certificat
 */
function showDate(var_date) {
  div_notif = document.createElement('div');
  div_titre = document.createElement('div');
  var div_texte = document.createElement('div');
  div_notif.id = "OCSP_check_div_notif";
  div_titre.id = "OCSP_check_div_titre";
  div_texte.id = "OCSP_check_div_texte";
  div_titre.textContent = "Attestation OCSP trop ancienne";
  //On créer une nouvelle date qui est la différence entre les 2 dates
  var anciennete = document.createElement('p');
  var maj = document.createElement('p');
  anciennete.id = "OCSP_check_anciennete";
  anciennete.textContent = `Mise à jour il y a ${dateDiff(new Date(var_date), new Date())}`;
  div_texte.appendChild(anciennete);
  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);
  document.body.appendChild(div_notif);
  var delai = setInterval(hideNotif, 2000);
}

function showNotif() {
  div_notif.style.visibility = "visible";
}

function hideNotif() {
  div_notif.style.visibility = "hidden";
}

/**
 * Retourne un string formatté de la différence
 * entre 2 dates avec jours heures minutes et secondes
 * si non nuls
 * @param {Date} d1 
 * @param {Date} d2 
 */
function dateDiff(d1, d2) {
  // Différence totale en secondes
  var millis = (Math.abs(d2.getTime() - d1.getTime()));
  // Jours
  var days = millis / (1000 * 60 * 60 * 24);
  var arrond_days = Math.floor(days);
  // Heures
  var hours = (days - arrond_days) * 24
  var arrond_hours = Math.floor(hours);
  // Minutes
  var minutes = (hours - arrond_hours) * 60;
  var arrond_minutes = Math.floor(minutes);
  // Secondes
  var seconds = (minutes - arrond_minutes) * 60;
  var arrond_seconds = Math.floor(seconds);
  // Formatter le message pour ne pas inclure les unites à 0
  var str = "";
  var elems = {
    "jours": arrond_days,
    "heures": arrond_hours,
    "minutes": arrond_minutes,
    "secondes": arrond_seconds
  };
  for (el in elems) {
    if (elems[el] != '00') {
      str += `${elems[el]} ${[el]} `;
    }
  }
  return str;
}