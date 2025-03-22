import React from 'react';
import searchh from '../assets/search.svg';
import swig from '../assets/swig.svg'; // Import the swig.svg

export default function Services() {
  const services = [
    { title: 'Search doctor', description: 'Find specialist doctors and general hospitals.', icon: searchh },
    { title: 'Online pharmacy', description: 'Order your medications online easily.', icon: searchh },
    { title: 'Consultation', description: 'Book online consultations.', icon: searchh },
    { title: 'Emergency care', description: '24/7 urgent care.', icon: searchh },
    { title: 'Tracking', description: 'Track your medical history.', icon: searchh },
    { title: 'Search doctor', description: 'Find specialist doctors and general hospitals.', icon: searchh },
  ];

  return (
    <div className="relative p-8 lg:p-16 mx-10 md:mx-24 z-10">
      {/* Swig SVG as a background */}
      <div className="absolute inset-10 z-0">
        <img 
          src={swig} 
          alt="Swig" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-auto hidden md:block opacity-20 md:-ms-[10em]" 
        />
      </div>

      {/* Content in front of the background */}
      <h2 className="text-3xl lg:text-4xl font-bold text-center relative z-10">Our services</h2>
      <div className='w-40 bg-gray-300 rounded-xl h-1 mx-auto mt-5 relative z-10'></div>
      <p className="text-center text-gray-600 mt-4 relative z-10">
        Adjust to your health needs and make sure you have access to the best care.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 relative z-10">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="p-8 bg-white rounded-lg border border-gray-300 hover:shadow-xl hover:scale-105 transition-transform transition-shadow duration-300 ease-in-out text-center"
          >
            <img src={service.icon} alt={service.title} className="mb-5 w-16 h-16 mx-auto" />
            <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
            <p className="mt-2 text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
