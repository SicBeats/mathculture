import os
import torch
from torch.utils.data import Dataset
from torchvision.io import read_image
import linecache
import xml.etree.ElementTree as ET

# /content/dataset/JPEGImages/  -> the .jpg image set (training+validation)
# /content/dataset/Annotations/ -> set of .xmls that correspond to each image name (i.e. 000564.jpg has an annotation .xml titled 000564.xml) 
# an annotation includes: class label and ground-truth bounding box

class MCImageDataset(Dataset):
    def __init__(self, txt_file, root_dir, transform=None):
        self.txt_file = txt_file
        self.root_dir = root_dir
        self.transform = transform
        self.classes = ["background","zero","one","two","three","four","five","six","seven","eight","plus","lpar"]
        self.num_classes = len(self.classes)
        
    def __len__(self):
        return sum(1 for line in open(self.txt_file))

    def __getitem__(self,index):
        # linecache.getline() index starts at 1
        image_path = os.path.join(self.root_dir,"JPEGImages/",linecache.getline(self.txt_file,index+1).strip()[:-4] + ".jpg")
        # linecache.getline() index starts at 1
        annotation_path = os.path.join(self.root_dir,"Annotations/",linecache.getline(self.txt_file,index+1).strip()[:-4] + ".xml")
        image = read_image(image_path)
        image = image.float() / 255

        # begin xml parsing
        tree = ET.parse(annotation_path)
        root = tree.getroot()
        
        # a test image may contain multiple objects, and therefore multiple class labels/bounding boxes per image
        # objects: an array of dictionaries, each dict represents an object
        # each object has a class label and bounding box coordinates 
        labels = []
        boxes = []
        for obj in root.findall("object"):
            name = obj.find('name').text
            encoded_label = self.classes.index(name)
            labels.append(encoded_label)

            bbox = obj.find('bndbox')
            x1,y1,x2,y2 = int(bbox.find('xmin').text), int(bbox.find('ymin').text), int(bbox.find('xmax').text),int(bbox.find('ymax').text)
            boxes.append([x1,y1,x2,y2])

        if self.transform:
            image = self.transform(image)

        boxes = torch.as_tensor(boxes, dtype=torch.float32)
        labels = torch.as_tensor(labels, dtype=torch.int64)
        area = (boxes[:, 3] - boxes[:, 1]) * (boxes[:, 2] - boxes[:, 0])
        num_objs = len(root.findall("object"))
        iscrowd = torch.zeros((num_objs,), dtype=torch.int64)

        target = {}
        target["boxes"] = boxes
        target["labels"] = labels
        target["image_id"] = torch.tensor([index])
        target["area"] = area
        target["iscrowd"] = iscrowd

        return image,target

def collate_fn(batch):
    base_image_list, target_list = [],[]
    for _base_image, _target in batch:
        base_image_list.append(_base_image)
        target_list.append(_target)
    return base_image_list,target_list
