#!/usr/bin/python3.5

# coding: utf-8

import sys

def get_message():
    txt = sys.stdin.read()
    return txt

while True:
    msg = get_message()
    if (msg == "Bonjour"):
        print("Bonjour à vous")
    
