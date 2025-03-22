import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import stamp from "../assets/stamp.png";
import logo from "../assets/logo.jpg";
import loadingGif from "./loading.mp4"; // Loading video/GIF

function BrainTumorPrediction() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [reportMedical, setReportMedical] = useState('');
  const [reportLayman, setReportLayman] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [patientId, setPatientId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  // Bounding box & localization percentage
  const [boundingBox, setBoundingBox] = useState(null);
  const [localizationPercentage, setLocalizationPercentage] = useState(null);

  // Image references & dimensions for overlay
  const imageRef = useRef(null);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
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
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
      setDisplayDimensions({ width: naturalWidth, height: naturalHeight });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !name || !age || !patientId) {
      alert('Please fill out all fields and upload an image.');
      return;
    }
    if (!consent) {
      alert("Please consent to save your medical data.");
      return;
    }
    setLoading(true);
    setReportGenerated(false);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', name);
    formData.append('age', age);
    formData.append('patientId', patientId);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPrediction(data.prediction);
      if (data.report) {
        setReportMedical(data.report.medical);
        setReportLayman(data.report.layman);
      }
      if (data.localization) {
        setBoundingBox(data.localization.bounding_box);
        setLocalizationPercentage(data.localization.percentage);
      } else {
        setBoundingBox(null);
        setLocalizationPercentage(null);
      }
      await generatePDF();
      setReportGenerated(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('pdf-report');
    const downloadButton = input?.querySelector('button');
    if (downloadButton) {
      downloadButton.style.display = 'none';
    }
    if (!input) return;
    const canvas = await html2canvas(input, { background: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('brain-tumor-report.pdf');
    if (downloadButton) {
      downloadButton.style.display = 'block';
    }
  };

  const getClampedScaledBoundingBox = () => {
    if (!boundingBox || !originalDimensions.width || !displayDimensions.width) {
      return null;
    }
    const scaleX = displayDimensions.width / originalDimensions.width;
    const scaleY = displayDimensions.height / originalDimensions.height;
    let left = boundingBox.left * scaleX;
    let top = boundingBox.top * scaleY;
    let width = (boundingBox.right - boundingBox.left) * scaleX;
    let height = (boundingBox.bottom - boundingBox.top) * scaleY;
    if (left < 0) left = 0;
    if (top < 0) top = 0;
    if (left + width > displayDimensions.width) {
      width = displayDimensions.width - left;
    }
    if (top + height > displayDimensions.height) {
      height = displayDimensions.height - top;
    }
    return { left, top, width, height };
  };

  const scaledBox = getClampedScaledBoundingBox();

  return (
    <div className="min-h-screen py-20 bg-[#F0F4F8] flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-[#23c483] mb-8 my-10">
        Brain Tumor Diagnosis
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium text-[#23c483]">
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
          <label htmlFor="age" className="block text-lg font-medium text-[#23c483]">
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
          <label htmlFor="patientId" className="block text-lg font-medium text-[#23c483]">
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

        {/* Consent Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            You consent to save this medical data. T&amp;C applied.
          </label>
        </div>

        {/* Upload Image Section */}
        <div
          style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className={`border-4 border-dashed rounded-lg p-16 text-center ${
            dragActive ? 'border-[#23c483]' : 'border-green-300'
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
          <label htmlFor="fileInput" className="cursor-pointer text-[#23c483] hover:text-[#23c483]">
            {selectedFile ? (
              <p className="text-xl">{selectedFile.name}</p>
            ) : (
              <p className="text-xl">Drag and drop an image here, or click to select a file</p>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[#23c483] text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Diagnose"}
        </button>
      </form>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <img src={loadingGif} alt="Loading..." />
        </div>
      )}

      {/* Report Display */}
      {reportGenerated && (
        <div id="pdf-report" className="mt-8 bg-white p-16 rounded-lg shadow-lg w-full max-w-6xl relative">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-20 h-auto" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center text-[#23c483]">
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
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Diagnosis Result: <span className="font-normal">{prediction}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Medical Report:</p>
            <p className="font-normal">{reportMedical}</p>
          </div>
          <div className="mb-4">
            <p className="text-lg font-semibold">Layman Report:</p>
            <p className="font-normal">{reportLayman}</p>
          </div>

          {selectedFile && (
            <>
              <p className="text-lg font-semibold mb-2">Submitted Image:</p>
              <div
                style={{
                  position: 'relative',
                  width: displayDimensions.width,
                  height: displayDimensions.height,
                  overflow: 'hidden',
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              >
                <img
                  ref={imageRef}
                  onLoad={handleImageLoad}
                  src={imageUrl}
                  alt="Submitted"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                    objectFit: 'cover',
                  }}
                />
                {scaledBox && (
                  <div
                    style={{
                      position: 'absolute',
                      left: scaledBox.left,
                      top: scaledBox.top,
                      width: scaledBox.width,
                      height: scaledBox.height,
                      border: '3px solid red',
                      pointerEvents: 'none',
                    }}
                  />
                )}
                {scaledBox && localizationPercentage && (
                  <div
                    style={{
                      position: 'absolute',
                      left: scaledBox.left,
                      top: scaledBox.top - 25,
                      background: 'rgba(255, 0, 0, 0.8)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {localizationPercentage}%
                  </div>
                )}
              </div>
            </>
          )}

          <div className="absolute top-4 right-4">
            <img src={stamp} alt="Stamp" className="max-w-sm w-32 h-auto" />
          </div>
          <button
            onClick={generatePDF}
            className="w-full bg-[#23c483] text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default BrainTumorPrediction;
