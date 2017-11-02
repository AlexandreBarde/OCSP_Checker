# coding: utf-8

import ssl
import socket

# Serveur a atteindre
host = 'www.google.com'
# HTTPS -> port 443
port = 443
cont = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
# Ouverture d'un socket client
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# Ouverture d'un socket SSL à partir du socket existant
ssl_sock = cont.wrap_socket(s, server_hostname=host)
# Connexion au serveur via le socket SSL
ssl_sock.connect((host, port))
# Fermeture de la connexion
ssl_sock.close()
# La connexion fonctionne, l'afficher
print("OK")
# Récupération du certificat
cert = ssl.get_server_certificate((host, port))
# Affichage du certificat x509
print(cert)
