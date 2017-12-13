#include <stdio.h>
#include "messaging.h"
#include "ocsp_stapling.h"

#define MAX_MSG_LEN 1024
#define DATE_LEN 15

int main() {
  char serv[MAX_MSG_LEN];
  char date[DATE_LEN];
  getMessage(&serv);
  getOcspUpdate(serv, date);
  postMessage(date);
}
