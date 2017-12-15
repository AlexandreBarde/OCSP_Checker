cmake_minimum_required(VERSION 3.9)
project(Date_Getter C)

set(CMAKE_C_STANDARD 99)

set(SOURCES src/app/main.c src/app/native_messaging.h
        src/app/native_messaging.c src/app/ocsp_stapling.h
        src/app/ocsp_stapling.c src/app/parser.h src/app/parser.c
        src/app/tcp_connection.h src/app/tcp_connection.c)

add_executable(Date_Getter ${SOURCES})

find_package(GnuTLS)
include_directories(src ${GNUTLS_INCLUDE_DIRS})
target_link_libraries(Date_Getter ${GNUTLS_LIBRARIES})

