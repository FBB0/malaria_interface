import React from 'react';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#333333] text-white py-8 bottom-0 left-0 right-0"> {/* Removed 'fixed' class */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               className="border border-white rounded-md p-2 hover:bg-white hover:text-gray-800 transition-colors">
              <FaLinkedin size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
               className="border border-white rounded-md p-2 hover:bg-white hover:text-gray-800 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               className="border border-white rounded-md p-2 hover:bg-white hover:text-gray-800 transition-colors">
              <FaGithub size={24} />
            </a>
          </div>

          {/* Contact Information */}
          <div className="text-center mb-4 md:mb-0">
            <a href="mailto:info@teamepoch.net" className="hover:underline">
              info@teamepoch.net
            </a>
            <p className="mt-2">TU Delft - Dream Hall</p>
            <p>Stevinweg 4, 2628 CN Delft</p>
          </div>

          {/* Logo */}
          <div>
            <img 
              src="/assets/Epoch_Logo_Light.png" 
              alt="Epoch Logo" 
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;