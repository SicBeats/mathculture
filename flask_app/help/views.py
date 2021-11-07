'''
File name: /help/views.py

Author: Sofi Vinas, Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the help blueprint.

Creation Date: 10/27/2021
Last Modified: 10/29/2021
'''
from . import help_blueprint 
from flask import Flask, jsonify, render_template, request, current_app

# create a route between URL (/help) and the function help() that returns a response
@help_blueprint.route('/help', methods=['GET'])
def help():
    # render references.html when the user goes to mapculture.co/references
    return render_template('help.html')
