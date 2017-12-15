#include "parser.h"
#include <string.h>

char *getUrl(char *msg) {
    // Le message sera toujours de la forme: {"url": "adresse"}
    // On veut recuperer le 3eme mot apres "
    char delim[2] = "\"";
    char *parsed = strtok(msg, delim);
    for (int i = 0; i < 3; i++)
        parsed = strtok(NULL, delim);
    return parsed;
}

