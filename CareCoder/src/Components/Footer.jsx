import React from "react";

const companyLinks = [
  { name: "About", link: "/workinprogress" },
  { name: "Testimonials", link: "/workinprogress" },
  { name: "Find a doctor", link: "/workinprogress" },
];

const helpLinks = [
  { name: "Help center", link: "//workinprogress" },
  { name: "Instructions", link: "//workinprogress" },
  { name: "How it works", link: "//workinprogress" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#23c483] to-[#40ab80] text-white p-8 lg:p-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold">Diagno Plus</h3>
          <p className="mt-4 text-white">
            Empowering healthcare with AI-driven diagnostics.
          </p>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-xl font-bold">Company</h3>
          <ul className="mt-4 space-y-2">
            {companyLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.link}
                  className="text-white relative ease hover:underline transition-all duration-1000 before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-white before:scale-x-0 hover:before:scale-x-100 before:origin-left hover:before:origin-right before:transition-transform"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h3 className="text-xl font-bold">Help</h3>
          <ul className="mt-4 space-y-2">
            {helpLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.link}
                  className="text-white relative hover:underline transition-all duration-300 before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-white before:scale-x-0 hover:before:scale-x-100 before:origin-left hover:before:origin-right before:transition-transform"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold">Follow Us</h3>
        <div className="flex justify-center mt-4 space-x-6">
          <a href="https://facebook.com" className="text-white text-2xl hover:text-gray-200 transition-colors duration-300">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="text-white text-2xl hover:text-gray-200 transition-colors duration-300">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" className="text-white text-2xl hover:text-gray-200 transition-colors duration-300">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" className="text-white text-2xl hover:text-gray-200 transition-colors duration-300">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
