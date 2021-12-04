'''
File name: /draw/views.py

Author: Kelemen Szimonisz
Organization: Math Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the draw blueprint.
The algorithm POST requests from the front end of the webapp are handled here.

Last Modified: 11/28/2021
'''
from . import draw_blueprint
from .detector.main import predictEquationFromImage
from .detector.main import loadTrainedModel
from flask import Flask, jsonify, render_template, request, current_app
import base64
import os

# create a route between the URL (/draw) and the function draw() that returns a response
@draw_blueprint.route('/draw', methods=['GET'])
def draw():
    # render draw.html when the user goes to mathculture.co/draw
    return render_template('draw.html') 

# POST: sending of information to another location
# example: sending a letter in the mail

# GET: retrieving information 
# example: going to the post office to ask for your letter

# handle POST requests that are sent to the URL /algo
# Receive an image of either a handwritten or digitally drawn math equation
# Input into the object detector
# Query Wolfram Alpha for a step-by-step solution
# Send back the predicted equation, and an image of the original image with predicted bounding boxes drawn on it
@draw_blueprint.route('/algo', methods=['POST'])
def runAlgorithm():
    # POST request
    # parse the POST request as JSON
    received_message = request.get_json() # parse as json
    # receive the JSON image as a base64 image
    image_base64 = received_message['image']
    # decode the image to binary
    image_binary = base64.b64decode(image_base64)
    # write the image to a jpeg file called 'temp.jpg'
    with open('/app/flask_app/draw/temp.jpg','wb+') as f:
        f.write(image_binary)
  
    # input the image into the object detector
    predicted_equation = predictEquationFromImage('temp.jpg')
    
    # read the temp_bboxes (temp with bbox predictions drawn it) image as binary
    encoding = 'utf-8'
    with open('/app/flask_app/draw/detector/temp_bboxes.jpg','rb') as f:
        byte_content = f.read()

    # convert binary to base64
    base64_bytes = base64.b64encode(byte_content)
    base64_string = base64_bytes.decode(encoding)
    
    # send the predicted equation and predicted bbox image to the frontend
    message = {'prediction':predicted_equation,'bbox_image':base64_string}
    # jsonify the message
    return jsonify(message)
