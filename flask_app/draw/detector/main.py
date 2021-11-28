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

def apply_nms(orig_prediction, iou_thresh=0.3):
    
    # torchvision returns the indices of the bboxes to keep
    keep = torchvision.ops.nms(orig_prediction['boxes'], orig_prediction['scores'], iou_thresh)
    
    final_prediction = orig_prediction
    final_prediction['boxes'] = final_prediction['boxes'][keep]
    final_prediction['scores'] = final_prediction['scores'][keep]
    final_prediction['labels'] = final_prediction['labels'][keep]
    
    return final_prediction

def loadTrainedModel():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = torch.load('/app/flask_app/draw/detector/objdetector.pth',map_location=torch.device('cpu'))
    model.to(device)

    return model

model = loadTrainedModel()
def predictEquationFromImage(image_filename):
    device = torch.device("cpu")
    img = read_image('/app/flask_app/draw/temp.jpg',ImageReadMode.RGB)
        
    img = img.float() / 255
    print(img.size())
    model.eval()
    classes = ["background","0","1","2","3","4","5","6","7","8","9","+","-","*","/","(",")","=","x","y","z"]
    with torch.no_grad():
        prediction = model([img.to(device)])[0]

    nms_prediction = apply_nms(prediction, iou_thresh=0.3)
    print('nms predicted #boxes: ', len(nms_prediction['labels']))
         
    draw_boxes_on_image(img,nms_prediction['boxes'],nms_prediction['labels'])

    prediction_list_encoded = nms_prediction['labels'].tolist()
    prediction_list_decoded = [classes[label] for label in prediction_list_encoded]
   
    predicted_bbox_list = nms_prediction['boxes'].tolist()
    zipped_labels_bboxes= zip(prediction_list_decoded,predicted_bbox_list)
    sorted_by_minx = sorted(zipped_labels_bboxes, key = lambda pair: pair[1][0])

    sorted_labels, sorted_bboxes = [list(tup) for tup in zip(*sorted_by_minx)]
   
    prediction_string = "".join(sorted_labels)
    current_app.logger.info(prediction_string)
    if "x" in prediction_string:
        step_by_step = querywolfram.getStepByStep(prediction_string)
        return prediction_string + "\n" + step_by_step
    else:
        #return prediction_string + "\n" + str(eval(prediction_string))
        return prediction_string
        
