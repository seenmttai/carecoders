---

# CareCoder

CareCoder is an AI-powered web application designed to aid in early medical diagnosis. Developed during the HackforImpact IIITD hackathon, our project leverages modern technologies to deliver real-time predictions for critical health conditions including brain tumors, breast cancer, pneumonia, and skin cancer.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Acknowledgements](#acknowledgements)

---

## Overview

CareCoder aims to empower both patients and medical professionals with rapid and accurate diagnostic insights. The application combines a responsive front-end built with React (powered by Vite) and Tailwind CSS with a robust Flask back-end. The solution demonstrates how machine learning models and modern web technologies can be integrated into a user-friendly interface to support early diagnosis and timely intervention.

---

## Features

- **Multi-Disease Prediction:**  
  Predictive modules for brain tumor, breast cancer, pneumonia, and skin cancer.

- **Interactive UI:**  
  A modern, responsive design that ensures smooth user experience on both desktop and mobile devices.

- **Real-Time Feedback:**  
  Instantaneous predictions and visualizations help users understand the potential outcomes.

- **Data Visualization & Articles:**  
  Latest articles and updates in the medical domain are integrated to keep users informed about health trends.

- **Seamless Integration:**  
  The project bridges the gap between a front-end interface and back-end processing, demonstrating an effective full-stack solution.

---

## Tech Stack

- **Front-End:**  
  - React (with Vite for fast development)
  - Tailwind CSS for styling
  - JavaScript (ES6+)

- **Back-End:**  
  - Flask (Python) for API development and ML model integration

- **Utilities:**  
  - Axios for HTTP requests
  - Framer Motion for animations
  - Additional libraries for data visualization and interactive elements

---

## Architecture

The project is structured into two primary parts:

1. **CareCoder (Front-End):**  
   Contains all the UI components, pages, and assets required to render the interactive application. Components such as `BrainTumorPrediction.jsx`, `BreastCancerPrediction.jsx`, and others illustrate modular design for each diagnostic feature.

2. **Flask (Back-End):**  
   Manages server-side logic, handling data processing, API endpoints, and interfacing with machine learning models that generate predictions based on user inputs.

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
  The application is designed to be intuitive. Once the front-end is running, users can navigate to the prediction modules directly from the landing page. Each module guides the user through input requirements and displays the corresponding prediction.

- **API Interaction:**  
  The front-end communicates with the Flask API to fetch predictions. Any data sent by the user is processed on the server and results are returned in real time.

- **Testing:**  
  Ensure that both the front-end and back-end servers are running simultaneously. You can use browser developer tools to inspect network requests and validate API responses.

---

## Future Improvements

- **Enhanced Model Accuracy:**  
  Integrate more sophisticated machine learning models and fine-tune parameters to improve diagnostic accuracy.
  
- **User Authentication:**  
  Implement user login and personalized dashboards to track health data over time.

- **Expanded Health Coverage:**  
  Extend predictive capabilities to cover additional health conditions based on user feedback and further research.

- **Accessibility & Localization:**  
  Ensure the application is accessible to all users and offer multi-language support.

---

## Acknowledgements

We would like to extend our gratitude to the HackforImpact IIITD hackathon organizers and judges for providing an inspiring platform to innovate and build impactful solutions. Special thanks to our mentors and peers for their invaluable guidance throughout the project.

