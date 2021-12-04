'''
File name: /draw/detector/main.py

Author: Kelemen Szimonisz
Organization: Math Culture (University of Oregon, CIS 422, FALL 2021)

This python file defines the main functions for use of the object detector: 
    - loading the object detector model (objdetector.pth)
    - passing data into the object detector, parsing the prediction, submitting to Wolfram Alpha API  
    - drawing bounding boxes on image files, producing a new image

Last Modified: 12/03/2021
'''

import torch
import torchvision
from torchvision.io import read_image, ImageReadMode
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader, Subset
from . import dataset
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from flask import current_app
from PIL import Image
import PIL
from . import querywolfram

############################################################################################
# FUNCTION: draw_boxes_on_image
#
# This function takes a PIL image file, a list of bounding boxes, and a list of labels and produces a new image with those boxes and labels drawn onto it.
############################################################################################
def draw_boxes_on_image(image,boxes,labels):
    fig, ax = plt.subplots(figsize=(3.2,2.4)) # set figure size to 6x6inches
    ax.imshow(image.permute(1, 2, 0).cpu())
    classes = ["background","zero","one","two","three","four","five","six","seven","eight","nine","plus","minus","mult","division","lpar","rpar","equal","x","y","z"]

    # x1, y1 is the upper-left corner point, x2, y2 is the bottom-left corner point
    for i,box in enumerate(boxes):
        x1, y1, x2, y2 = box 
        w, h = (x2-x1), (y2-y1)
        bounding_box = mpatches.Rectangle((x1,y1), w, h, fill=False, edgecolor='green', linewidth=1)
        ax.add_patch(bounding_box)
        ax.text(x1,(y1-5),classes[labels[i].item()],verticalalignment='top', color='black',fontsize=10,weight='bold')

    plt.axis('off')
    plt.savefig('/app/flask_app/draw/detector/temp_bboxes.jpg',dpi=200)
    plt.show()

############################################################################################
# FUNCTION: bboxes_per_class
#
# This function counts how many bounding boxes there are for each class in a given dataloader
# This is only used for analytics (helpful when we were building our dataset)
############################################################################################
def bboxes_per_class(dataloader):
  classes = dataloader.dataset.classes
  d = {}
  for i, data in enumerate(dataloader, 0):
    image, targets = data
    labels = targets[0]["labels"]
    for label in labels:
      class_name = classes[label.item()]
      d[class_name] = d.get(class_name, 0) + 1
  print("bboxes per class:")
  print(d)


############################################################################################
# FUNCTION: apply_nms
#
# This function takes a set of bounding box predictions and performs non-max suppression with a specific IoU threshold.
# This reduces the number of overlapping bounding boxes.
# If the IoU of two boxes are greater than the threshold, the one with the greatest objectness score is drawn and the other is ignored.
############################################################################################
def apply_nms(orig_prediction, iou_thresh=0.3):
    
    # torchvision returns the indices of the bboxes to keep
    keep = torchvision.ops.nms(orig_prediction['boxes'], orig_prediction['scores'], iou_thresh)
    
    final_prediction = orig_prediction
    final_prediction['boxes'] = final_prediction['boxes'][keep]
    final_prediction['scores'] = final_prediction['scores'][keep]
    final_prediction['labels'] = final_prediction['labels'][keep]
    
    return final_prediction

############################################################################################
# FUNCTION: loadTrainedModel
#
# This function loads the objdetector.pth model (weights trained via Google Colab notebook)
# Loads the model to the CPU.   
############################################################################################
def loadTrainedModel():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = torch.load('/app/flask_app/draw/detector/objdetector.pth',map_location=torch.device('cpu'))
    model.to(device)

    return model

# load the trained model
model = loadTrainedModel()
############################################################################################
# FUNCTION: predictEquationFromImage
#
# This function takes an image as input and feeds it to the model.
# Bounding boxes and classes are predicted for the image.
# Boxes are drawn on the image and saved as a seperate file (to be sent to front-end for user to see)
# The predicted equation is parsed by organizing the bounding boxes from left to right (x-coordinates)
# If the predicted equation/expression involves a variable, the Wolfram Alpha API is queried and its results are sent to the frontend.
# If the prediction does not involve a variable, the eval() function is used to solve the arithmetic expression
############################################################################################
def predictEquationFromImage(image_filename):
    device = torch.device("cpu")
    # read the image as a PIL image
    img = read_image('/app/flask_app/draw/temp.jpg',ImageReadMode.RGB)
    # normalize the image
    img = img.float() / 255
    # set the model to evaluate mode
    model.eval()
    classes = ["background","0","1","2","3","4","5","6","7","8","9","+","-","*","/","(",")","=","x","y","z"]

    # input the image into the model, produce a prediction, no grad means do not adjust NN weights
    with torch.no_grad():
        prediction = model([img.to(device)])[0]

    # apply non-max suppression to the predicted bounding boxes
    nms_prediction = apply_nms(prediction, iou_thresh=0.1)
    print('nms predicted #boxes: ', len(nms_prediction['labels']))
         
    # create an image with boudning box predictions and labels drawn on it
    draw_boxes_on_image(img,nms_prediction['boxes'],nms_prediction['labels'])

    prediction_list_encoded = nms_prediction['labels'].tolist()
    prediction_list_decoded = [classes[label] for label in prediction_list_encoded]
   
    predicted_bbox_list = nms_prediction['boxes'].tolist()

    # if the model did not locate any objects
    if len(predicted_bbox_list) == 0:
        prediction_string = "No objects found"
        return prediction_string
    else:
        # zip the decoded, encoded class labels into a list of tuples
        zipped_labels_bboxes= zip(prediction_list_decoded,predicted_bbox_list)
        # sort each prediction by the bounding boxes' minx value (lower-left corner)
        sorted_by_minx = sorted(zipped_labels_bboxes, key = lambda pair: pair[1][0])

        # sort the labels, sort the bboxes
        sorted_labels, sorted_bboxes = [list(tup) for tup in zip(*sorted_by_minx)]
  
        # create one string combining all predicted classes 
        prediction_string = "".join(sorted_labels)
        current_app.logger.info(prediction_string)

        # check if the prediction_string contains a variable
        # if so, send it to wolfram to be solved
        variables = ["x","y","z"]
        for v in variables:
            if v in prediction_string:
                step_by_step = querywolfram.getStepByStep(prediction_string)
                return prediction_string + "\n" + step_by_step

        # if the prediction_string does not contain a variable, then it is arithmetic
        # use the eval function so solve it
        try: 
            results = str(eval(prediction_string))
        except ZeroDivisionError:
            results = "No solution. Cannot divide by zero!"
        except SyntaxError:
            results = "No solution. Improper syntax!" 
        return prediction_string + "\n=\n"+ results 
