from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

# Load the ML model
model = load_model("saved_model.h5")

# Define a function to process the image and make predictions
def process_image(file_path):
    img = image.load_img(file_path, target_size=(224, 224))  # Resize to match model's input
    img_array = image.img_to_array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    prediction = model.predict(img_array)
    return "Healthy" if prediction[0][0] > 0.5 else "Diabetic"

# API route to handle image upload and prediction
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    img = request.files["image"]
    file_path = os.path.join("uploads", img.filename)
    img.save(file_path)

    try:
        result = process_image(file_path)
        os.remove(file_path)  # Clean up
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
