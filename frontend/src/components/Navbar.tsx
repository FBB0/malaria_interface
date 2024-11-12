import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
      >
        ☰ Menu
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl">
          <Link
            to="/"
            className="block px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/model-info"
            className="block px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Model Info
          </Link>
        </div>
      )}
    </div>
  );
}