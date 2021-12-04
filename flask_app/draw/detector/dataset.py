import os
import torch
from torch.utils.data import Dataset
from torchvision.io import read_image
import linecache
import xml.etree.ElementTree as ET

# Define the class PyTorch Custom Dataset class for Math Culture's dataset of handwritten characters
# /content/dataset/JPEGImages/  -> the .jpg image set (training+validation)
# /content/dataset/Annotations/ -> set of .xmls that correspond to each image name (i.e. 000564.jpg has an annotation .xml titled 000564.xml) 
# an annotation includes: class label and ground-truth bounding box
class MCImageDataset(Dataset):
    def __init__(self, txt_file, root_dir, transform=None):
        self.txt_file = txt_file
        self.root_dir = root_dir
        self.transform = transform
        self.classes = ["background","zero","one","two","three","four","five","six","seven","eight","nine","plus","minus","mult","division","lpar","rpar","equal","x","y","z"]
        self.num_classes = len(self.classes)
        
    def __len__(self):
        # Length of the dataset is the number of lines in the train.txt file
        return sum(1 for line in open(self.txt_file))

    def __getitem__(self,index):
        # linecache.getline() index starts at 1
        # image file path for current index
        image_path = os.path.join(self.root_dir,"JPEGImages/",linecache.getline(self.txt_file,index+1).strip()[:-4] + ".jpg")
        # annotation file path for current index 
        annotation_path = os.path.join(self.root_dir,"Annotations/",linecache.getline(self.txt_file,index+1).strip()[:-4] + ".xml")
        # read the image as a PIL image
        image = read_image(image_path)
        # normalize the image
        image = image.float() / 255

        # begin xml parsing
        tree = ET.parse(annotation_path)
        root = tree.getroot()
        
        # a test image may contain multiple objects, and therefore multiple class labels/bounding boxes per image
        labels = []
        boxes = []
        # for each object in the current annotation file
        for obj in root.findall("object"):
            # add the label to the labels list
            name = obj.find('name').text
            # encode the label as by its index in the Dataset's classes list
            encoded_label = self.classes.index(name)
            labels.append(encoded_label)

            # add the bounding box to the bounding box list
            bbox = obj.find('bndbox')
            x1,y1,x2,y2 = int(bbox.find('xmin').text), int(bbox.find('ymin').text), int(bbox.find('xmax').text),int(bbox.find('ymax').text)
            boxes.append([x1,y1,x2,y2])

        if self.transform:
            image = self.transform(image)

        # convert boxes and labels to PyTorch tensors
        boxes = torch.as_tensor(boxes, dtype=torch.float32)
        labels = torch.as_tensor(labels, dtype=torch.int64)
        # area and iscrowd satisfies COCO's eval tool, although they are not used for this project
        area = (boxes[:, 3] - boxes[:, 1]) * (boxes[:, 2] - boxes[:, 0])
        num_objs = len(root.findall("object"))
        iscrowd = torch.zeros((num_objs,), dtype=torch.int64)

        # create a dictionary (target) that includes all of the objects labels and bboxes
        target = {}
        target["boxes"] = boxes
        target["labels"] = labels
        target["image_id"] = torch.tensor([index])
        target["area"] = area
        target["iscrowd"] = iscrowd

        # return the image and its annotation
        return image,target
