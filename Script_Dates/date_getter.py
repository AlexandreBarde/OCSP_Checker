# coding: utf-8

import sys
import json
import struct
import subprocess


def get_message():
    """
    Recupère un message depuis stdin
    et le décode
    """
    rawLength = sys.stdin.read(4)
    # Si le message est vide, ne rien faire
    if len(rawLength) == 0:
        sys.exit(0)
    # Recuperer la longueur du message
    messageLength = struct.unpack('@I', rawLength)[0]
    # Lire sur la longueur du message
    message = sys.stdin.read(messageLength)
    return json.loads(message)


def encode_message(messageContent):
    """
    Encode un message
    dans un format que l'extension comprends
    """
    encodedContent = json.dumps(messageContent)
    encodedLength = struct.pack('@I', len(encodedContent))
    return {'length': encodedLength, 'content': encodedContent}


def send_message(encodedMessage):
    """
    Envoie un message encodé sur stdout
    """
    sys.stdout.write(encodedMessage['length'])
    sys.stdout.write(encodedMessage['content'])
    sys.stdout.flush()


def get_OCSP_update(server_hostname):
    """
    Recupere la date de la derniere mise a jour
    du cache OCSP du serveur
    """
    # Commande shell
    cmd = 'echo QUIT | openssl s_client -connect ' + server_hostname + ':443 -status 2>/dev/null \
          | grep "This Update" | cut -d ":" -f 2-'
    # Capturer la sorte de la commande
    return subprocess.getoutput(cmd)


# Lire l'adresse envoyée à l'extension
target_serv = get_message()
# Recuperer la date
update = get_OCSP_update(target_serv)
# Renvoyer la date à l'extension
send_message(encode_message(update))
