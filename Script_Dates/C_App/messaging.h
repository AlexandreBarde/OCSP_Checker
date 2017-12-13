#ifndef MESSAGING_H
#define MESSAGING_H
// Recupere un message au format json depuis l'entree standard
void getMessage();
// Envoie un message à l'extension sur la sortie standard
void postMessage(char* msg);
#endif
