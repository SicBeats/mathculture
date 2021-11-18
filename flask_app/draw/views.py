'''
File name: /draw/views.py

Author: Kelemen Szimonisz
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)

This python file defines the views (URL routing) for the draw blueprint.
The algorithm POST requests from the front end of the webapp are handled here.

Creation Date: 10/12/2021
Last Modified: 11/01/2021
'''
from . import draw_blueprint
from .classifier.main import classifyImage
from .detector.main import predictEquationFromImage
from .detector.main import loadTrainedModel
#from . import querywolframalpha
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


@draw_blueprint.route('/algo', methods=['POST'])
def runAlgorithm():
    # POST request
    # parse the POST request as JSON
    received_message = request.get_json() # parse as json
    # the distance/duration matrix
    image_base64 = received_message['image']
    image_binary = base64.b64decode(image_base64)
    with open('/app/flask_app/draw/temp.jpg','wb+') as f:
        f.write(image_binary)
  
    #class_prediction = classifyImage('temp.jpg') 
    predicted_equation = predictEquationFromImage('temp.jpg')
    
    encoding = 'utf-8'
    with open('/app/flask_app/draw/detector/temp_bboxes.jpg','rb') as f:
        byte_content = f.read()

    base64_bytes = base64.b64encode(byte_content)
    base64_string = base64_bytes.decode(encoding)
    
    
    #step_by_step = querywolframalpha.getStepByStep(predicted_equation)
    # NEED ERROR HANDLING!
    #os.remove('temp.jpg')

    message = {'prediction':predicted_equation,'bbox_image':base64_string}
    # jsonify the message
    return jsonify(message)
