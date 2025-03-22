---

# CareCoder

CareCoder is an AI-powered web application designed to aid in early medical diagnosis. Developed during the HackforImpact IIITD hackathon, our project leverages state-of-the-art AI models and modern web technologies to deliver real-time predictions for critical health conditions including brain tumors, breast cancer, pneumonia, and skin cancer.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Models](#models)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)

---

## Overview

CareCoder aims to empower both patients and medical professionals with rapid and accurate diagnostic insights. The application combines a responsive front-end built with React and a robust back-end developed with Flask. Our solution showcases how advanced AI techniques can be integrated into a user-friendly interface to support early diagnosis and timely intervention.

---

## Features

- **Multi-Disease Prediction:**  
  Predictive modules for brain tumor, breast cancer, pneumonia, and skin cancer.

- **Interactive UI:**  
  A modern, responsive design that ensures a smooth user experience on both desktop and mobile devices.

- **Real-Time Feedback:**  
  Instantaneous predictions and visualizations help users understand potential outcomes.

- **Data Visualization & Articles:**  
  The platform keeps users informed with the latest articles and trends in the medical domain.

- **Seamless Integration:**  
  A clear division between front-end and back-end operations demonstrates an effective full-stack solution.

---

## Tech Stack

- **AI Models:**  
  - Vision Transformer Models (VIT)  
  - Retrieval Augmented Generation (RAG)

- **Front-End:**  
  - React

- **Back-End:**  
  - Flask

- **Cloud Database:**  
  - MongoDB Atlas

---

## Models

All the AI models used in this project can be downloaded from the following drive link:  
[Download AI Models](https://drive.google.com/file/d/1bzpep_hQX5ZgwQUHm8yXnjD3flw6XbqT/view?usp=drive_link)

---

## Architecture

The project is structured into two primary parts:

1. **CareCoder (Front-End):**  
   Contains all the UI components, pages, and assets required to render the interactive application. The modular design is evident in components like `BrainTumorPrediction.jsx`, `BreastCancerPrediction.jsx`, and others, each dedicated to a specific diagnostic function.

2. **Flask (Back-End):**  
   Manages server-side logic by handling API endpoints and integrating AI models to generate predictions based on user inputs.

---

## Installation & Setup

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm (Node Package Manager)

### Front-End Setup

1. Navigate to the `CareCoder` directory:
   ```bash
   cd CareCoder
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Back-End Setup

1. Navigate to the `Flask` directory:
   ```bash
   cd ../Flask
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```

---

## Usage

- **User Interface:**  
  The application is designed to be intuitive. Once the front-end is running, users can navigate directly to the prediction modules from the landing page. Each module guides the user through the necessary inputs and displays the corresponding prediction.

- **API Interaction:**  
  The front-end communicates with the Flask API to fetch predictions. Any data provided by the user is processed on the server, and results are returned in real time.

- **Testing:**  
  Ensure that both the front-end and back-end servers are running simultaneously. Use browser developer tools to inspect network requests and validate API responses.

---

## Future Improvements

- **Enhanced Model Accuracy:**  
  Further refine AI models and experiment with additional architectures to boost diagnostic precision.
  
- **User Authentication:**  
  Introduce user login and personalized dashboards to enable long-term tracking of health data.

- **Expanded Diagnostic Coverage:**  
  Extend the predictive capabilities to cover more health conditions based on user feedback and new research.

- **Accessibility & Localization:**  
  Enhance accessibility and provide multi-language support for a broader audience.

---

## Acknowledgements

We extend our gratitude to the HackforImpact IIITD hackathon organizers and judges for providing an inspiring platform to innovate and build impactful solutions. Special thanks to our mentors and peers for their invaluable guidance throughout the project.
