#!/usr/bin/python -u

# coding: utf-8

import sys, json, struct, datetime, subprocess

def get_message():
  """
  Lit un message au format JSON reçu dans une struct
  """
  rawLength = sys.stdin.read(4)
  if len(rawLength) == 0:
      sys.exit(0)
  messageLength = struct.unpack('@I', rawLength)[0]
  message = sys.stdin.read(messageLength)
  return json.loads(message)

def encode_message(messageContent):
  """
  Prépare un réponse au format JSON
  """
  encodedContent = json.dumps(messageContent)
  encodedLength = struct.pack('@I', len(encodedContent))
  return {'length': encodedLength, 'content': encodedContent}

def send_message(encodedMessage):
  """
  Envoie un message encodé sur la sortie standard
  """
  sys.stdout.write(encodedMessage['length'])
  sys.stdout.write(encodedMessage['content'])
  sys.stdout.flush()

def date_diff(in_date):
  """
  Retourne la différence entre la date courante et 
  celle passée en paramètre
  """
  # Appel script shell
  subprocess.call("../../Script_Dates/date_check")

while True:
  receivedMessage = get_message()
  if (receivedMessage == "yahoo.fr"):
    date = datetime.datetime.now()
    # Renvoie l'heure courante
    send_message(encode_message(str(date)))
