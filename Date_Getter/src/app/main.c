#include "../../include/parser.h"
#include "../../include/native_messaging.h"
#include "../../include/ocsp_stapling.h"

#define MAX_MSG_LEN 1024

int main() {
    // Le programme tourne en continu tant qu'on est connectés
    while (1) {
        // Buffer qui contiendra la date
        char date[MAX_MSG_LEN];
        // Attendre un message
        char *msg = getMessage();
        // Recuperer le contenu
        char *parsed = getUrl(msg);
        // Interroger le serveur
        getOcspUpdate(parsed, date);
        // Envoyer la réponse
        postMessage(date);
    }
}