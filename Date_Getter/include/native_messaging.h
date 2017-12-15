#ifndef NATIVE_MESSAGING_H
#define NATIVE_MESSAGING_H

// Lit et renvoie un message JSON envoyé par l'extension
char *getMessage();

// Encode et envoie un message JSON à l'extension avec la cle text
void postMessage(char *msg);

#endif