from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "datasets"
    / "processed"
    / "crop_recommendation_model.joblib"
)


class CropRecommendationModel:
    def __init__(self) -> None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Crop recommendation model not found: {MODEL_PATH}"
            )

        bundle = joblib.load(MODEL_PATH)

        self.model = bundle["model"]
        self.features = bundle["features"]
        self.classes = bundle["classes"]

    def predict(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float,
    ) -> str:
        input_data = pd.DataFrame(
            [
                {
                    "N": nitrogen,
                    "P": phosphorus,
                    "K": potassium,
                    "temperature": temperature,
                    "humidity": humidity,
                    "ph": ph,
                    "rainfall": rainfall,
                }
            ],
            columns=self.features,
        )

        prediction = self.model.predict(input_data)[0]

        return str(prediction)


crop_recommendation_model = CropRecommendationModel()
