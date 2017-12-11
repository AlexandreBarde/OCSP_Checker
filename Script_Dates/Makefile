CC=gcc
CFLAGS=Wall

client: tcp_connection.o session_tls.o
	$(CC) -o client tcp_connection.o session_tls.o `pkg-config gnutls --libs`

tcp_connection.o: tcp_connection.c
	$(CC) -o tcp_connection.o -c tcp_connection.c

session_tls.o: session_tls.c
	$(CC) -o session_tls.o -c session_tls.c `pkg-config gnutls --cflags`
