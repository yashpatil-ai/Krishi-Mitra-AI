
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms
from torchvision.models import mobilenet_v3_small
from torch import nn


class DiseaseDetectionModel:
    def __init__(self):
        base_dir = Path(__file__).resolve().parents[2]
        model_path = (
            base_dir
            / "ml"
            / "datasets"
            / "processed"
            / "disease_detection_mobilenet_v3_small.pth"
        )

        self.device = torch.device("cpu")

        checkpoint = torch.load(
            model_path,
            map_location=self.device,
            weights_only=False,
        )

        self.classes = checkpoint["classes"]
        self.image_size = checkpoint["image_size"]

        self.model = mobilenet_v3_small(weights=None)

        self.model.classifier[3] = nn.Linear(
            self.model.classifier[3].in_features,
            len(self.classes),
        )

        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize(
                (self.image_size, self.image_size)
            ),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=checkpoint["mean"],
                std=checkpoint["std"],
            ),
        ])

    def predict(self, image: Image.Image) -> dict:
        image = image.convert("RGB")
        tensor = self.transform(image).unsqueeze(0)
        tensor = tensor.to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted_index = probabilities.max(dim=1)

        predicted_class = self.classes[predicted_index.item()]

        return {
            "disease": predicted_class,
            "confidence": round(confidence.item(), 4),
        }


disease_detection_model = DiseaseDetectionModel()
