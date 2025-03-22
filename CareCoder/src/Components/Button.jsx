import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ label, href }) => {
  const isExternalLink = href.startsWith('http') || href.startsWith('mailto');

  return (
    <>
      {isExternalLink ? (
        <a
          href={href}
          className="relative inline-flex items-center justify-center p-4 px-6 py-2 my-5 overflow-hidden font-medium text-[#23c483] transition duration-1000 ease-all border-2 border-[#23c483] rounded-md shadow-lg hover:shadow-2xl hover:shadow-[#50b48c] group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#23c483] group-hover:translate-x-0 ease">
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-green-500 transition-all duration-300 transform group-hover:translate-x-full ease">
            {label}
          </span>
          <span className="relative invisible">{label}</span>
        </a>
      ) : (
        <Link
          to={href}
          className="relative inline-flex items-center justify-center p-4 px-6 py-2 my-5 overflow-hidden font-medium text-[#23c483] transition duration-1000 ease-all border-2 border-[#23c483] rounded-md shadow-lg hover:shadow-2xl hover:shadow-[#50b48c] group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#23c483] group-hover:translate-x-0 ease">
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-green-500 transition-all duration-300 transform group-hover:translate-x-full ease">
            {label}
          </span>
          <span className="relative invisible">{label}</span>
        </Link>
      )}
    </>
  );
};

export default Button;
