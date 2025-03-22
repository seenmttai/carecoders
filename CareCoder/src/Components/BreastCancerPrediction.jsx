import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import stamp from "../assets/stamp.png";
import logo from "../assets/logo.jpg";

function BreastCancerPrediction() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [patientId, setPatientId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [diseaseFacts, setDiseaseFacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !name || !age || !patientId) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("patientId", patientId);

    try {
      const response = await fetch("/api/breastcancer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.predicted_class);

      // Fetch disease facts
      await fetchDiseaseFacts(data.predicted_class);

      // Set loading state before generating PDF
      setLoading(true);

      // Generate PDF report
      await generatePDF();
      setReportGenerated(true);
      setLoading(false); // Hide loader after PDF is generated
    } catch (error) {
      console.error("Error:", error);
      setLoading(false); // Hide loader in case of error
    }
  };

  const fetchDiseaseFacts = async (prediction) => {
    try {
      const response = await fetch(`/api/disease-facts?disease=${prediction}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDiseaseFacts(data.facts || []);
    } catch (error) {
      console.error("Error fetching disease facts:", error);
      setDiseaseFacts([]); // Ensure it's an array on error
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById("pdf-report");

    // Temporarily hide the download button
    const downloadButton = document.querySelector("#pdf-report button");
    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    if (!input) return;

    const canvas = await html2canvas(input, { background: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("breast-cancer-report.pdf");

    // Show the download button again
    if (downloadButton) {
      downloadButton.style.display = "block";
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-20 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-[#23c483] mb-8">
        Breast Cancer Prediction
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        {/* Form Fields */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-lg font-medium text-[#23c483]"
          >
            Patient Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-lg font-medium text-[#23c483]"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="patientId"
            className="block text-lg font-medium text-[#23c483]"
          >
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div
          className={`border-4 border-dashed rounded-lg p-16 text-center ${
            dragActive ? "border-[#23c483]" : "border-[#23c483] opacity-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="fileInput"
          />
           <label
            htmlFor="fileInput"
            className="cursor-pointer text-[#23c483] hover:text-[#23c483]"
          >
            {selectedFile ? (
              <p className="text-xl">{selectedFile.name}</p>
            ) : (
              <p className="text-xl">
                Drag and drop an image here, or click to select a file
              </p>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-[#23c483] text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Predict
        </button>
      </form>

      {!reportGenerated && loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg flex items-center">
            <svg
              className="animate-spin h-10 w-10 text-[#00C342] mr-4"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="none"
                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
              ></path>
            </svg>
            <p className="text-3xl font-semibold text-gray-800">
              Loading your report...
            </p>
          </div>
        </div>
      )}

      {reportGenerated && !loading && (
        <div
          id="pdf-report"
          className="mt-8 bg-white p-16 rounded-lg shadow-lg w-full max-w-4xl relative"
        >
          {/* Logo at the top */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-24 h-auto" />
          </div>

          <h2 className="text-4xl text-center font-bold mb-4 text-[#00C342]">
            Diagno Plus Report
          </h2>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Patient Name: <span className="font-normal">{name}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Age: <span className="font-normal">{age}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Patient ID: <span className="font-normal">{patientId}</span>
            </p>
          </div>

          <div className="mb-8">
            <p className="text-lg font-semibold">
              Result: <span className="font-normal">{result}</span>
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Facts:</h3>
            <ul className="list-disc pl-6">
            {diseaseFacts.map((fact, index) => (
                <li key={index} className="mb-2 text-xl my-5">
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {imageUrl && (
            <div className="mb-4">
              <p className="text-lg font-semibold">Submitted Image:</p>
              <img
                src={imageUrl}
                alt="Submitted"
                className="w-full mx-auto border-2 h-auto rounded-lg max-w-lg my-2"
              />
            </div>
          )}

         

          <div className="absolute top-4 right-4">
            <img src={stamp} alt="Stamp" className=" max-w-sm w-32 h-auto" />
          </div>

          <button
            className="mt-6 w-full bg-[#00C342] text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            onClick={generatePDF}
          >
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default BreastCancerPrediction;
