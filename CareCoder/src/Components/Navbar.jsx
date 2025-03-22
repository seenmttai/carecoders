import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Brain Tumor', path: '/brain'},
    { name: 'Lung Cancer', path: '/skin' },
    { name: 'Breast Cancer', path: '/breast' },
    { name: 'Testimonials', path: '/workinprogress' },
    { name: 'About Us', path: '/workinprogress' },
  ];

  return (
    <nav className="flex justify-between items-center bg-white shadow-md py-2 px-6 md:px-10 z-50 relative">
      <div className="text-2xl font-bold">
        <Link to="/">
          <img src={logo} alt="Logo" className="w-24" />
        </Link>
      </div>
      {/* Hamburger icon */}
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {/* Nav links */}
      <ul
        className={`lg:flex lg:space-x-8 lg:items-center lg:static lg:flex-row flex-col ${
          isOpen ? 'block' : 'hidden'
        } absolute top-16 left-0 right-0 bg-white lg:bg-transparent p-6 lg:p-0 z-50`}
      >
        {navLinks.map((link, index) => (
          <li
            key={index}
            className="text-gray-700 hover:text-[#23c483] lg:my-0 my-2 transition duration-300"
          >
            <Link to={link.path} onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
