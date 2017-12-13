#include <stdio.h>
#include "messaging.h"
#include "ocsp_stapling.h"

#define MAX_MSG_LEN 1024

int main() {
  char serv[MAX_MSG_LEN];
  char date[100];
  getMessage(&serv);
  getOcspUpdate(serv, date);
  printf("%s", date);
}
