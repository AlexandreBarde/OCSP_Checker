$(CC)=gcc
CFLAGS=-Wall

date_getter: date_getter.o messaging.o ocsp_stapling.o tcp_connection.o
	$(CC) -o date_getter date_getter.o messaging.o ocsp_stapling.o tcp_connection.o -lcjson `pkg-config gnutls --libs`

date_getter.o: date_getter.c
	$(CC) -c date_getter.c -o date_getter.o

messaging.o: messaging.c messaging.h
	$(CC) -c messaging.c -o messaging.o -lcjson

ocsp_stapling.o: ocsp_stapling.c ocsp_stapling.h
	$(CC) -c ocsp_stapling.c -o ocsp_stapling.o `pkg-config gnutls --cflags`

tcp_connection.o: tcp_connection.c tcp_connection.h
	$(CC) -c tcp_connection.c -o tcp_connection.o
