from PIL import Image

def make_white_transparent(input_path, output_path, threshold=240):
    """
    Converts white (or near-white) pixels to transparent.
    
    threshold: 0–255, higher = stricter white detection
    """

    img = Image.open(input_path).convert("RGBA")
    pixels = img.getdata()

    new_pixels = []
    for r, g, b, a in pixels:
        if r >= threshold and g >= threshold and b >= threshold:
            # Make pixel transparent
            new_pixels.append((r, g, b, 0))
        else:
            new_pixels.append((r, g, b, a))

    img.putdata(new_pixels)
    img.save(output_path, "PNG")

    print(f"Saved transparent image to: {output_path}")


if __name__ == "__main__":
    make_white_transparent(
        input_path="/home/jordyn/Documents/Capstone/Repos/AssetTracking/frontend/src/logo.png",
        output_path="/home/jordyn/Documents/Capstone/Repos/AssetTracking/frontend/output.png"
    )
