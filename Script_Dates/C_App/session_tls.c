#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <gnutls/gnutls.h>
#include <gnutls/ocsp.h>
#include "tcp_connection.h"

#define SERVER "reddit.com"
#define LOG 0

void print_logs(int level, const char* msg) {
  printf("GNUTLS [%d]: %s", level, msg);
}

int main() {
  int sockfd;
  gnutls_session_t tls_session;
  int err;
  char* desc;
  gnutls_certificate_credentials_t xcred;
  gnutls_datum_t encoded_attest;
  gnutls_datum_t decoded_attest;
  gnutls_ocsp_resp_t response;


  // Activation du logging
  gnutls_global_set_log_level(LOG);
  gnutls_global_set_log_function(print_logs);
  gnutls_certificate_allocate_credentials(&xcred);
  gnutls_certificate_set_x509_trust_file(xcred, "/etc/ssl/certs/ca-bundle.crt", GNUTLS_X509_FMT_PEM);
  gnutls_certificate_set_x509_key_file(xcred, "cert.pem", "key.pem", GNUTLS_X509_FMT_PEM);
  // Initialisation de la session
  err = gnutls_init(&tls_session, GNUTLS_CLIENT);
  if (err < 0) {
    fprintf(stderr, "Erreur lors de la création de la session: %d", err);
  }
  tcp_connect(SERVER, "443");
  err = gnutls_server_name_set(tls_session, GNUTLS_NAME_DNS, SERVER, strlen(SERVER));
  if (err < 0) {
    fprintf(stderr, "Erreur lors de la selection du serveur: %d", err);
  }
  err = gnutls_set_default_priority(tls_session);
  if (err < 0) {
    fprintf(stderr, "Erreur lors de la selection de la priorité: %d", err);
  }
  gnutls_credentials_set(tls_session, GNUTLS_CRD_CERTIFICATE, xcred);
  gnutls_session_set_verify_cert(tls_session, SERVER, 0);
  sockfd = tcp_connect(SERVER, "443");
  gnutls_transport_set_int(tls_session, sockfd);
  gnutls_handshake_set_timeout(tls_session, GNUTLS_DEFAULT_HANDSHAKE_TIMEOUT);
  err = gnutls_handshake(tls_session);
  if (err < 1 && gnutls_error_is_fatal(err)) {
    fprintf(stderr, "Erreur handshake: %s\n", gnutls_strerror(err));
    exit(1);
  }
  desc = gnutls_session_get_desc(tls_session);
  // printf("Session info: %s\n", desc);
  // Verifier qu'une attestation OCSP a été incluse dans le handshake
  err = gnutls_ocsp_status_request_is_checked(tls_session, 0);
  if (err < 0) {
    perror("No OSCP Status");
    exit(1);
  }
  // Recuperer l'attestation OCSP
  err = gnutls_ocsp_status_request_get(tls_session, &encoded_attest);
  if (err < 0) {
    perror("Status get");
    exit(1);
  }
  // Decoder
  err = gnutls_ocsp_resp_init(&response);
  if (err < 0) {
    perror("Init rep");
  }
  err = gnutls_ocsp_resp_import(response, &encoded_attest);
  if (err < 0) {
  }
  err = gnutls_ocsp_resp_print(response, GNUTLS_OCSP_PRINT_FULL, &decoded_attest);
  printf("%.*s", 29, decoded_attest.data + 477);
  return 0;
}
