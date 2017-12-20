cmake_minimum_required(VERSION 3.0)
project(Date_Getter C)

set(CMAKE_C_STANDARD 99)

set(SOURCES src/native_app/main.c src/native_app/native_messaging.h
        src/native_app/native_messaging.c src/native_app/ocsp_stapling.h
        src/native_app/ocsp_stapling.c src/native_app/parser.h src/native_app/parser.c
        src/native_app/tcp_connection.h src/native_app/tcp_connection.c)

add_executable(Date_Getter ${SOURCES})

find_package(GnuTLS)
include_directories(src ${GNUTLS_INCLUDE_DIRS})
target_link_libraries(Date_Getter ${GNUTLS_LIBRARIES})

