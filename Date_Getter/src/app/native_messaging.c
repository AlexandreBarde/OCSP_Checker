#include "native_messaging.h"
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#define MAX_MSG_LEN 1024

char *getMessage() {
    // Longueur du message
    char msg_len[4];
    // Lire 4 octets sur stdin
    read(0, msg_len, 4);
    // Convertir cette longueur en entier non signé
    unsigned int msg_len_int = *(unsigned int *) msg_len;
    // Allouer cet espace au message
    char *msg = (char *) malloc(msg_len_int);
    // Lire sur la longueur du message
    read(0, msg, msg_len_int);
    // Ajouter le caractère de terminaison
    msg[msg_len_int] = '\0';
    return msg;
}

void postMessage(char *msg) {
    // Buffer contenant la réponse
    char response[MAX_MSG_LEN];
    sprintf(response, "{\"text\": \"%s\"}", msg);
    // Longueur de ce message
    unsigned int response_length = (unsigned int) strlen(response);
    // Convertir la longueur en string
    char *str_length = (char *) &response_length;
    // Ecrire cette longueur sur 4 octets sur stdout
    write(1, str_length, 4);
    // Ecrire le message sur stdout
    write(1, response, response_length);
    // Tout envoyer
    fflush(stdout);
}
