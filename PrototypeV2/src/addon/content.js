// Les variable declarées en dehors d'un bloc ont une portée globale
var div_circle
var div_notif
var div_notif

// Ecouter une connexion du background script
chrome.runtime.onMessage.addListener(function (msg) {
  showDate(msg.date);
});

// Créer le cercle persistant
div_circle = document.createElement('div');
div_circle.id = "OCSP_circle";
// Attendre un click sur le cercle et montrer la notification
div_circle.addEventListener('click', function () {
  showNotif()
})

/**
 * Génère la popup et la fait disparaitre 10 secondes après
 * @param var_date Ancienneté du certificat
 */
function showDate(var_date) {
  var node = document.createElement('style');
  document.body.appendChild(node);
  window.addStyleString = function (str) {
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
  //On créer une nouvelle date qui est la différence entre les 2 dates
  var anciennete = document.createElement('p');
  var maj = document.createElement('p');
  anciennete.id = "OCSP_check_anciennete";
  anciennete.textContent = `Dernière mise à jours il y à ${dateDiff(new Date(var_date), new Date())}`;
  div_texte.appendChild(anciennete);
  div_notif.appendChild(div_titre);
  div_notif.appendChild(div_texte);
  document.body.appendChild(div_notif);
  document.body.appendChild(div_circle);
  var delai = setInterval(hideNotif, 1000);
}

function showNotif() {
  div_notif.style.visibility = "visible";
  div_circle.style.visibility = "hidden";
}

function hideNotif() {
  div_notif.style.visibility = "hidden";
  div_circle.style.visibility = "visible";
}

/**
 * Retourne un string formatté de la différence
 * entre 2 dates
 * @param {Date} d1 
 * @param {Date} d2 
 */
function dateDiff(d1, d2) {
  // Différence totale en secondes
  var millis = (Math.abs(d2.getTime() - d1.getTime()));
  // Jours
  var days = millis / (1000 * 60 * 60 * 24);
  var arrond_days = Math.floor(days);
  var d = arrond_days > 9 ? arrond_days : '0' + arrond_days;
  // Heures
  var hours = (days - arrond_days) * 24
  var arrond_hours = Math.floor(hours);
  var h = arrond_hours > 9 ? arrond_hours : '0' + arrond_hours;
  // Minutes
  var minutes = (hours - arrond_hours) * 60;
  var arrond_minutes = Math.floor(minutes);
  var m = arrond_minutes > 9 ? arrond_minutes : '0' + arrond_minutes;
  // Secondes
  var seconds = (minutes - arrond_minutes) * 60;
  var arrond_seconds = Math.floor(seconds);
  var s = arrond_seconds > 9 ? arrond_seconds : '0' + arrond_seconds;
  // Formatter le message pour ne pas inclure les unites à 0
  var str = "";
  var elems = {
    "jours": d,
    "heures": h,
    "minutes": m,
    "secondes": s
  };
  for (el in elems) {
    if (elems[el] != '00') {
      str += `${elems[el]} ${[el]} `;
    }
  }
  return str;
}