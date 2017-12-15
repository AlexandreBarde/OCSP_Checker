#include "tcp_connection.h"
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netdb.h>
#include <string.h>

int tcp_connect(char *serv, char *port) {
    int sockfd, err;
    struct addrinfo *server_addr;
    struct addrinfo config;
    memset(&config, 0, sizeof(config));
    config.ai_socktype = SOCK_STREAM;
    config.ai_family = AF_UNSPEC;
    err = getaddrinfo(serv, port, &config, &server_addr);
    if (err) {
        fprintf(stderr, "getaddr %s", gai_strerror(err));
        exit(1);
    }
    sockfd = socket(server_addr->ai_family,
                    server_addr->ai_socktype,
                    server_addr->ai_protocol);
    if (sockfd == -1) {
        perror("socket");
        exit(2);
    }

    err = connect(sockfd, server_addr->ai_addr, server_addr->ai_addrlen);
    if (err == -1) {
        perror("connexion");
        exit(2);
    }
    freeaddrinfo(server_addr);
    return sockfd;
}
