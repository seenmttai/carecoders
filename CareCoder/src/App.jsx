import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import Services from './Components/Services';
import Testimonial from './Components/Testimonials';
import Footer from './Components/Footer';
import LatestArticles from './Components/LatestArticles';
import TwoColumnSection from './Components/TwoColumnSection';
import SkinCancerPrediction from './Components/SkinCancerPrediction';
import BreastCancerPrediction from './Components/BreastCancerPrediction';
import BrainTumorPrediction from './Components/BrainTumorPrediction';
import ChatPanel from './Components/ChatPanel'; // Import the ChatPanel
import left from "../src/assets/left.png";
import right from "../src/assets/right.png";

import '@fortawesome/fontawesome-free/css/all.min.css';
import heroimg from "./assets/heroimg.png";
import FeatureUnderDevelopment from './Components/FeatureUnderDevelopement';
import PneumoniaPrediction from './Components/PneumoniaPrediction';

function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Services />
      <TwoColumnSection
        imageSrc={left}
        heading="Skin Cancer Detection"
        description="Early detection of skin cancer can save lives. Learn about our advanced skin cancer prediction tools and get accurate results quickly."
        buttonText="Learn more"
        buttonLink="/skin"
        imageOnLeft={true}
      />
      <TwoColumnSection
        imageSrc={right}
        heading="Breast Cancer Detection"
        description="Breast cancer detection and early diagnosis are crucial. Discover our comprehensive services for breast cancer prediction and care."
        buttonText="Learn more"
        buttonLink="/breast"
        imageOnLeft={false}
      />
      <Testimonial />
      <LatestArticles />
      <Footer />
    </div>
  );
}

function Skin(){
  return (
    <>
      <Navbar />
      <SkinCancerPrediction />
      <Footer />
    </>
  );
}

function Breast(){
  return (
    <>
      <Navbar />
      <BreastCancerPrediction />
      <Footer />
    </>
  );
}

function Dev(){
  return(
    <>
      <Navbar/>
      <FeatureUnderDevelopment/>
    </>
  )
}

function Brain(){
  return (
    <>
      <Navbar />
      <BrainTumorPrediction/>
      <Footer />
    </>
  );
}

function Pneumonia(){
  return (
    <>
      <Navbar />
      <PneumoniaPrediction/>
      <Footer />
    </>
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skin" element={<Skin />} />
        <Route path="/breast" element={<Breast />} />
        <Route path="/brain" element={<Brain />} />
        <Route path="/pneumonia" element={<Pneumonia />} />
        <Route path="/workinprogress" element={<Dev />} />
      </Routes>
      <ChatPanel /> {/* Add the ChatPanel component */}
    </div>
  );
}

export default App;
