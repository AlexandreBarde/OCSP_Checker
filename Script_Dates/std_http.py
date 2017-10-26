# coding: utf-8

import sys
import requests

def getUrl():
    return sys.stdin.read()

url = getUrl()

r = requests.get('http://' + url.strip('\n'))
print(r.text)
