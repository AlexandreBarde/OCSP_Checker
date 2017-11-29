/**
*
* Ce script fait la liaison entre l'extension et l'application, il doit recevoir l'url depuis le content script, le transmettre
* à l'application native, recevoir la date et la renvoyer au contenu pour l'afficher dans une notif
*/

//Récupération de l'url de l'onglet actif
browser.tabs.onUpdated.addListener(function(tabId, infos, tab) {
  //Vérification que l'url est définie (utiliser l'url uniquement dans cette condition)
  if (typeof infos.url !== 'undefined') {
    console.log("URL de base : " + infos.url);
    console.log("URL pingable : " + convertURL(infos.url, true));
  }
});
