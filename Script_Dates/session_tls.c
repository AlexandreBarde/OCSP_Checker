/**
 * CA MARCHE PAS ET C'EST PAS COMMENTE, PASSE
 * TON CHEMIN
 */


#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <gnutls/gnutls.h>
#include<gnutls/x509.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <unistd.h>


int tcp_connect(void) {
  const char* PORT = "80";
  const char* SERVER = "151.101.65.140";
  int err, sd;
  struct sockaddr_in sa;
  sd = socket(AF_INET, SOCK_STREAM,  0);
  memset(&sa, '\0', sizeof(sa));
  sa.sin_family = AF_INET;
  sa.sin_port = htons(atoi(PORT));
  inet_pton(AF_INET, SERVER, &sa.sin_addr);
  err = connect(sd, (struct sockaddr *) &sa , sizeof(sa));
  if (err < 0) {
    perror("Merde");
    exit(1);
  }
  return sd;
}

int main(void) {
  gnutls_session_t sess;
  int sd, ret, status;
  gnutls_certificate_credentials_t xcred;
  gnutls_certificate_allocate_credentials(&xcred);
  gnutls_certificate_set_x509_trust_file(xcred, "/etc/ssl/certs/ca-certificates.crt", GNUTLS_X509_FMT_PEM);
  gnutls_init(&sess, GNUTLS_CLIENT);
  gnutls_server_name_set(sess, GNUTLS_NAME_DNS, "www.google.com", strlen("www.google.com"));
  gnutls_set_default_priority(sess);
  gnutls_credentials_set(sess, GNUTLS_CRD_CERTIFICATE, xcred);
  gnutls_session_set_verify_cert(sess, "www.google.com", 0);
  gnutls_transport_set_int(sess, sd);
  sd = tcp_connect();
  ret = gnutls_handshake(sess);
  status = gnutls_error_is_fatal(ret);
  printf("%d %d\n",ret, status);
}
