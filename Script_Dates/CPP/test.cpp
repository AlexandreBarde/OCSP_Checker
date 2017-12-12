extern "C" {
    #include "tcp_connection.h"
    #include <gnutls/gnutls.h>
    #include <gnutls/ocsp.h>
    #include <string.h>
    #include <stdio.h>
}

#include <iostream>

int main(void) {
  // A recuperer avec NativeMessaging
  char * SERVER = "reddit.com";
  // Descripteur de la socket
  int sockfd;
  // Session tls avec le serveur
  gnutls_session_t tls_session;
  // Code  erreur
  int err;
  // Certificats contenant les algorithme de chiffrement
  gnutls_certificate_credentials_t xcred;
  // Attestation OCSP encodée en DER
  gnutls_datum_t encoded_attest;
  // Attestation décodee
  gnutls_datum_t decoded_attest;
  // Réponse contenant la date
  gnutls_ocsp_resp_t response;
  // Préparer les certificats du client
  ::gnutls_certificate_allocate_credentials(&xcred);
  // Choisir la liste des CA a qui on fait confiance
  ::gnutls_certificate_set_x509_trust_file(xcred, "/etc/ssl/certs/ca-certificates.crt", GNUTLS_X509_FMT_PEM);
  // Associer un couple clé privé/publique à la structure xcred
  ::gnutls_certificate_set_x509_key_file(xcred, "cert.pem", "key.pem", GNUTLS_X509_FMT_PEM);
  // Creer la socket qui recevra et enverra les infos
  sockfd = ::tcp_connect(SERVER, "443");
  // Initialisation de la session
  err = ::gnutls_init(&tls_session, GNUTLS_CLIENT);
    if (err < 0) {
      return(1);
    }
    err = ::gnutls_server_name_set(tls_session, GNUTLS_NAME_DNS, SERVER, strlen(SERVER));
  if (err < 0) {
    return 1;
  }
  err = ::gnutls_set_default_priority(tls_session);
  if (err < 0) {
    return 1;
  }
  // Associer les infos de xcred à la session
  ::gnutls_credentials_set(tls_session, GNUTLS_CRD_CERTIFICATE, xcred);
  ::gnutls_session_set_verify_cert(tls_session, SERVER, 0); 
  ::gnutls_transport_set_int(tls_session, sockfd);
  ::gnutls_handshake_set_timeout(tls_session, GNUTLS_DEFAULT_HANDSHAKE_TIMEOUT);
  // Faire le handhake
  err = gnutls_handshake(tls_session);
  // En cas d'erreur fatale, quitter
  if (err < 0 && ::gnutls_error_is_fatal(err)) {
    std::cout << "Impossible de se connecter au serveur" << std::endl;
    return 1;
  }
  // Verifier qu'on a bien demandé l'attestation OCSP
  err = ::gnutls_ocsp_status_request_is_checked(tls_session, 0);
  if (err < 0) {
    std::cout << "Pas d'attesation demandee" << std::endl;
    return 1;
  }
  // La recuperer
  err = ::gnutls_ocsp_status_request_get(tls_session, &encoded_attest);
  if (err < 0) {
    std::cout << "Impossible de recuperer l'attestation" << std::endl;
    return 1;
  }
  // Préparer l'emplacement pour la réponse décodée
  err = ::gnutls_ocsp_resp_init(&response);
  if (err < 0) {
    return 1;
  }
  // Decoder
  err = ::gnutls_ocsp_resp_import(response, &encoded_attest);
  if (err < 0) {
    return 1;
  }
  // Formatter la réponse pour l'impression
  err = ::gnutls_ocsp_resp_print(response, GNUTLS_OCSP_PRINT_FULL, &decoded_attest);
  // Afficher la réponse formattée
  ::printf("%.*s", 29, decoded_attest.data + 477);
  return 0;
}
