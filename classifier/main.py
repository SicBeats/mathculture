import torch
import torchvision
from torchvision.io import read_image
import torchvision.transforms as transforms
from neuralnet import Net
from torch.utils.data import Dataset, DataLoader, Subset
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np

def imshow(img):
  plt.imshow(img.permute(1,2,0))
  plt.show()

# 9008 images in dataset
# training: 60% (5404.8) -> (5404)
# validation: 20% (1801.6) -> (1802)
# testing: 20%(1801.6) -> (1802)

transform = transforms.Compose([transforms.Resize((100,100)), transforms.ToTensor()])

dataset = torchvision.datasets.ImageFolder(root="/app/classifier/dataset",transform=transform)

lengths = [5404,1802,1802]
trainset, valset, testset = torch.utils.data.dataset.random_split(dataset,lengths)
trainloader = DataLoader(trainset, batch_size=4, num_workers=2)
valloader = DataLoader(valset,batch_size=4,num_workers=2)
testloader = DataLoader(testset,batch_size=4,num_workers=2)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
net = Net()
net.load_state_dict(torch.load('/app/classifier/checkpoint.pth', map_location=torch.device('cpu')))
net.to(device)  

plus = (read_image('/app/classifier/test_images/plus.jpg'))
three = (read_image('/app/classifier/test_images/three.jpg'))
five = (read_image('/app/classifier/test_images/five.jpg'))
one = (read_image('/app/classifier/test_images/one.jpg'))

transform = transforms.Compose(
    [transforms.Resize((100,100)),
     transforms.ConvertImageDtype(torch.float32)]
)

test_imgs = [plus,three,five,one]
test_truths = ["plus","three","five","one"]

#print(dataset.class_to_idx)
idx_to_class = {v: k for k, v in dataset.class_to_idx.items()}
with torch.no_grad():
  for i, img in enumerate(test_imgs):
    img = transform(img)
    imshow(img)
    img = img.permute(0,1,2).unsqueeze(0)
    img = img.to(device)
    out = net(img)
    _, predicted = torch.max(out.data,1)
    class_prediction = idx_to_class[predicted.item()]
   #print("prediction",predicted.item())
    print("truth:",test_truths[i])
    print("prediction:",class_prediction)
    print()
