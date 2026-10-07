from pathlib import Path
import torch
from torch import nn
from torchvision import datasets, transforms
from torchvision.models import mobilenet_v3_small
from sklearn.metrics import classification_report, confusion_matrix

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / "datasets" / "processed" / "disease_detection_split"
MODEL = BASE / "datasets" / "processed" / "disease_detection_mobilenet_v3_small.pth"
REPORT = BASE / "datasets" / "processed" / "disease_detection_report.txt"

checkpoint = torch.load(MODEL, map_location="cpu", weights_only=False)

model = mobilenet_v3_small(weights=None)
model.classifier[3] = nn.Linear(
    model.classifier[3].in_features,
    len(checkpoint["classes"]),
)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

transform = transforms.Compose([
    transforms.Resize((checkpoint["image_size"], checkpoint["image_size"])),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=checkpoint["mean"],
        std=checkpoint["std"],
    ),
])

dataset = datasets.ImageFolder(DATA / "test", transform=transform)
loader = torch.utils.data.DataLoader(
    dataset,
    batch_size=16,
    shuffle=False,
)

y_true = []
y_pred = []

with torch.no_grad():
    for images, labels in loader:
        outputs = model(images)
        predictions = outputs.argmax(dim=1)

        y_true.extend(labels.tolist())
        y_pred.extend(predictions.tolist())

report = classification_report(
    y_true,
    y_pred,
    target_names=dataset.classes,
    digits=4,
    zero_division=0,
)

matrix = confusion_matrix(y_true, y_pred)

REPORT.write_text(
    "Disease Detection Model Evaluation\n"
    "=================================\n\n"
    f"Test images: {len(dataset)}\n"
    f"Classes: {len(dataset.classes)}\n\n"
    "Classification Report\n"
    "---------------------\n"
    + report
    + "\n\nConfusion Matrix\n"
    "----------------\n"
    + str(matrix)
    + "\n",
    encoding="utf-8",
)

print(f"Evaluation report saved to: {REPORT}")
