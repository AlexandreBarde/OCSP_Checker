#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <cjson/cJSON.h>
#include "messaging.h"

#define MAX_MSG_LEN 100

void getMessage(char* dest) {
  // Lit 4 octets sur stdin
  char length[4];
  read(0, length, 4);
  // Longueur du message
  int int_length = atoi(length);
  // Message
  char msg[MAX_MSG_LEN];
  // Relire sur la longueur du message
  read(0, msg, int_length);
  // Ce message doit être un json avec une seule clé url
  cJSON* root = cJSON_Parse(msg);
  // Recuperer la valeur associée à cette clé
  cJSON* url_json = cJSON_GetObjectItemCaseSensitive(root, "url");
  char* url_str = url_json->valuestring;
  strcpy(dest, url_str);
}

void postMessage(char* msg) {
  // Recuperer la longueur du message
  unsigned int length = strlen(msg);
  // Envoyer 4 octets contenant la longueur du message sur stdout
  printf("%c%c%c%c", (char) (length & 0xFF),
	             (char) ((length >> 8) & 0xFF),
		     (char) ((length >> 16) & 0xFF),
		     (char) ((length >> 24) & 0xFF));
  // Envoyer le message, formatté en JSON
  printf("{\"date\": \"%s}", msg);
}

