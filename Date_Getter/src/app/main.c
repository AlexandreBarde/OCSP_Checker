#include "parser.h"
#include "native_messaging.h"
#include "ocsp_stapling.h"

#define MAX_MSG_LEN 1024

int main() {
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