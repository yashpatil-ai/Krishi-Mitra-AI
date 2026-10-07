from pathlib import Path

root = Path("backend/ml/datasets/processed/disease_detection_split")

for split in ["train", "val", "test"]:
    counts = []

    for class_dir in sorted((root / split).iterdir()):
        if class_dir.is_dir():
            count = sum(1 for f in class_dir.iterdir() if f.is_file())
            counts.append(count)

    print(f"{split}:")
    print("  Classes:", len(counts))
    print("  Unique image counts:", sorted(set(counts)))
    print("  Total images:", sum(counts))
