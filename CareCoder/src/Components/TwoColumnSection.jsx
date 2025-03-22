import React from 'react';
import Button from './Button'; // Import the Button component

const TwoColumnSection = ({ imageSrc, heading, description, buttonText, buttonLink, imageOnLeft = true }) => {
  return (
    <div className="py-16 bg-white">
      <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 px-6 lg:px-12 ${imageOnLeft ? '' : 'lg:flex-row-reverse'}`}>
        {/* Left/Right side: Image */}
        <div className="w-full lg:w-1/2">
          <img src={imageSrc} alt="Section Image" className="w-full h-auto" />
        </div>

        {/* Left/Right side: Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
          <div className="w-16 h-[2px] bg-gray-400 mb-4 mx-auto lg:mx-0"></div>
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          <Button href={buttonLink} label={buttonText} />
        </div>
      </div>
    </div>
  );
};

export default TwoColumnSection;
