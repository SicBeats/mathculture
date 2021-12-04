import math
import sys
import time
import torch
import torchvision.models.detection.mask_rcnn
from coco_eval import CocoEvaluator
from coco_utils import get_coco_api_from_dataset

# A function that trains the model for one epoch
def train_one_epoch(model, optimizer,data_loader, device, epoch, print_freq):
    # set the model to training mode
    model.train()
    header = f"Epoch: [{epoch}]"

    # for each batch of image in the dataloader
    for images, targets in data_loader:
        images = list(image.to(device) for image in images)
        targets = [{k: v.to(device) for k, v in t.items()} for t in targets]

        loss_dict = model(images, targets)

        losses = sum(loss for loss in loss_dict.values())

        loss_value = losses.item()

        if not math.isfinite(loss_value):
            print(f"Loss is {loss_value}, stopping training")
            print(loss_dict)
            sys.exit(1)

        optimizer.zero_grad()
        # backpropagate the updated weights
        losses.backward()
        optimizer.step()

# A function that evaluates the model using COCO Dataset API
# mAP (mean average precision) for different IoU thresholds
def evaluate(model, data_loader, device):
    cpu_device = torch.device("cpu")
    model.eval()
    header = "Test:"

    coco = get_coco_api_from_dataset(data_loader.dataset)
    coco_evaluator = CocoEvaluator(coco, ["bbox"])

    with torch.no_grad():
      for images, targets in data_loader:
          images = list(img.to(device) for img in images)

          if torch.cuda.is_available():
            torch.cuda.synchronize()
          model_time = time.time()
          outputs = model(images)

          outputs = [{k: v.to(cpu_device) for k, v in t.items()} for t in outputs]
          model_time = time.time() - model_time

          res = {target["image_id"].item(): output for target, output in zip(targets, outputs)}
          coco_evaluator.update(res)

    # accumulate predictions from all images
    coco_evaluator.accumulate()
    coco_evaluator.summarize()
    return coco_evaluator
