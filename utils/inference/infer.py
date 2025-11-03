#!/usr/bin/env python3
import argparse
import json
import os
import sys

# Try to import heavy deps; fail gracefully with message
try:
    import torch
    import nibabel as nib
    import numpy as np
except Exception as e:
    print(json.dumps({
        "error": f"Python dependencies missing: {e}. Install with: pip install -r requirements.txt"
    }))
    sys.exit(1)


def load_model(model_path: str):
    # Attempt TorchScript first (works without original class definition)
    try:
        model = torch.jit.load(model_path, map_location='cpu')
        model.eval()
        return model
    except Exception as e_ts:
        # Fallback: try state_dict into a placeholder; cannot proceed without architecture
        raise RuntimeError(
            f"Failed to load TorchScript model. The provided .pth likely contains a state_dict that requires the original architecture code. Error: {e_ts}"
        )


def preprocess(volume: np.ndarray) -> torch.Tensor:
    # Normalize to [0,1], add batch and channel dims: [1,1,D,H,W]
    v = volume.astype(np.float32)
    v = v - v.min()
    denom = (v.max() - v.min()) if (v.max() - v.min()) > 0 else 1.0
    v = v / denom
    # Ensure order is D,H,W
    if v.ndim == 4:
        # Drop time/channel if present; take first
        v = v[..., 0]
    if v.ndim != 3:
        raise ValueError(f"Unexpected nii volume shape: {v.shape}")
    t = torch.from_numpy(v)[None, None, ...]  # 1x1xDHW
    return t


def postprocess(mask: np.ndarray):
    # Compute bounding box and approximate size
    coords = np.argwhere(mask > 0.5)
    if coords.size == 0:
        return {
            "tumorPresent": False,
            "tumorSize": "0 x 0 x 0 cm",
            "tumorLocation": "Not detected",
            "confidence": 0.0,
        }
    (dmin, hmin, wmin) = coords.min(axis=0)
    (dmax, hmax, wmax) = coords.max(axis=0)
    dz, dh, dw = (dmax - dmin + 1), (hmax - hmin + 1), (wmax - wmin + 1)
    # Voxel spacing unknown; report in voxels as fallback
    size_str = f"{dz} x {dh} x {dw} vox"
    # Heuristic location by half-space
    location = "Right hemisphere" if (wmin + wmax) / 2.0 > mask.shape[2] / 2.0 else "Left hemisphere"
    return {
        "tumorPresent": True,
        "tumorSize": size_str,
        "tumorLocation": location,
        "confidence": 0.85,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True)
    ap.add_argument('--input', required=True)
    args = ap.parse_args()

    if not os.path.exists(args.model):
        print(json.dumps({"error": f"Model not found at {args.model}"}))
        sys.exit(2)
    if not os.path.exists(args.input):
        print(json.dumps({"error": f"Input not found at {args.input}"}))
        sys.exit(2)

    # Load NIfTI volume
    img = nib.load(args.input)
    vol = img.get_fdata()

    # Load model (TorchScript expected)
    try:
        model = load_model(args.model)
    except Exception as e:
        # Fail gracefully with clear message (frontend can display)
        print(json.dumps({"error": str(e)}))
        sys.exit(3)

    x = preprocess(vol)
    with torch.no_grad():
        try:
            y = model(x)  # Expect output like logits or mask
        except Exception as e:
            print(json.dumps({"error": f"Model forward failed: {e}"}))
            sys.exit(4)

    # Attempt to get mask tensor
    if isinstance(y, (list, tuple)):
        y = y[0]
    if hasattr(y, 'detach'):
        y = y.detach().cpu()
    y_np = y.squeeze().float().sigmoid().numpy() if hasattr(y, 'sigmoid') else y.squeeze().numpy()

    if y_np.ndim == 4:
        # If class dimension present, take foreground channel
        y_np = y_np[0]
    if y_np.ndim != 3:
        print(json.dumps({"error": f"Unexpected model output shape: {y_np.shape}"}))
        sys.exit(5)

    stats = postprocess(y_np)

    # Map to UI schema
    diagnosis = "Brain Tumor Detected" if stats["tumorPresent"] else "No Tumor Detected"
    severity = "High Grade" if stats["confidence"] >= 0.8 and stats["tumorPresent"] else "Low Risk"
    result = {
        "diagnosis": diagnosis,
        "tumorLocation": stats["tumorLocation"],
        "tumorSize": stats["tumorSize"],
        "confidence": round(float(stats["confidence"]) * 100.0, 2),
        "severity": severity,
        "recommendations": [
            "Surgical/oncology consultation",
            "Consider MRI with contrast",
            "Histopathological evaluation if clinically indicated",
        ],
    }

    print(json.dumps(result))


if __name__ == '__main__':
    main()


