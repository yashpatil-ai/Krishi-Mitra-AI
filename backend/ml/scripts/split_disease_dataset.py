from pathlib import Path
import shutil
import random

src = Path("backend/ml/datasets/processed/disease_detection")
dst = Path("backend/ml/datasets/processed/disease_detection_split")

random.seed(42)

if dst.exists():
    shutil.rmtree(dst)

for split in ["train", "val", "test"]:
    (dst / split).mkdir(parents=True, exist_ok=True)

for class_dir in sorted(src.iterdir()):
    if not class_dir.is_dir():
        continue

    images = [f for f in class_dir.iterdir() if f.is_file()]
    random.shuffle(images)

    train_images = images[:105]
    val_images = images[105:127]
    test_images = images[127:]

    for split, files in [
        ("train", train_images),
        ("val", val_images),
        ("test", test_images),
    ]:
        target = dst / split / class_dir.name
        target.mkdir(parents=True, exist_ok=True)

        for image in files:
            shutil.copy2(image, target / image.name)

print("Split created")
print("Train:", sum(1 for f in (dst / "train").rglob("*") if f.is_file()))
print("Validation:", sum(1 for f in (dst / "val").rglob("*") if f.is_file()))
print("Test:", sum(1 for f in (dst / "test").rglob("*") if f.is_file()))
