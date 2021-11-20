'''
querywolfram.py
Authors: Kelemen Szimonisz

Most code borrowed from: https://towardsdatascience.com/build-your-next-project-with-wolfram-alpha-api-and-python-51c2c361d8b9
'''

from pprint import pprint
import requests
import os
import urllib.parse
import argparse
from flask import current_app


def getStepByStep(equation):
    appid = "7WEQV6-Q7WGAPL9KE" 

    # URL quoting
    # encodes non-ASCII text to be used in a URL
    # also replaces spaces with plus signs, as required when building up a URL query string
    # Example: quote_plus('/El Niño/') yields '%2FEl+Ni%C3%B1o%2F'.
    query = urllib.parse.quote_plus(f"solve {equation}x=0")

    query_url = f"http://api.wolframalpha.com/v2/query?" \
                f"appid={appid}" \
                f"&input={query}" \
                f"&scanner=Solve" \
                f"&podstate=Result__Step-by-step+solution" \
                "&format=plaintext" \
                f"&output=json"

    r = requests.get(query_url).json()
    current_app.logger.info(r);
    data = r["queryresult"]["pods"][0]["subpods"]
    result = data[0]["plaintext"]
    steps = data[1]["plaintext"]

    print(f"Result of {equation} is '{result}'.")
    print(f"Possible steps to solution:\n\n{steps}")
    return steps