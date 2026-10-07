from pathlib import Path

import pandas as pd


REFERENCE_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "datasets"
    / "processed"
    / "fertilizer_reference.csv"
)


class FertilizerRecommendationEngine:
    def __init__(self) -> None:
        if not REFERENCE_PATH.exists():
            raise FileNotFoundError(
                f"Fertilizer reference dataset not found: {REFERENCE_PATH}"
            )

        self.data = pd.read_csv(REFERENCE_PATH)

    def _status(self, current: float, required: float) -> str:
        tolerance = required * 0.10

        if current < required - tolerance:
            return "low"

        if current > required + tolerance:
            return "high"

        return "adequate"

    def recommend(
        self,
        crop: str,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        ph: float,
    ) -> dict:
        matches = self.data[
            self.data["Crop"].str.casefold() == crop.strip().casefold()
        ]

        if matches.empty:
            raise ValueError(f"Crop not found in fertilizer reference data: {crop}")

        reference = matches.iloc[0]

        nitrogen_required = float(reference["N"])
        phosphorus_required = float(reference["P"])
        potassium_required = float(reference["K"])

        crop_ph_min = float(matches["pH"].min())
        crop_ph_max = float(matches["pH"].max())

        nitrogen_status = self._status(nitrogen, nitrogen_required)
        phosphorus_status = self._status(phosphorus, phosphorus_required)
        potassium_status = self._status(potassium, potassium_required)

        if ph < crop_ph_min:
            ph_status = "low"
        elif ph > crop_ph_max:
            ph_status = "high"
        else:
            ph_status = "adequate"

        recommendations = []

        if nitrogen_status == "low":
            recommendations.append("Nitrogen fertilizer may be needed.")
        elif nitrogen_status == "high":
            recommendations.append("Avoid additional nitrogen until soil levels are reassessed.")

        if phosphorus_status == "low":
            recommendations.append("Phosphorus fertilizer may be needed.")
        elif phosphorus_status == "high":
            recommendations.append("Avoid additional phosphorus until soil levels are reassessed.")

        if potassium_status == "low":
            recommendations.append("Potassium fertilizer may be needed.")
        elif potassium_status == "high":
            recommendations.append("Avoid additional potassium until soil levels are reassessed.")

        if ph_status == "low":
            recommendations.append("Soil pH is below the reference range for this crop.")
        elif ph_status == "high":
            recommendations.append("Soil pH is above the reference range for this crop.")

        if not recommendations:
            recommendations.append("N, P, K and pH are within the reference range for this crop.")

        return {
            "crop": str(reference["Crop"]),
            "nitrogen_required": nitrogen_required,
            "phosphorus_required": phosphorus_required,
            "potassium_required": potassium_required,
            "nitrogen_status": nitrogen_status,
            "phosphorus_status": phosphorus_status,
            "potassium_status": potassium_status,
            "ph_status": ph_status,
            "recommendations": recommendations,
        }


fertilizer_engine = FertilizerRecommendationEngine()
