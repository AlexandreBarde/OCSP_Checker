cmake_minimum_required(VERSION 3.9)
project(Date_Getter C)
set(CMAKE_C_STANDARD 99)
# Fichier sources
set(SOURCES src/app/main.c include/parser.c include/parser.h include/native_messaging.c include/native_messaging.h
        include/ocsp_stapling.c include/ocsp_stapling.h include/tcp_connection.c include/tcp_connection.h)

add_executable(Date_Getter ${SOURCES})
# Trouver la dépendance
find_package(GnuTLS)
# L'inclure
include_directories(./include/ ${GNUTLS_INCLUDE_DIRS})
# L'inclure dans le linker aussi
target_link_libraries(Date_Getter ${GNUTLS_LIBRARIES})

