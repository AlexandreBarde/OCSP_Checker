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
    # Appel au script shell et retour de sa sortie
    resultat = subprocess.run(
        ['./date_check', server_hostname], stdout=subprocess.PIPE)
    return resultat.stdout.decode('utf-8')


while True:
    # Attendre un message
    msg = get_message()
    # Si on a recu un message non vide
    if len(msg) > 0:
        # Recuperer la date de la maj OCSP
        rep_date = get_OCSP_update(msg)
        # L'encoder et l'envoyer à l'extension
        send_message(encode_message(rep_date))
