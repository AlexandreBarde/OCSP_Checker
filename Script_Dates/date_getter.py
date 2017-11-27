#!/usr/bin/python3

import sys
import json
import struct
import subprocess


def get_message():
    """
    Recupère un message depuis stdin
    et le décode
    """
    rawLength = sys.stdin.buffer.read(4)
    # Si le message est vide, ne rien faire
    if len(rawLength) == 0:
        sys.exit(0)
    # Recuperer la longueur du message
    messageLength = struct.unpack('@I', rawLength)[0]
    # Lire sur la longueur du message
    message = sys.stdin.buffer.read(messageLength).decode('utf-8')
    return json.loads(message)


def encode_message(messageContent):
    """
    Encode un message
    dans un format que l'extension comprends
    """
    encodedContent = json.dumps(messageContent).encode('utf-8')
    encodedLength = struct.pack('@I', len(encodedContent))
    return {'length': encodedLength, 'content': encodedContent}


def send_message(encodedMessage):
    """
    Envoie un message encodé sur stdout
    """
    sys.stdout.buffer.write(encodedMessage['length'])
    sys.stdout.buffer.write(encodedMessage['content'])
    sys.stdout.buffer.flush()


def get_OCSP_update(server_hostname):
    """
    Recupere la date de la derniere mise a jour
    du cache OCSP du serveur
    """
    resultat = subprocess.run(
        ['./date_check', server_hostname], stdout=subprocess.PIPE)
    return resultat.stdout.decode('utf-8')


while True:
    msg = get_message()
    if len(msg) > 0:
        d = get_OCSP_update(msg)
        send_message(encode_message(d))
