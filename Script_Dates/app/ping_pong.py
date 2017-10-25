#!/usr/bin/python3.5
# coding: utf-8
import sys
import json
import struct


# Read a message from stdin and decode it.
def get_message():
    rawLength = sys.stdin.read(4)
    if len(rawLength) == 0:
        sys.exit(0)
    messageLength = struct.unpack('@I', rawLength)[0]
    message = sys.stdin.read(messageLength)
    return json.loads(message)


# Encode a message for transmission, given its content.
def encode_message(messageContent):
    encodedContent = json.dumps(messageContent)
    encodedLength = struct.pack('@I', len(encodedContent))
    return {'length': encodedLength, 'content': encodedContent}


# Send an encoded message to stdout.
def send_message(encodedMessage):
    sys.stdout.write(encodedMessage['length'])
    sys.stdout.write(encodedMessage['content'])
    sys.stdout.flush()


while True:
    receivedMessage = get_message()
    if (receivedMessage == "ping"):
        send_message(encode_message("pong"))
