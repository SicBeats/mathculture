import torch
import torchvision
import torch.nn as nn
import torch.nn.functional as F

class Net(nn.Module):
  # initialize each layer
  def __init__(self):
    super().__init__()
    # a 2D convolutional layer with 3 in-channels, 6 out-channels, kernel_size = 5
    # defaults to stride=1, padding=0
    # in_channels = 3 (R,G,B)
    # out_channels = the number of filters = the number of feature maps produced = the depth of the output
    # kernel_size = the size of the filter matrix
    #               note: color image so each kernel will be of size h*w*3 (R,G,B)
    self.conv1 = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=5)   
  
    self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
    self.conv2 = nn.Conv2d(16, 32, 5)

    self.fc1 = nn.Linear(22*22*32,120)
    self.fc2 = nn.Linear(120, 84)
    # final output comes from the last fully connected layer
    # 16 neurons, represent each possible class
    # classes: %,*,+,-,0,1,2,3,4,5,6,7,8,9,[,]
    self.fc3 = nn.Linear(84,16)

  # Connect our network
  # we implement the operations on on input data here
  def forward(self, x):

    # Q: What will be the dimensions of our convolution output? (input image is 32x32) 
    #    a.k.a. "How does the tensor change as it passes through each layer?
    # A: [(width - kernel_size + 2*padding) / stride] + 1 (times the number of channels a.k.a feature maps)

    # A tensor is essentially an image with an arbitrary number of channels
    # tensor size:
    # input image: 100x100x3 (RGB channels)
    # conv1 output: [(100-5 + 2/0)/1]+1    = 96 (96x96), produces 16 feature maps, so: 96x96x16
    # maxpool1 output: [(96-2 + 2/0)/2]+1 = 48 (48x48), depth does not change, so: 48x48x16
    # conv2 output: [(48-5 + 2/0)/1]+1    = 44 (44x44), produces 32 feature maps, so: 44x44x32 
    # maxpool1 output: [(44-2 + 2/0)/2]+1 = 22  (22x22), depth does not change, so: 22x22x32
    x = self.pool(F.relu(self.conv1(x)))
    x = self.pool(F.relu(self.conv2(x)))
    # in order to provide our 4x4x16 convolutional output tensor to the fully connected network,
    # we must first flatten it to a 1D vector 
    #x = x.view(-1,16 * 4 * 4)
    x = torch.flatten(x,1)
    #print(x.size())
    x = F.relu(self.fc1(x)) 
    x = F.relu(self.fc2(x)) 
    x = self.fc3(x)
    return x
