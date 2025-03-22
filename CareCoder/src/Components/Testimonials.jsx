import React, { useState, useEffect } from 'react';
import dots from '../assets/dots.svg';



const testimonials = [
  {
    name: 'Edward Newgate',
    position: 'Founder Circle',
    quote: 'Our dedicated patient engagement app and web portal allow you to access information instantaneously with no tedious forms, long calls, or administrative hassles, and securely.',
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ZqiKAzev2I1rEMC8iQdUSAQAfPo5-8qoNA&s", // Replace with actual image path
  },
  {
    name: 'Leslie Alexander',
    position: 'CEO HealthCorp',
    quote: 'The digital platform has revolutionized the way we deliver healthcare, making it more accessible and easier to manage.',
    image: "https://headshots-inc.com/wp-content/uploads/2023/03/professional-Headshot-Example-4-1.jpg", // Replace with actual image path
  },
  {
    name: 'John Doe',
    position: 'CTO MediTech',
    quote: 'Trafalgar has improved the overall experience for our patients, providing a seamless interface.',
    image: "https://rozasampolinska.com/wp-content/uploads/sites/13386/2019/12/Newburyport-professional-headshots-boston-corporate-headshots-photo-2-1.jpg", // Replace with actual image path
  },
];

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const { name, position, quote, image } = testimonials[currentIndex];

  return (
    <div className="relative p-8 h-auto md:my-20 bg-white overflow-hidden">
      {/* Testimonial Card with Gradient Background */}
      <div className="relative z-10 p-8 rounded-lg bg-gradient-to-br bg-green-400  mx-auto max-w-5xl flex flex-col items-center text-center">
        
        {/* Heading Inside the Background */}
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          What our customers are saying
        </h2>
        <div className="w-16 h-[2px] bg-white mx-auto mb-6"></div>

        {/* Image, Name, and Position */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-white">{position}</p>
        </div>

        {/* Testimonial Text */}
        <div className="mt-4 text-left lg:text-center max-w-lg text-white/90">
          <p className="italic">{quote}</p>
        </div>
      </div>

      {/* Dots for navigation */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-[#B3D9DA]' : 'bg-[#B3D9DA] opacity-50'
            }`}
          ></div>
        ))}
      </div>

      {/* Centered Arrows for manual navigation */}
      <div className="flex justify-center items-center mt-4 space-x-24">
        <button
          onClick={() =>
            setCurrentIndex(
              currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
            )
          }
          className="text-green-800 text-xl"
        >
          &#8592;
        </button>
        <button
          onClick={() =>
            setCurrentIndex(
              currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
            )
          }
          className="text-green-800 text-xl"
        >
          &#8594;
        </button>
      </div>

      {/* Decorative Dots */}
      <img
        src={dots}
        alt="Decorative Dots"
        className="absolute left-[12em] top-1/4 transform -translate-y-1/2 w-[5em] z-20 opacity-80"
      />
      <img
        src={dots}
        alt="Decorative Dots"
        className="absolute right-[13em] bottom-1/2 transform translate-y-1/2 w-[5em] z-20 opacity-80"
      />
    </div>
  );
}
