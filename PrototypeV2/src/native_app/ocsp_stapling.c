#include <stdio.h>
#include <gnutls/gnutls.h>
#include <string.h>
#include <gnutls/ocsp.h>
#include "tcp_connection.h"
#include "ocsp_stapling.h"

void getOcspUpdate(char *server, char date[]) {
    int sockfd;
    gnutls_session_t tls_session;
    int err;
    gnutls_certificate_credentials_t xcred;
    gnutls_datum_t encoded_attest;
    gnutls_datum_t decoded_attest;
    gnutls_ocsp_resp_t response;

    gnutls_certificate_allocate_credentials(&xcred);
    err = gnutls_certificate_set_x509_trust_file(xcred, "../assets/ca-certificates.crt", GNUTLS_X509_FMT_PEM);
    if (err < 0) {
        strcpy(date, "certificat");
        return;
    }
    // Initialisation de la session
    err = gnutls_init(&tls_session, GNUTLS_CLIENT);
    if (err < 0) {
        strcpy(date, "init");
        return;
    }
    err = gnutls_server_name_set(tls_session, GNUTLS_NAME_DNS, server, strlen(server));
    if (err < 0) {
        strcpy(date, "serve");
        return;
    }
    err = gnutls_set_default_priority(tls_session);
    if (err < 0) {
        strcpy(date, "priorité");
        return;
    }
    gnutls_credentials_set(tls_session, GNUTLS_CRD_CERTIFICATE, xcred);
    gnutls_session_set_verify_cert(tls_session, server, 0);
    sockfd = tcp_connect(server, "443");
    gnutls_transport_set_int(tls_session, sockfd);
    gnutls_handshake_set_timeout(tls_session, GNUTLS_DEFAULT_HANDSHAKE_TIMEOUT);
    err = gnutls_handshake(tls_session);
    if (err < 1 && gnutls_error_is_fatal(err)) {
        strcpy(date, "handshake");
        return;
    }
    // Verifier qu'une attestation OCSP a été incluse dans le handshake
    err = gnutls_ocsp_status_request_is_checked(tls_session, 0);
    if (err < 0) {
        strcpy(date, "NO_OCSP");
        return;
    }
    // Recuperer l'attestation OCSP
    err = gnutls_ocsp_status_request_get(tls_session, &encoded_attest);
    if (err < 0) {
        strcpy(date, "NO_OCSP");
        return;
    }
    // Decoder
    err = gnutls_ocsp_resp_init(&response);
    if (err < 0) {
        strcpy(date, "NO_OCSP");
        return;
    }
    err = gnutls_ocsp_resp_import(response, &encoded_attest);
    if (err < 0) {
        strcpy(date, "NO_OCSP");
        return;
    }
    err = gnutls_ocsp_resp_print(response, GNUTLS_OCSP_PRINT_FULL, &decoded_attest);
    if (err < 0) {
        strcpy(date, "NO_OCSP");
        return;
    }
    // Recuperer la partie contenant la date de mise à jour
    sprintf(date, "%.*s", 15, decoded_attest.data + 481);
}

