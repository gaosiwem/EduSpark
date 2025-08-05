import easyocr

# Initialize the EasyOCR reader with English language support
# Note: Ensure that EasyOCR is installed in your environment.
# You can install it using: pip install easyocr

reader = easyocr.Reader(['en'])

def run_ocr(image_path):
    result = reader.readtext(image_path, detail=0)
    return " ".join(result)