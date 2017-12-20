#include "tcp_connection.h"
#include <stdio.h>
#include <sys/socket.h>
#include <netdb.h>
#include <string.h>

int tcp_connect(char *serv, char *port) {
    // Pas la peine de gerer les erreurs à ce niveau,
    // les fonctions dans main renverrons une erreur
    int sockfd;
    struct addrinfo *server_addr;
    struct addrinfo config;
    memset(&config, 0, sizeof(config));
    config.ai_socktype = SOCK_STREAM;
    config.ai_family = AF_UNSPEC;
    getaddrinfo(serv, port, &config, &server_addr);
    sockfd = socket(server_addr->ai_family,
                    server_addr->ai_socktype,
                    server_addr->ai_protocol);
    connect(sockfd, server_addr->ai_addr, server_addr->ai_addrlen);
    freeaddrinfo(server_addr);
    return sockfd;
}
