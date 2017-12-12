
test: tcp_connection.o test.o
	g++ -o client test.o tcp_connection.o `pkg-config gnutls --libs`

tcp_connection.o: tcp_connection.c
	gcc -o tcp_connection.o -c tcp_connection.c

test.o: test.cpp
	g++ -c test.cpp -o test.o `pkg-config gnutls --cflags`
