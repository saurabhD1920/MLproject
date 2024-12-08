import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState(null); // State for previewing the image

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please upload an image!");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post("https://mlproject-l9aj.onrender.com", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.result);
    } catch (err) {
      console.error(err);
      alert("Error processing image!");
    }
  };
  //http://127.0.0.1:5000/predict
  return (
    <>
      <div className="navbar">
        <h3>Disease Diagnosis</h3>
      </div>
      <div className="maindiv" style={{ textAlign: "center", marginTop: "50px" }}>
        <div className="topheadmain"><h1>Disease Diagnosis Using Thermal Imaging</h1></div>
        <form onSubmit={handleSubmit}>
          <input className="styleadd" type="file" onChange={handleFileChange} accept="image/*" />
          <button className="hovs" type="submit">Submit</button>
        </form>
        {preview && (
          <div style={{ marginTop: "20px" }}>
            <h3>Uploaded Image:</h3>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "500px",
                maxHeight: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          </div>
        )}
        {result && <h2>Result: {result}</h2>}
      </div>
    </>
  );
}

export default App;


